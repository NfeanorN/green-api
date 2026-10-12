import { useEffect, useState } from 'react'
import { useGreenApi } from '@/app/greenApiContext'
import { mapNotification, useChatStore } from '@/entities/chat'
import { isAbortError } from '@/shared/api/http'

const RETRY_DELAY_MS = 3000

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })
}

export function useNotificationPolling() {
  const { client } = useGreenApi()
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const { applyEvent } = useChatStore.getState()

    async function loop() {
      while (!signal.aborted) {
        try {
          const notification = await client.receiveNotification(signal)
          setOnline(true)
          if (!notification) continue

          try {
            const event = mapNotification(notification.body)
            if (event) applyEvent(event)
          } finally {
            await client.deleteNotification(notification.receiptId)
          }
        } catch (error) {
          if (isAbortError(error)) return
          console.error('[polling]', error)
          setOnline(false)
          await wait(RETRY_DELAY_MS, signal)
        }
      }
    }

    loop()
    return () => controller.abort()
  }, [client])

  return online
}
