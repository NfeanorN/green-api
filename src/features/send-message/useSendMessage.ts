import { useCallback } from 'react'
import { useGreenApi } from '@/app/greenApiContext'
import { useChatStore, type Message } from '@/entities/chat'

export function useSendMessage() {
  const { client } = useGreenApi()

  const deliver = useCallback(
    async (chatId: string, tempId: string, text: string) => {
      const { confirmMessage, setMessageStatus } = useChatStore.getState()
      try {
        const { idMessage } = await client.sendMessage(chatId, text)
        confirmMessage(chatId, tempId, idMessage)
      } catch (error) {
        console.error('[sendMessage]', error)
        setMessageStatus(chatId, tempId, 'failed')
      }
    },
    [client],
  )

  const send = useCallback(
    (chatId: string, text: string) => {
      const tempId = `local:${crypto.randomUUID()}`
      useChatStore
        .getState()
        .addMessage({ id: tempId, chatId, text, direction: 'outgoing', timestamp: Date.now(), status: 'pending' })
      return deliver(chatId, tempId, text)
    },
    [deliver],
  )

  const resend = useCallback(
    (message: Message) => {
      useChatStore.getState().retryMessage(message.chatId, message.id)
      return deliver(message.chatId, message.id, message.text)
    },
    [deliver],
  )

  return { send, resend }
}
