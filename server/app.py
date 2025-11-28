from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    model = data.get('model', 'gpt-4o-mini')
    provider = data.get('provider', 'openai')
    history = data.get('history', [])
    
    def generate():
        try:
            if provider == 'openai':
                yield from stream_openai(message, model, history)
            elif provider == 'anthropic':
                yield from stream_anthropic(message, model, history)
            elif provider == 'google':
                yield from stream_google(message, model, history)
            else:
                yield "Unknown provider"
        except Exception as e:
            yield f"Error: {str(e)}"
    
    return Response(generate(), mimetype='text/plain')

def stream_openai(message: str, model: str, history: list):
    if not OPENAI_API_KEY:
        yield "Please set your OPENAI_API_KEY in the Secrets tab to use OpenAI models."
        return
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        
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

def stream_anthropic(message: str, model: str, history: list):
    if not ANTHROPIC_API_KEY:
        yield "Please set your ANTHROPIC_API_KEY in the Secrets tab to use Anthropic models."
        return
    
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        
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

def stream_google(message: str, model: str, history: list):
    if not GOOGLE_API_KEY:
        yield "Please set your GOOGLE_API_KEY in the Secrets tab to use Google models."
        return
    
    try:
        from google import genai
        from google.genai import types
        
        client = genai.Client(api_key=GOOGLE_API_KEY)
        
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
    app.run(host='0.0.0.0', port=5001, debug=True)
