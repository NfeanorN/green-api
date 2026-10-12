import { memo } from 'react'
import type { Chat } from '@/entities/chat'
import { cn } from '@/shared/lib/cn'
import { formatChatDate } from '@/shared/lib/date'
import { Avatar } from '@/shared/ui'
import styles from './Sidebar.module.css'

interface ChatListItemProps {
  chat: Chat
  active: boolean
  onSelect(chatId: string, title: string): void
}

export const ChatListItem = memo(function ChatListItem({ chat, active, onSelect }: ChatListItemProps) {
  const last = chat.messages.at(-1)
  const hasUnread = chat.unread > 0

  return (
    <li>
      <button
        type="button"
        className={cn(styles.item, active && styles.active, hasUnread && styles.unread)}
        onClick={() => onSelect(chat.id, chat.title)}
      >
        <Avatar seed={chat.id} title={chat.title} />
        <span className={styles.body}>
          <span className={styles.row}>
            <span className={styles.name}>{chat.title}</span>
            {last && <span className={styles.time}>{formatChatDate(last.timestamp)}</span>}
          </span>
          <span className={styles.row}>
            <span className={styles.preview}>
              {last ? `${last.direction === 'outgoing' ? 'Вы: ' : ''}${last.text}` : 'Нет сообщений'}
            </span>
            {hasUnread && <span className={styles.badge}>{chat.unread}</span>}
          </span>
        </span>
      </button>
    </li>
  )
})
