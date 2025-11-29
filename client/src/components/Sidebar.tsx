import { useAtom, useSetAtom } from 'jotai'
import { chatsAtom, selectedChatIdAtom, deleteChatAtom, userAtom } from '../store'

export function Sidebar() {
  const [chats] = useAtom(chatsAtom)
  const [selectedChatId, setSelectedChatId] = useAtom(selectedChatIdAtom)
  const deleteChat = useSetAtom(deleteChatAtom)
  const [user] = useAtom(userAtom)

  const handleLogout = () => {
    window.location.href = '/auth/logout'
  }

  return (
    <div className="w-64 min-w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-800">
            Trimodels
          </span>
        </div>
      </div>

      <div className="p-3">
        <button
          onClick={() => setSelectedChatId(null)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-black hover:bg-gray-800 transition-all text-white text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                selectedChatId === chat.id
                  ? 'bg-gray-200 border border-gray-300'
                  : 'hover:bg-gray-100 border border-transparent'
              }`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="flex-1 text-sm text-gray-700 truncate">{chat.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteChat(chat.id)
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {chats.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No chats yet. Start a new conversation!
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        <div className="group relative">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt={user.displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-sm text-gray-700 flex-1 truncate">{user?.displayName || 'User'}</span>
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-all"
              title="Log out"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
