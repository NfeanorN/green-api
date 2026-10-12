export interface GreenApiCredentials {
  idInstance: string
  apiTokenInstance: string
}

export type InstanceState = 'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting' | 'yellowCard'

export interface StateInstanceResponse {
  stateInstance: InstanceState
}

export interface CheckWhatsappResponse {
  existsWhatsapp: boolean
}

export interface SendMessageResponse {
  idMessage: string
}

interface SenderData {
  chatId: string
  chatName?: string
  sender?: string
  senderName?: string
}

interface TextMessageData {
  typeMessage: 'textMessage'
  textMessageData: { textMessage: string }
}

interface ExtendedTextMessageData {
  typeMessage: 'extendedTextMessage'
  extendedTextMessageData: { text: string }
}

interface OtherMessageData {
  typeMessage: Exclude<string, 'textMessage' | 'extendedTextMessage'>
}

export type MessageData = TextMessageData | ExtendedTextMessageData | OtherMessageData

export interface MessageWebhook {
  typeWebhook: 'incomingMessageReceived' | 'outgoingMessageReceived' | 'outgoingAPIMessageReceived'
  idMessage: string
  timestamp: number
  senderData: SenderData
  messageData: MessageData
}

export type ApiMessageStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'noAccount' | 'notInGroup' | 'yellowCard'

export interface StatusWebhook {
  typeWebhook: 'outgoingMessageStatus'
  idMessage: string
  chatId: string
  timestamp: number
  status: ApiMessageStatus
}

export interface UnknownWebhook {
  typeWebhook: string
}

export type Webhook = MessageWebhook | StatusWebhook | UnknownWebhook

export interface Notification {
  receiptId: number
  body: Webhook
}
