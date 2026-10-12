import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useGreenApi } from '@/app/greenApiContext'
import { useChatStore } from '@/entities/chat'
import { cn } from '@/shared/lib/cn'
import { isValidPhone, normalizePhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui'
import styles from './NewChatForm.module.css'

export function NewChatForm() {
  const { client, messenger } = useGreenApi()
  const openChat = useChatStore((s) => s.openChat)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const digits = normalizePhone(phone)
    if (!isValidPhone(digits)) {
      setError('Номер нужен в формате 77011234567')
      return
    }

    const chatId = messenger.phoneToChatId(digits)
    const isKnown = Boolean(useChatStore.getState().chats[chatId])

    if (!isKnown && messenger.hasAccount) {
      setChecking(true)
      try {
        if (!(await messenger.hasAccount(client, digits))) {
          setError(`У этого номера нет ${messenger.title}`)
          return
        }
      } catch {
        setError('Не удалось проверить номер, попробуйте ещё раз')
        return
      } finally {
        setChecking(false)
      }
    }

    openChat(chatId, messenger.chatIdToTitle(chatId))
    setPhone('')
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={cn(styles.input, error && styles.invalid)}
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setError(null)
          }}
          placeholder="Номер телефона"
        />
        <Button type="submit" variant="icon" aria-label="Новый чат" disabled={!phone.trim() || checking}>
          <Plus size={22} />
        </Button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </>
  )
}
