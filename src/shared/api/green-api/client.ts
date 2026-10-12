import { request } from '../http'
import type {
  CheckWhatsappResponse,
  GreenApiCredentials,
  Notification,
  SendMessageResponse,
  StateInstanceResponse,
} from './types'

const RECEIVE_TIMEOUT_SEC = 20

export interface GreenApiClient {
  getStateInstance(signal?: AbortSignal): Promise<StateInstanceResponse>
  checkWhatsapp(phoneNumber: string): Promise<CheckWhatsappResponse>
  sendMessage(chatId: string, message: string): Promise<SendMessageResponse>
  receiveNotification(signal?: AbortSignal): Promise<Notification | null>
  deleteNotification(receiptId: number): Promise<{ result: boolean }>
}

export function createGreenApiClient({ idInstance, apiTokenInstance }: GreenApiCredentials): GreenApiClient {
  const base = `https://${idInstance.slice(0, 4)}.api.greenapi.com`
  const url = (method: string, suffix = '') => `${base}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`

  return {
    getStateInstance: (signal) => request(url('getStateInstance'), { signal }),

    checkWhatsapp: (phoneNumber) =>
      request(url('checkWhatsapp'), { method: 'POST', body: { phoneNumber: Number(phoneNumber) } }),

    sendMessage: (chatId, message) => request(url('sendMessage'), { method: 'POST', body: { chatId, message } }),

    receiveNotification: (signal) =>
      request(url('receiveNotification', `?receiveTimeout=${RECEIVE_TIMEOUT_SEC}`), { signal }),

    deleteNotification: (receiptId) => request(url('deleteNotification', `/${receiptId}`), { method: 'DELETE' }),
  }
}
