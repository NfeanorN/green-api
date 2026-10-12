import { LoginForm } from '@/features/auth/LoginForm'
import styles from './LoginPage.module.css'

export function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход в Green-API</h1>
        <p className={styles.text}>
          Введите учётные данные инстанса из{' '}
          <a href="https://console.green-api.com" target="_blank" rel="noreferrer">
            личного кабинета
          </a>
          .
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
