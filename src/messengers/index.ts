import type { MessengerAdapter } from './types'
import { whatsapp } from './whatsapp'

const messengers: MessengerAdapter[] = [whatsapp]

export const DEFAULT_MESSENGER_ID = whatsapp.id

export const getMessenger = (id: string) => messengers.find((m) => m.id === id) ?? whatsapp

export type { MessengerAdapter }
