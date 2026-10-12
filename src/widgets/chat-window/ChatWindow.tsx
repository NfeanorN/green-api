import { ArrowLeft } from 'lucide-react'
import { selectActiveChat, useChatStore } from '@/entities/chat'
import { MessageComposer } from '@/features/send-message/MessageComposer'
import { cn } from '@/shared/lib/cn'
import { Avatar, Button } from '@/shared/ui'
import { MessageList } from './MessageList'
import styles from './ChatWindow.module.css'

export function ChatWindow({ className }: { className?: string }) {
  const chat = useChatStore(selectActiveChat)
  const closeChat = useChatStore((s) => s.closeChat)

  if (!chat) {
    return (
      <section className={cn(styles.window, styles.placeholder, className)}>
        <h2>Green-API Chat</h2>
        <p>Выберите чат слева или создайте новый по номеру телефона</p>
      </section>
    )
  }

  return (
    <section className={cn(styles.window, className)}>
      <header className={styles.header}>
        <Button variant="icon" className={styles.back} onClick={closeChat} aria-label="Назад">
          <ArrowLeft size={22} />
        </Button>
        <Avatar seed={chat.id} title={chat.title} />
        <div>
          <h2 className={styles.title}>{chat.title}</h2>
          <span className={styles.subtitle}>{chat.id}</span>
        </div>
      </header>

      <MessageList chatId={chat.id} messages={chat.messages} />
      <MessageComposer key={chat.id} chatId={chat.id} />
    </section>
  )
}
