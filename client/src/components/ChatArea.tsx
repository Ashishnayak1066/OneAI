import { useAtom } from 'jotai'
import { selectedChatAtom } from '../store'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { ModelSelector } from './ModelSelector'
import { WelcomeScreen } from './WelcomeScreen'

export function ChatArea() {
  const [selectedChat] = useAtom(selectedChatAtom)

  return (
    <div className="flex-1 flex flex-col h-full glass">
      <div className="flex items-center justify-end px-6 py-3 border-b border-purple-500/20">
        <ModelSelector />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedChat ? (
          <MessageList messages={selectedChat.messages} />
        ) : (
          <WelcomeScreen />
        )}
      </div>

      <ChatInput />
    </div>
  )
}
