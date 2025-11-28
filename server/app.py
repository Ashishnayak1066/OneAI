from flask import Flask, request, Response, jsonify, send_from_directory, session
from flask_cors import CORS
from flask_login import current_user
from werkzeug.middleware.proxy_fix import ProxyFix
import os
import logging

from server.database import db
from server.replit_auth import init_login_manager, make_replit_blueprint, require_login

logging.basicConfig(level=logging.DEBUG)

static_folder = os.path.join(os.path.dirname(__file__), '..', 'client', 'dist')
app = Flask(__name__, static_folder=static_folder, static_url_path='')
app.secret_key = os.environ.get("SESSION_SECRET", os.urandom(24).hex())
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
CORS(app, supports_credentials=True)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    'pool_pre_ping': True,
    "pool_recycle": 300,
}

db.init_app(app)
init_login_manager(app)
app.register_blueprint(make_replit_blueprint(), url_prefix="/auth")

with app.app_context():
    from server import models
    db.create_all()
    logging.info("Database tables created")

@app.before_request
def make_session_permanent():
    session.permanent = True

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

@app.route('/')
def serve_index():
    if os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({"status": "healthy", "message": "API server running. Build frontend for full app."})

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/api/user')
def get_user():
    if current_user.is_authenticated:
        return jsonify({
            "authenticated": True,
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "firstName": current_user.first_name,
                "lastName": current_user.last_name,
                "displayName": current_user.display_name,
                "profileImageUrl": current_user.profile_image_url
            }
        })
    return jsonify({"authenticated": False, "user": None})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    model = data.get('model', 'gpt-4o-mini')
    provider = data.get('provider', 'openai')
    history = data.get('history', [])
    
    stripped_msg = message.strip()
    if len(stripped_msg) > 20:
        if stripped_msg.startswith('sk-ant-'):
            session['user_anthropic_api_key'] = stripped_msg
            return Response("API key saved! You can now chat with Anthropic Claude models.", mimetype='text/plain')
        elif stripped_msg.startswith('sk-'):
            session['user_openai_api_key'] = stripped_msg
            return Response("API key saved! You can now chat with OpenAI models.", mimetype='text/plain')
        elif stripped_msg.startswith('AIza'):
            session['user_google_api_key'] = stripped_msg
            return Response("API key saved! You can now chat with Google Gemini models.", mimetype='text/plain')
    
    user_openai_key = session.get('user_openai_api_key')
    user_anthropic_key = session.get('user_anthropic_api_key')
    user_google_key = session.get('user_google_api_key')
    
    def generate():
        try:
            if provider == 'openai':
                yield from stream_openai(message, model, history, user_openai_key)
            elif provider == 'anthropic':
                yield from stream_anthropic(message, model, history, user_anthropic_key)
            elif provider == 'google':
                yield from stream_google(message, model, history, user_google_key)
            else:
                yield "Unknown provider"
        except Exception as e:
            yield f"Error: {str(e)}"
    
    return Response(generate(), mimetype='text/plain')

@app.route('/<path:path>')
def serve_static(path):
    if path.startswith('api/'):
        return jsonify({"error": "Not found"}), 404
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({"error": "Not found"}), 404

def stream_openai(message: str, model: str, history: list, user_api_key: str = None):
    api_key = user_api_key or OPENAI_API_KEY
    if not api_key:
        yield "Please paste your OpenAI API key (starts with sk-) in the chat to use OpenAI models."
        return
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        messages = [{"role": m["role"], "content": m["content"]} for m in history]
        messages.append({"role": "user", "content": message})
        
        stream = client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    except Exception as e:
        yield f"OpenAI Error: {str(e)}"

def stream_anthropic(message: str, model: str, history: list, user_api_key: str = None):
    api_key = user_api_key or ANTHROPIC_API_KEY
    if not api_key:
        yield "Please paste your Anthropic API key in the chat to use Anthropic models."
        return
    
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        
        messages = [{"role": m["role"], "content": m["content"]} for m in history]
        messages.append({"role": "user", "content": message})
        
        with client.messages.stream(
            model=model,
            max_tokens=4096,
            messages=messages
        ) as stream:
            for text in stream.text_stream:
                yield text
    except Exception as e:
        yield f"Anthropic Error: {str(e)}"

def stream_google(message: str, model: str, history: list, user_api_key: str = None):
    api_key = user_api_key or GOOGLE_API_KEY
    if not api_key:
        yield "Please paste your Google API key in the chat to use Google models."
        return
    
    try:
        from google import genai
        from google.genai import types
        
        client = genai.Client(api_key=api_key)
        
        contents = []
        for m in history:
            role = "user" if m["role"] == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part.from_text(text=m["content"])]))
        contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message)]))
        
        stream = client.models.generate_content_stream(
            model=model,
            contents=contents
        )
        
        for chunk in stream:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"Google Error: {str(e)}"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
