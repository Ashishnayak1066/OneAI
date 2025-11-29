import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import type { Message } from '../types'
import { isLoadingAtom } from '../store'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading] = useAtom(isLoadingAtom)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const visibleMessages = messages.filter(m => m.content || m.role === 'user')

  const lastMessage = messages[messages.length - 1]
  const showTypingIndicator = isLoading && lastMessage?.role === 'assistant' && !lastMessage?.content

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6 bg-white">
      <div className="max-w-3xl mx-auto space-y-6">
        {visibleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-code:text-gray-800 prose-code:bg-gray-200 prose-pre:bg-gray-200">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {showTypingIndicator && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 bg-gray-100 border border-gray-200">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 typing-dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
