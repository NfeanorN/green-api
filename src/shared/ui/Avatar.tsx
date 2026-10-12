import { memo } from 'react'
import styles from './Avatar.module.css'

const PALETTE = ['#00a884', '#53bdeb', '#ff7eb6', '#7f66ff', '#ffb02e', '#fc4c4c', '#02a698', '#a5b337']

function colorFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function initials(title: string): string {
  const letters = title.replace(/[^\p{L}\s]/gu, '').trim()
  if (!letters) return '#'
  return letters
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export const Avatar = memo(function Avatar({ seed, title }: { seed: string; title: string }) {
  return (
    <span className={styles.avatar} style={{ background: colorFor(seed) }} aria-hidden>
      {initials(title)}
    </span>
  )
})
