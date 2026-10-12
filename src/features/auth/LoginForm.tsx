import { useActionState } from 'react'
import { DEFAULT_MESSENGER_ID, getMessenger } from '@/messengers'
import { useChatStore } from '@/entities/chat'
import { useSessionStore, type Session } from '@/entities/session'
import { createGreenApiClient, type InstanceState } from '@/shared/api/green-api'
import { HttpError } from '@/shared/api/http'
import { Button, TextField } from '@/shared/ui'
import styles from './LoginForm.module.css'

const stateErrors: Partial<Record<InstanceState, string>> = {
  notAuthorized: 'Инстанс не авторизован. Отсканируйте QR-код в личном кабинете.',
  blocked: 'Инстанс заблокирован.',
  sleepMode: 'Инстанс спит. Проверьте, что телефон включён и в сети.',
  starting: 'Инстанс ещё запускается, попробуйте через минуту.',
}

async function login(_prev: string | null, form: FormData): Promise<string | null> {
  const messenger = getMessenger(DEFAULT_MESSENGER_ID)
  const session: Session = {
    messengerId: messenger.id,
    idInstance: String(form.get('idInstance')).trim(),
    apiTokenInstance: String(form.get('apiTokenInstance')).trim(),
  }

  try {
    const { stateInstance } = await createGreenApiClient(session).getStateInstance(AbortSignal.timeout(15_000))
    if (stateErrors[stateInstance]) return stateErrors[stateInstance]
  } catch (error) {
    if (error instanceof HttpError && (error.status === 401 || error.status === 403)) {
      return 'Неверный idInstance или apiTokenInstance'
    }
    return 'Не получилось подключиться. Проверьте данные'
  }

  useChatStore.getState().setOwner(session.idInstance)
  useSessionStore.getState().login(session)
  return null
}

export function LoginForm() {
  const [error, formAction, isPending] = useActionState(login, null)

  return (
    <form className={styles.form} action={formAction}>
      <TextField label="idInstance" name="idInstance" required inputMode="numeric" autoComplete="username" />
      <TextField
        label="apiTokenInstance"
        name="apiTokenInstance"
        required
        type="password"
        autoComplete="current-password"
      />

      {error && <p className={styles.error}>{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Проверка...' : 'Войти'}
      </Button>
    </form>
  )
}
