# Trimodels

A modern AI-powered chat application with a clean white UI design similar to ChatGPT.

## Overview

Trimodels is a multi-model AI chat interface that supports:
- **OpenAI** (GPT-4o, GPT-4o Mini)
- **Anthropic** (Claude 3.5 Sonnet)
- **Google** (Gemini 2.0 Flash)

Users provide their own API keys directly in the chat interface, with real-time streaming responses.

## Project Structure

```
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── ui/             # shadcn/ui base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── label.tsx
│   │   │   ├── Login.tsx       # Login page with email/password
│   │   │   ├── SignUp.tsx      # Signup page with email/password
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ChatArea.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── ModelSelector.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   ├── context/            # React context
│   │   │   └── AuthContext.tsx # Authentication state
│   │   ├── lib/                # Utility functions
│   │   │   └── utils.ts        # cn() helper for classnames
│   │   ├── store/              # Jotai state management
│   │   ├── types/              # TypeScript types
│   │   └── App.tsx             # Main app with routing
│   └── vite.config.ts
├── server/                     # Flask backend
│   ├── app.py                  # API endpoints
│   ├── google_auth.py          # Login manager setup
│   ├── database.py             # Database configuration
│   └── models.py               # User model
└── start.sh                    # Startup script
```

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- wouter for client-side routing
- lucide-react for icons
- Jotai for state management
- React Markdown for rendering responses

### Backend
- Flask with CORS support
- Flask-Login for session management
- Flask-SQLAlchemy with PostgreSQL
- Streaming responses for real-time chat
- Multi-provider AI integration

## Authentication

The app uses email/password authentication:
- Login and Signup pages with modern shadcn/ui design
- Session-based authentication with Flask-Login
- Password hashing with bcrypt

### API Keys (User-provided in chat)
Users enter their own API keys directly in the chat interface:
- OpenAI API Key
- Anthropic API Key
- Google API Key

## Running the App

The app runs on port 5000 (frontend) with the backend on port 5001.
The frontend proxies API requests to the backend.

## Design Features

- Clean white UI design similar to ChatGPT
- Modern shadcn/ui components
- Smooth animations and transitions
- Responsive layout
- Typing indicators during streaming

## Recent Changes

- November 2025: Simplified authentication to email/password only
- November 2025: Rebranded to Trimodels
- November 2025: Added modern shadcn/ui login/signup pages
- November 2025: Added wouter routing for client-side navigation
- November 2025: Clean white UI design implementation
