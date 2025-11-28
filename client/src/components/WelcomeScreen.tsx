export function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          Welcome to Trimodels
        </h1>
        <p className="text-white/60 mb-8">
          Your AI-powered chat assistant. Ask questions, get creative, or just have a conversation.
        </p>
        <div className="grid grid-cols-2 gap-3 text-left">
          {[
            { icon: '💡', title: 'Ask anything', desc: 'Get answers instantly' },
            { icon: '✨', title: 'Be creative', desc: 'Generate ideas & content' },
            { icon: '📝', title: 'Write better', desc: 'Improve your writing' },
            { icon: '🔍', title: 'Learn more', desc: 'Explore any topic' },
          ].map((item) => (
            <div
              key={item.title}
              className="p-3 rounded-xl bg-white/5 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-sm font-medium text-white/90">{item.title}</div>
              <div className="text-xs text-white/50">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
