import { useMemo, type ReactNode } from 'react'
import { getMessenger } from '@/messengers'
import { createGreenApiClient } from '@/shared/api/green-api'
import type { Session } from '@/entities/session'
import { GreenApiContext } from './greenApiContext'

export function GreenApiProvider({ session, children }: { session: Session; children: ReactNode }) {
  const { idInstance, apiTokenInstance, messengerId } = session
  const value = useMemo(
    () => ({
      client: createGreenApiClient({ idInstance, apiTokenInstance }),
      messenger: getMessenger(messengerId),
    }),
    [idInstance, apiTokenInstance, messengerId],
  )
  return <GreenApiContext value={value}>{children}</GreenApiContext>
}
