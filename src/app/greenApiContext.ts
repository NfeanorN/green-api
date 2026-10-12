import { createContext, use } from 'react'
import type { MessengerAdapter } from '@/messengers'
import type { GreenApiClient } from '@/shared/api/green-api'

export interface GreenApiContextValue {
  client: GreenApiClient
  messenger: MessengerAdapter
}

export const GreenApiContext = createContext<GreenApiContextValue | null>(null)

export function useGreenApi(): GreenApiContextValue {
  const ctx = use(GreenApiContext)
  if (!ctx) throw new Error('useGreenApi must be used inside <GreenApiProvider>')
  return ctx
}
