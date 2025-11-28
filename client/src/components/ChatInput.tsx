import { useState, useRef, useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import {
  selectedChatIdAtom,
  selectedChatAtom,
  createChatAtom,
  addMessageAtom,
  updateLastMessageAtom,
  isLoadingAtom,
  streamingResponseAtom,
  selectedModelAtom
} from '../store'

export function ChatInput() {
  const [message, setMessage] = useState('')
  const [selectedChatId] = useAtom(selectedChatIdAtom)
  const [selectedChat] = useAtom(selectedChatAtom)
  const createChat = useSetAtom(createChatAtom)
  const addMessage = useSetAtom(addMessageAtom)
  const updateLastMessage = useSetAtom(updateLastMessageAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const setStreamingResponse = useSetAtom(streamingResponseAtom)
  const [selectedModel] = useAtom(selectedModelAtom)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [message])

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)
    setStreamingResponse('')

    let chatId = selectedChatId
    if (!chatId) {
      chatId = createChat(userMessage)
    }

    addMessage({
      chatId,
      message: { role: 'user', content: userMessage }
    })

    addMessage({
      chatId,
      message: { role: 'assistant', content: '' }
    })

    try {
      const history = selectedChat?.messages
        .filter(m => m.content)
        .map(m => ({ role: m.role, content: m.content })) || []
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel.id,
          provider: selectedModel.provider,
          history: history
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let fullResponse = ''
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        if (chunk) {
          fullResponse += chunk
          setStreamingResponse(fullResponse)
          updateLastMessage({ chatId, content: fullResponse })
        }
      }
      
      if (!fullResponse) {
        updateLastMessage({
          chatId,
          content: 'No response received. Please check your API key and try again.'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      updateLastMessage({
        chatId,
        content: `Error: ${errorMessage}. Please check your API key has available credits.`
      })
    } finally {
      setIsLoading(false)
      setStreamingResponse('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-purple-500/20 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 rounded-2xl bg-white/5 border border-purple-500/30 focus-within:border-purple-500/60 transition-all p-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none resize-none px-3 py-2 max-h-[200px]"
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            {isLoading ? (
              <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-white/40 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
