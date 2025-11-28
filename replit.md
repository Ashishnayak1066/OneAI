# Palette Chat

A sleek AI-powered chat application with a modern dark theme and glassmorphism UI.

## Overview

Palette Chat is a multi-model AI chat interface that supports:
- **OpenAI** (GPT-4o, GPT-4o Mini)
- **Anthropic** (Claude 3.5 Sonnet)
- **Google** (Gemini 2.0 Flash)

## Features

- User authentication via Replit Auth (Google, GitHub, email)
- Multi-turn conversations with context preservation
- Real-time streaming responses
- Chat history management
- Responsive dark theme with glassmorphism effects

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
│   │   │   ├── WelcomeScreen.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── store/          # Jotai state management
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   └── vite.config.ts
├── server/                 # Flask backend
│   ├── app.py              # Main API endpoints
│   ├── database.py         # SQLAlchemy setup
│   ├── models.py           # User and OAuth models
│   └── replit_auth.py      # Authentication module
├── start.sh                # Development startup script
└── package.json            # Root build scripts
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
- Flask-Login for session management
- Flask-Dance for OAuth
- SQLAlchemy with PostgreSQL
- Streaming responses for real-time chat

## Configuration

### Required Secrets

Add these in the Secrets tab:
- `SESSION_SECRET` - For secure session management (required)
- `OPENAI_API_KEY` - For OpenAI models
- `ANTHROPIC_API_KEY` - For Anthropic models  
- `GOOGLE_API_KEY` - For Google Gemini models

### Database

Uses PostgreSQL (automatically configured via DATABASE_URL)

## Running the App

**Development**: Both servers run via `start.sh`
- Frontend: Port 5000 (Vite dev server)
- Backend: Port 5001 (Flask dev server)

**Production**: Single port deployment
- Build: `npm run build`
- Run: `gunicorn --bind=0.0.0.0:5000 server.app:app`

## Design Features

- Dark theme with purple/indigo gradient accents
- Glassmorphism effects (blur, transparency)
- Smooth animations and transitions
- Responsive layout
- Custom scrollbars
- Typing indicators during streaming

## Recent Changes

- 2024-11-28: Added Replit Auth for user authentication
- 2024-11-28: Added PostgreSQL database for user storage
- 2024-11-28: Fixed deployment configuration for Autoscale
- 2024-11-28: Initial build with Palette-inspired design
