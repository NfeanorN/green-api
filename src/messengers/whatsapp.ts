import type { MessengerAdapter } from './types'

export const whatsapp: MessengerAdapter = {
  id: 'whatsapp',
  title: 'WhatsApp',
  phoneToChatId: (phone) => `${phone}@c.us`,
  chatIdToTitle: (chatId) => `+${chatId.replace(/@.*$/, '')}`,
  hasAccount: async (client, phone) => (await client.checkWhatsapp(phone)).existsWhatsapp,
}
