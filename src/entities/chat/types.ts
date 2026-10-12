export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export type MessageDirection = 'incoming' | 'outgoing'

export interface Message {
  id: string
  chatId: string
  text: string
  direction: MessageDirection
  timestamp: number
  status?: MessageStatus
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  unread: number
  updatedAt: number
}

export type ChatEvent =
  | { type: 'message'; message: Message; chatTitle?: string }
  | { type: 'status'; chatId: string; messageId: string; status: MessageStatus }
