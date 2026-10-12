export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  return digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits
}

export const isValidPhone = (digits: string): boolean => /^\d{10,15}$/.test(digits)
