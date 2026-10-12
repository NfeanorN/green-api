const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })

export const formatTime = (ms: number): string => timeFormatter.format(ms)

export function formatChatDate(ms: number): string {
  const date = new Date(ms)
  return date.toDateString() === new Date().toDateString() ? timeFormatter.format(date) : dateFormatter.format(date)
}
