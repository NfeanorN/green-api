export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

export async function request<T>(url: string, { method = 'GET', body, signal }: RequestOptions = {}): Promise<T> {
  const response = await fetch(url, {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new HttpError(response.status, text || response.statusText)
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : null) as T
}

export const isAbortError = (error: unknown): boolean => error instanceof DOMException && error.name === 'AbortError'
