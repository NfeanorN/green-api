import type { ApiMessageStatus, MessageData, MessageWebhook, StatusWebhook, Webhook } from '@/shared/api/green-api'
import type { ChatEvent, MessageStatus } from './types'

function extractText(data: MessageData): string | null {
  if ('textMessageData' in data) return data.textMessageData.textMessage
  if ('extendedTextMessageData' in data) return data.extendedTextMessageData.text
  return null
}

const statusMap: Partial<Record<ApiMessageStatus, MessageStatus>> = {
  sent: 'sent',
  delivered: 'delivered',
  read: 'read',
}

const MESSAGE_WEBHOOKS = new Set(['incomingMessageReceived', 'outgoingMessageReceived', 'outgoingAPIMessageReceived'])

export function mapNotification(body: Webhook): ChatEvent | null {
  if (MESSAGE_WEBHOOKS.has(body.typeWebhook)) {
    const webhook = body as MessageWebhook
    const text = extractText(webhook.messageData)
    if (text === null) return null

    const incoming = webhook.typeWebhook === 'incomingMessageReceived'
    return {
      type: 'message',
      chatTitle: incoming ? webhook.senderData.chatName || webhook.senderData.senderName : undefined,
      message: {
        id: webhook.idMessage,
        chatId: webhook.senderData.chatId,
        text,
        direction: incoming ? 'incoming' : 'outgoing',
        timestamp: webhook.timestamp * 1000,
        status: incoming ? undefined : 'sent',
      },
    }
  }

  if (body.typeWebhook === 'outgoingMessageStatus') {
    const webhook = body as StatusWebhook
    return {
      type: 'status',
      chatId: webhook.chatId,
      messageId: webhook.idMessage,
      status: statusMap[webhook.status] ?? 'failed',
    }
  }

  return null
}
