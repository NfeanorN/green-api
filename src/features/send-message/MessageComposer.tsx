import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useSendMessage } from './useSendMessage'
import styles from './MessageComposer.module.css'

export function MessageComposer({ chatId }: { chatId: string }) {
  const [text, setText] = useState('')
  const { send } = useSendMessage()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const message = text.trim()
    if (!message) return
    setText('')
    send(chatId, message)
    textareaRef.current?.focus()
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Сообщение"
        autoFocus
      />
      <Button type="submit" variant="icon" className={styles.send} aria-label="Отправить" disabled={!text.trim()}>
        <SendHorizontal size={22} />
      </Button>
    </form>
  )
}
