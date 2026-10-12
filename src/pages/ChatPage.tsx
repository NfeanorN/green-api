import { useChatStore } from '@/entities/chat'
import { useNotificationPolling } from '@/features/polling/useNotificationPolling'
import { ChatWindow } from '@/widgets/chat-window/ChatWindow'
import { Sidebar } from '@/widgets/sidebar/Sidebar'
import styles from './ChatPage.module.css'

export default function ChatPage() {
  const online = useNotificationPolling()
  const chatOpen = useChatStore((s) => s.activeChatId !== null)

  return (
    <div className={styles.layout} data-chat-open={chatOpen}>
      <Sidebar online={online} className={styles.sidebar} />
      <ChatWindow className={styles.window} />
    </div>
  )
}
