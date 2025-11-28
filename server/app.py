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
    
    def generate():
        try:
            if provider == 'openai':
                yield from stream_openai(message, model)
            elif provider == 'anthropic':
                yield from stream_anthropic(message, model)
            elif provider == 'google':
                yield from stream_google(message, model)
            else:
                yield "Unknown provider"
        except Exception as e:
            yield f"Error: {str(e)}"
    
    return Response(generate(), mimetype='text/plain')

def stream_openai(message: str, model: str):
    if not OPENAI_API_KEY:
        yield "Please set your OPENAI_API_KEY in the Secrets tab to use OpenAI models."
        return
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        stream = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": message}],
            stream=True
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    except Exception as e:
        yield f"OpenAI Error: {str(e)}"

def stream_anthropic(message: str, model: str):
    if not ANTHROPIC_API_KEY:
        yield "Please set your ANTHROPIC_API_KEY in the Secrets tab to use Anthropic models."
        return
    
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        
        with client.messages.stream(
            model=model,
            max_tokens=4096,
            messages=[{"role": "user", "content": message}]
        ) as stream:
            for text in stream.text_stream:
                yield text
    except Exception as e:
        yield f"Anthropic Error: {str(e)}"

def stream_google(message: str, model: str):
    if not GOOGLE_API_KEY:
        yield "Please set your GOOGLE_API_KEY in the Secrets tab to use Google models."
        return
    
    try:
        from google import genai
        client = genai.Client(api_key=GOOGLE_API_KEY)
        
        stream = client.models.generate_content_stream(
            model=model,
            contents=[message]
        )
        
        for chunk in stream:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"Google Error: {str(e)}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
