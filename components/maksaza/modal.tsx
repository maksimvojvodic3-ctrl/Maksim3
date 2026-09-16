'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Zatvori"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${maxWidth} animate-in fade-in zoom-in-95 rounded-2xl border border-border bg-card p-6 shadow-2xl duration-200`}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? (
            <h3 className="font-heading text-xl font-bold text-foreground text-balance">
              {title}
            </h3>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const fieldClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/30'

export const labelClass =
  'mb-1.5 block text-sm font-medium text-foreground'
