import { useAtom } from 'jotai'
import { userAtom } from '../store'

export function WelcomeScreen() {
  const [user] = useAtom(userAtom)

  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-6">
        <h1 className="text-5xl mb-2 text-gray-800" style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}>
          OneAI
        </h1>
        <h2 className="text-2xl font-medium mb-4 text-gray-600">
          Welcome {user?.displayName || 'Guest'}
        </h2>
        <p className="text-gray-500 mb-8">
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
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-sm font-medium text-gray-800">{item.title}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
