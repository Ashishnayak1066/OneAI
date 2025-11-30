# OneAI

A simple chat app that lets you talk to multiple AI assistants in one place.

## What is OneAI?

OneAI is like having ChatGPT, Claude, and Google's Gemini all in one app. Instead of switching between different websites, you can chat with any of these AI models from a single, clean interface.

## Features

- **Multiple AI Models** - Choose between:
  - GPT-4o and GPT-4o Mini (OpenAI)
  - Claude Sonnet 4.5 (Anthropic)
  - Gemini 2.5 Flash (Google)

- **Use Your Own API Keys** - You bring your own API keys, so you're in control of your usage and costs

- **Real-time Responses** - See the AI typing its response live, just like in ChatGPT

- **Chat History** - Your conversations are saved so you can continue where you left off

- **Clean Design** - Simple, distraction-free interface that's easy to use

## How It Works

1. **Sign up** with your email and password
2. **Add your API keys** in the Settings (top-right corner)
3. **Pick an AI model** from the dropdown
4. **Start chatting!**

## Getting Your API Keys

To use this app, you'll need API keys from the AI providers you want to use:

| Provider | Where to Get Key |
|----------|------------------|
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) |
| Google | [aistudio.google.com](https://aistudio.google.com/apikey) |

You only need keys for the models you want to use. For example, if you only want to use GPT-4o, you just need an OpenAI key.

## Tech Stack

**Frontend:**
- React with TypeScript
- Tailwind CSS for styling
- Vite for fast development

**Backend:**
- Python Flask
- PostgreSQL database

## Running Locally

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install        # Frontend
   pip install -r requirements.txt  # Backend
   ```
3. Set up your database
4. Run the app:
   ```bash
   ./start.sh
   ```

## Screenshots

The app features a clean, white interface similar to ChatGPT with:
- Sidebar for managing your chats
- Model selector to switch between AI providers
- Settings dropdown for API key management

## License

This project is open source. Feel free to use it, modify it, and make it your own!

---

Made with care by Ashish Nayak
