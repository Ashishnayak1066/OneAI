# Palette Chat

A sleek AI-powered chat application with a modern dark theme and glassmorphism UI.

## Overview

Palette Chat is a multi-model AI chat interface that supports:
- **OpenAI** (GPT-4o, GPT-4o Mini)
- **Anthropic** (Claude 3.5 Sonnet)
- **Google** (Gemini 2.0 Flash)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ChatArea.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── ModelSelector.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   ├── store/          # Jotai state management
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   └── vite.config.ts
├── server/                 # Flask backend
│   └── app.py              # API endpoints
└── start.sh                # Startup script
```

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Jotai for state management
- React Markdown for rendering responses

### Backend
- Flask with CORS support
- Streaming responses for real-time chat
- Multi-provider AI integration

## Configuration

### Required API Keys

Add these secrets in the Secrets tab:
- `OPENAI_API_KEY` - For OpenAI models
- `ANTHROPIC_API_KEY` - For Anthropic models  
- `GOOGLE_API_KEY` - For Google Gemini models

## Running the App

The app runs on port 5000 (frontend) with the backend on port 5001.
The frontend proxies API requests to the backend.

## Design Features

- Dark theme with purple/indigo gradient accents
- Glassmorphism effects (blur, transparency)
- Smooth animations and transitions
- Responsive layout
- Custom scrollbars
- Typing indicators during streaming

## Recent Changes

- 2024: Initial build with Palette-inspired design
- Multi-model support (OpenAI, Anthropic, Google)
- Streaming chat responses
- Chat history management
