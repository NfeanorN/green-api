import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chat, ChatEvent, Message, MessageStatus } from './types'

const MAX_MESSAGES_PER_CHAT = 300

const statusRank: Record<MessageStatus, number> = { pending: 0, failed: 1, sent: 2, delivered: 3, read: 4 }

const isUpgrade = (from: MessageStatus | undefined, to: MessageStatus) =>
  to === 'failed' || statusRank[to] > statusRank[from ?? 'pending']

interface ChatState {
  ownerId: string | null
  chats: Record<string, Chat>
  activeChatId: string | null
  earlyStatuses: Record<string, MessageStatus>

  setOwner(ownerId: string): void
  openChat(chatId: string, title: string): void
  closeChat(): void
  applyEvent(event: ChatEvent): void
  addMessage(message: Message, chatTitle?: string): void
  confirmMessage(chatId: string, tempId: string, id: string): void
  setMessageStatus(chatId: string, messageId: string, status: MessageStatus): void
  retryMessage(chatId: string, messageId: string): void
}

const createChat = (id: string, title: string): Chat => ({ id, title, messages: [], unread: 0, updatedAt: Date.now() })

function updateChat(state: ChatState, chatId: string, updater: (chat: Chat) => Chat): Partial<ChatState> {
  const chat = state.chats[chatId]
  return chat ? { chats: { ...state.chats, [chatId]: updater(chat) } } : {}
}

function failPending(chats: Record<string, Chat>): Record<string, Chat> {
  const result: Record<string, Chat> = {}
  for (const [id, chat] of Object.entries(chats)) {
    result[id] = {
      ...chat,
      messages: chat.messages.map((m) => (m.status === 'pending' ? { ...m, status: 'failed' } : m)),
    }
  }
  return result
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ownerId: null,
      chats: {},
      activeChatId: null,
      earlyStatuses: {},

      setOwner: (ownerId) => {
        if (get().ownerId !== ownerId) set({ ownerId, chats: {}, activeChatId: null, earlyStatuses: {} })
      },

      openChat: (chatId, title) =>
        set((state) => ({
          activeChatId: chatId,
          chats: {
            ...state.chats,
            [chatId]: state.chats[chatId] ? { ...state.chats[chatId], unread: 0 } : createChat(chatId, title),
          },
        })),

      closeChat: () => set({ activeChatId: null }),

      applyEvent: (event) => {
        if (event.type === 'message') get().addMessage(event.message, event.chatTitle)
        else get().setMessageStatus(event.chatId, event.messageId, event.status)
      },

      addMessage: (message, chatTitle) =>
        set((state) => {
          const existing = state.chats[message.chatId]
          if (existing?.messages.some((m) => m.id === message.id)) return {}

          const chat = existing ?? createChat(message.chatId, chatTitle ?? message.chatId)
          const isActive = state.activeChatId === message.chatId
          const messages = [...chat.messages, message]
          if (messages.length > 1 && messages[messages.length - 2].timestamp > message.timestamp) {
            messages.sort((a, b) => a.timestamp - b.timestamp)
          }

          return {
            chats: {
              ...state.chats,
              [chat.id]: {
                ...chat,
                title: chatTitle && chat.title.startsWith('+') ? chatTitle : chat.title,
                messages: messages.slice(-MAX_MESSAGES_PER_CHAT),
                unread: message.direction === 'incoming' && !isActive ? chat.unread + 1 : chat.unread,
                updatedAt: Math.max(chat.updatedAt, message.timestamp),
              },
            },
          }
        }),

      confirmMessage: (chatId, tempId, id) =>
        set((state) => {
          const { [id]: earlyStatus, ...earlyStatuses } = state.earlyStatuses
          const status = earlyStatus && isUpgrade('sent', earlyStatus) ? earlyStatus : 'sent'

          return {
            earlyStatuses,
            ...updateChat(state, chatId, (chat) => {
              const alreadyReceived = chat.messages.some((m) => m.id === id)
              const messages = alreadyReceived
                ? chat.messages.filter((m) => m.id !== tempId)
                : chat.messages.map((m) => (m.id === tempId ? { ...m, id, status } : m))
              return { ...chat, messages }
            }),
          }
        }),

      setMessageStatus: (chatId, messageId, status) =>
        set((state) => {
          const chat = state.chats[chatId]
          if (!chat) return {}

          if (!chat.messages.some((m) => m.id === messageId)) {
            const waitingForId = chat.messages.some((m) => m.status === 'pending')
            return waitingForId ? { earlyStatuses: { ...state.earlyStatuses, [messageId]: status } } : {}
          }

          return updateChat(state, chatId, (c) => ({
            ...c,
            messages: c.messages.map((m) => (m.id === messageId && isUpgrade(m.status, status) ? { ...m, status } : m)),
          }))
        }),

      retryMessage: (chatId, messageId) =>
        set((state) =>
          updateChat(state, chatId, (chat) => ({
            ...chat,
            messages: chat.messages.map((m) => (m.id === messageId ? { ...m, status: 'pending' } : m)),
          })),
        ),
    }),
    {
      name: 'green-api:chats',
      version: 2,
      partialize: ({ ownerId, chats }) => ({ ownerId, chats }),
      merge: (persisted, current) => {
        const saved = persisted as Pick<ChatState, 'ownerId' | 'chats'> | undefined
        return saved ? { ...current, ownerId: saved.ownerId, chats: failPending(saved.chats) } : current
      },
      migrate: () => ({ ownerId: null, chats: {} }),
    },
  ),
)

export const selectActiveChat = (state: ChatState): Chat | null =>
  state.activeChatId ? (state.chats[state.activeChatId] ?? null) : null
