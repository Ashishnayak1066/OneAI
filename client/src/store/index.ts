import { atom } from 'jotai'
import type { Chat, Message, Model } from '../types'

const generateId = () => Math.random().toString(36).substring(2, 15)

export const chatsAtom = atom<Chat[]>([])

export const selectedChatIdAtom = atom<string | null>(null)

export const selectedChatAtom = atom((get) => {
  const chats = get(chatsAtom)
  const selectedId = get(selectedChatIdAtom)
  return chats.find(chat => chat.id === selectedId) || null
})

export const isLoadingAtom = atom(false)

export const streamingResponseAtom = atom('')

export const modelsAtom = atom<Model[]>([
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google' },
])

export const selectedModelAtom = atom<Model>({
  id: 'gpt-4o-mini',
  name: 'GPT-4o Mini',
  provider: 'openai'
})

export const createChatAtom = atom(
  null,
  (get, set, firstMessage: string) => {
    const newChat: Chat = {
      id: generateId(),
      title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : ''),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    set(chatsAtom, [newChat, ...get(chatsAtom)])
    set(selectedChatIdAtom, newChat.id)
    return newChat.id
  }
)

export const addMessageAtom = atom(
  null,
  (get, set, { chatId, message }: { chatId: string, message: Omit<Message, 'id' | 'timestamp'> }) => {
    const chats = get(chatsAtom)
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now()
    }
    
    set(chatsAtom, chats.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, newMessage],
            updatedAt: Date.now()
          }
        : chat
    ))
  }
)

export const updateLastMessageAtom = atom(
  null,
  (get, set, { chatId, content }: { chatId: string, content: string }) => {
    const chats = get(chatsAtom)
    set(chatsAtom, chats.map(chat => {
      if (chat.id !== chatId) return chat
      const messages = [...chat.messages]
      if (messages.length > 0) {
        messages[messages.length - 1] = {
          ...messages[messages.length - 1],
          content
        }
      }
      return { ...chat, messages, updatedAt: Date.now() }
    }))
  }
)

export const deleteChatAtom = atom(
  null,
  (get, set, chatId: string) => {
    const chats = get(chatsAtom)
    const selectedId = get(selectedChatIdAtom)
    set(chatsAtom, chats.filter(chat => chat.id !== chatId))
    if (selectedId === chatId) {
      set(selectedChatIdAtom, null)
    }
  }
)
