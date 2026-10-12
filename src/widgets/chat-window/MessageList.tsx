import { useLayoutEffect, useRef } from 'react'
import type { Message } from '@/entities/chat'
import { useSendMessage } from '@/features/send-message/useSendMessage'
import { MessageBubble } from './MessageBubble'
import styles from './ChatWindow.module.css'

const STICK_THRESHOLD_PX = 120

export function MessageList({ chatId, messages }: { chatId: string; messages: Message[] }) {
  const listRef = useRef<HTMLOListElement>(null)
  const prevChatId = useRef<string | null>(null)
  const { resend } = useSendMessage()
  const last = messages.at(-1)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const chatChanged = prevChatId.current !== chatId
    prevChatId.current = chatId
    const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < STICK_THRESHOLD_PX

    if (chatChanged || nearBottom || last?.direction === 'outgoing') {
      list.scrollTop = list.scrollHeight
    }
  }, [chatId, last?.id, last?.direction])

  return (
    <ol ref={listRef} className={styles.messages}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onRetry={resend} />
      ))}
    </ol>
  )
}
