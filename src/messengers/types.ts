import type { GreenApiClient } from '@/shared/api/green-api'

export interface MessengerAdapter {
  id: string
  title: string
  phoneToChatId(phone: string): string
  chatIdToTitle(chatId: string): string
  hasAccount?(client: GreenApiClient, phone: string): Promise<boolean>
}
