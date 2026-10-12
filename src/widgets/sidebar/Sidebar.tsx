import { useMemo } from 'react'
import { LogOut } from 'lucide-react'
import { useGreenApi } from '@/app/greenApiContext'
import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { NewChatForm } from '@/features/new-chat/NewChatForm'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { ChatListItem } from './ChatListItem'
import styles from './Sidebar.module.css'

interface SidebarProps {
  online: boolean
  className?: string
}

export function Sidebar({ online, className }: SidebarProps) {
  const { messenger } = useGreenApi()
  const chatsById = useChatStore((s) => s.chats)
  const activeChatId = useChatStore((s) => s.activeChatId)
  const openChat = useChatStore((s) => s.openChat)
  const idInstance = useSessionStore((s) => s.session?.idInstance)
  const logout = useSessionStore((s) => s.logout)

  const chats = useMemo(() => Object.values(chatsById).sort((a, b) => b.updatedAt - a.updatedAt), [chatsById])

  return (
    <aside className={cn(styles.sidebar, className)}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{messenger.title}</h1>
          <span className={styles.instance}>{online ? `Инстанс ${idInstance}` : 'Нет соединения...'}</span>
        </div>
        <Button variant="icon" onClick={logout} aria-label="Выйти" title="Выйти">
          <LogOut size={20} />
        </Button>
      </header>

      {!online && <div className={styles.offline}>Не удаётся получить сообщения, переподключаемся</div>}

      <NewChatForm />

      {chats.length === 0 ? (
        <p className={styles.empty}>Чатов пока нет. Введите номер, чтобы начать переписку</p>
      ) : (
        <ul className={styles.list}>
          {chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} active={chat.id === activeChatId} onSelect={openChat} />
          ))}
        </ul>
      )}
    </aside>
  )
}
