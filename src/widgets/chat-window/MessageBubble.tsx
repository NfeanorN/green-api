import { memo } from 'react'
import { Check, CheckCheck, CircleAlert, Clock3, RotateCw } from 'lucide-react'
import type { Message, MessageStatus } from '@/entities/chat'
import { cn } from '@/shared/lib/cn'
import { formatTime } from '@/shared/lib/date'
import styles from './ChatWindow.module.css'

const statusTitles: Record<MessageStatus, string> = {
  pending: 'Отправляется',
  sent: 'Отправлено',
  delivered: 'Доставлено',
  read: 'Прочитано',
  failed: 'Не отправлено',
}

const statusIcons = {
  pending: Clock3,
  sent: Check,
  delivered: CheckCheck,
  read: CheckCheck,
  failed: CircleAlert,
}

interface MessageBubbleProps {
  message: Message
  onRetry(message: Message): void
}

export const MessageBubble = memo(function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const { status } = message
  const StatusIcon = status && statusIcons[status]

  return (
    <li className={cn(styles.bubble, styles[message.direction])}>
      {message.text}
      <span className={styles.meta}>
        <time>{formatTime(message.timestamp)}</time>
        {message.direction === 'outgoing' && StatusIcon && (
          <span title={statusTitles[status]} className={cn(styles.status, styles[status])}>
            <StatusIcon size={15} />
          </span>
        )}
      </span>
      {status === 'failed' && (
        <button type="button" className={styles.retry} onClick={() => onRetry(message)}>
          <RotateCw size={13} /> Повторить
        </button>
      )}
    </li>
  )
})
