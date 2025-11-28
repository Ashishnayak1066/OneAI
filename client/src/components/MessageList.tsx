import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import type { Message } from '../types'
import { isLoadingAtom, streamingResponseAtom } from '../store'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading] = useAtom(isLoadingAtom)
  const [streamingResponse] = useAtom(streamingResponseAtom)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages, streamingResponse])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-white/10 text-white/90 border border-purple-500/20'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
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

        {isLoading && streamingResponse && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white/10 text-white/90 border border-purple-500/20">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {streamingResponse}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {isLoading && !streamingResponse && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 bg-white/10 border border-purple-500/20">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-purple-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-purple-400 typing-dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
