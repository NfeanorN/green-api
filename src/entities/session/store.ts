import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { GreenApiCredentials } from '@/shared/api/green-api'

export interface Session extends GreenApiCredentials {
  messengerId: string
}

interface SessionState {
  session: Session | null
  login(session: Session): void
  logout(): void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      login: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    {
      name: 'green-api:session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
