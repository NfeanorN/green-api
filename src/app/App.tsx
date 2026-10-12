import { lazy, Suspense } from 'react'
import { useSessionStore } from '@/entities/session'
import { LoginPage } from '@/pages/LoginPage'
import { GreenApiProvider } from './GreenApiProvider'

const ChatPage = lazy(() => import('@/pages/ChatPage'))

export function App() {
  const session = useSessionStore((s) => s.session)

  if (!session) return <LoginPage />

  return (
    <GreenApiProvider session={session}>
      <Suspense fallback={null}>
        <ChatPage />
      </Suspense>
    </GreenApiProvider>
  )
}
