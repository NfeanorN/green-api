import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'icon'
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(styles.button, variant === 'icon' && styles.icon, className)} {...props} />
}
