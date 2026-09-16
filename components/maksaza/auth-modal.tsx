'use client'

import { useState } from 'react'
import { Modal, fieldClass, labelClass } from './modal'

const CONTACT_TYPES = ['Telefon', 'Instagram', 'Viber', 'WhatsApp']

export type AuthResult = { ok: boolean; error?: string }

export function AuthModal({
  open,
  onClose,
  onRegister,
  onLogin,
}: {
  open: boolean
  onClose: () => void
  onRegister: (data: {
    username: string
    password: string
    contact: string
    contactType: string
  }) => AuthResult
  onLogin: (username: string, password: string) => AuthResult
}) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [contact, setContact] = useState('')
  const [contactType, setContactType] = useState(CONTACT_TYPES[0])
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setUsername('')
    setPassword('')
    setContact('')
    setContactType(CONTACT_TYPES[0])
    setError(null)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (tab === 'register') {
      if (!username.trim() || !password.trim() || !contact.trim()) {
        setError('Popuni sva polja (ime, lozinka i kontakt).')
        return
      }
      const res = onRegister({
        username: username.trim(),
        password,
        contact: contact.trim(),
        contactType,
      })
      if (!res.ok) {
        setError(res.error ?? 'Greška pri registraciji.')
        return
      }
    } else {
      const res = onLogin(username.trim(), password)
      if (!res.ok) {
        setError(res.error ?? 'Pogrešno ime ili lozinka.')
        return
      }
    }
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={tab === 'login' ? 'Prijava' : 'Registracija'}
    >
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => {
            setTab('login')
            setError(null)
          }}
          className={`rounded-md py-2 text-sm font-semibold transition-colors ${
            tab === 'login'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Prijava
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('register')
            setError(null)
          }}
          className={`rounded-md py-2 text-sm font-semibold transition-colors ${
            tab === 'register'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Registracija
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="auth-username" className={labelClass}>
            Ime / korisničko ime
          </label>
          <input
            id="auth-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={fieldClass}
            placeholder="npr. Marko"
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="auth-password" className={labelClass}>
            Lozinka
          </label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            placeholder="••••••"
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {tab === 'register' && (
          <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
            <div>
              <label htmlFor="auth-contact-type" className={labelClass}>
                Kontakt vrsta
              </label>
              <select
                id="auth-contact-type"
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                className={fieldClass}
              >
                {CONTACT_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="auth-contact" className={labelClass}>
                Kontakt (obavezno)
              </label>
              <input
                id="auth-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={fieldClass}
                placeholder="broj / @username"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {tab === 'login' ? 'Prijavi se' : 'Registruj se'}
        </button>

        {tab === 'register' && (
          <p className="text-center text-xs text-muted-foreground">
            Kontakt koristimo isključivo da te obavestimo o terminu i bonusima.
          </p>
        )}
      </form>
    </Modal>
  )
}
