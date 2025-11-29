interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Welcome to Trimodels
          </h1>
          <p className="text-gray-500">
            Sign in to start chatting with AI
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
          <button
            onClick={onLogin}
            className="w-full py-4 px-6 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            Sign in to Continue
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Sign in with Google, GitHub, or email
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-gray-800 font-medium text-sm">Multiple AI Models</h3>
            <p className="text-gray-500 text-xs mt-1">GPT-4, Claude, Gemini</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="text-gray-800 font-medium text-sm">Chat History</h3>
            <p className="text-gray-500 text-xs mt-1">Save your conversations</p>
          </div>
        </div>
      </div>
    </div>
  )
}
