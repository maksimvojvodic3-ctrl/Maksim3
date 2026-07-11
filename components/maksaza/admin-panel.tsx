'use client'

import { useMemo, useState } from 'react'
import { Banknote, Gauge, Layers, Plus, Trash2, Lock, LogOut } from 'lucide-react'
import {
  ADMIN_PASSWORD,
  SERVICES,
  formatRSD,
  serviceRate,
  type AgeTier,
  type Session,
} from '@/lib/maksaza-data'
import { Modal, fieldClass, labelClass } from './modal'

function SummaryCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div
      className={[
        'rounded-2xl border p-5 shadow-sm',
        accent ? 'border-accent/40 bg-accent/10' : 'border-border bg-card',
      ].join(' ')}
    >
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-heading text-2xl font-extrabold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  )
}

export function AdminPanel({
  sessions,
  onAdd,
  onDelete,
}: {
  sessions: Session[]
  onAdd: (s: Omit<Session, 'id' | 'createdAt'>) => void
  onDelete: (id: string) => void
}) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const [addOpen, setAddOpen] = useState(false)
  const [client, setClient] = useState('')
  const [serviceId, setServiceId] = useState(SERVICES[0].id)
  const [age, setAge] = useState<AgeTier>('adult')
  const [minutes, setMinutes] = useState<number>(30)

  const selectedService = SERVICES.find((s) => s.id === serviceId)!
  const previewPrice = serviceRate(selectedService, age) * (Number(minutes) || 0)

  const stats = useMemo(() => {
    const total = sessions.reduce((acc, s) => acc + s.price, 0)
    const totalMin = sessions.reduce((acc, s) => acc + s.minutes, 0)
    const perMin = totalMin > 0 ? total / totalMin : 0
    return { total, totalMin, perMin, count: sessions.length }
  }, [sessions])

  const tryLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
      setPw('')
    } else {
      setPwError(true)
    }
  }

  const saveSession = (e: React.FormEvent) => {
    e.preventDefault()
    const service = SERVICES.find((s) => s.id === serviceId)!
    const mins = Number(minutes)
    if (!client.trim() || !mins || mins <= 0) return
    onAdd({
      client: client.trim(),
      serviceId: service.id,
      serviceName: `${service.name} (${age === 'youth' ? 'do 18' : '18+'})`,
      minutes: mins,
      price: serviceRate(service, age) * mins,
    })
    setClient('')
    setServiceId(SERVICES[0].id)
    setAge('adult')
    setMinutes(30)
    setAddOpen(false)
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-4" />
          </span>
          <h3 className="font-heading text-xl font-bold text-foreground">
            Admin Mode
          </h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Unesi admin lozinku da otključaš kontrolnu tablu.
        </p>
        <form onSubmit={tryLogin} className="space-y-3">
          <input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value)
              setPwError(false)
            }}
            className={fieldClass}
            placeholder="Admin lozinka"
            aria-label="Admin lozinka"
          />
          {pwError && (
            <p className="text-sm font-medium text-destructive">
              Pogrešna lozinka. Pokušaj ponovo.
            </p>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Otključaj
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-heading text-2xl font-bold text-foreground">
          Admin kontrolna tabla
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" /> DODAJ
          </button>
          <button
            type="button"
            onClick={() => setAuthed(false)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <LogOut className="size-4" /> Izađi
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Banknote className="size-4" />}
          label="Ukupna Zarada"
          value={formatRSD(stats.total)}
          accent
        />
        <SummaryCard
          icon={<Gauge className="size-4" />}
          label="Prosek po min"
          value={stats.perMin > 0 ? `${formatRSD(stats.perMin)}/min` : '—'}
        />
        <SummaryCard
          icon={<Layers className="size-4" />}
          label="Ukupno seansi"
          value={String(stats.count)}
        />
      </div>

      {/* NEDAVNE SEANSE */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h4 className="font-heading mb-3 text-lg font-bold text-foreground">
          Nedavne seanse
        </h4>
        {sessions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Još nema seansi. Klikni „DODAJ” da uneseš prvu.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {sessions
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {s.client}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {s.serviceName} · {s.minutes} min · {formatRSD(s.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(s.id)}
                    aria-label={`Obriši seansu za ${s.client}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
                  >
                    <Trash2 className="size-4" /> Obriši
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* ADD MODAL */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Dodaj seansu">
        <form onSubmit={saveSession} className="space-y-4">
          <div>
            <label htmlFor="adm-client" className={labelClass}>
              Ime klijenta
            </label>
            <input
              id="adm-client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={fieldClass}
              placeholder="npr. Jelena"
            />
          </div>
          <div>
            <label htmlFor="adm-service" className={labelClass}>
              Usluga / paket
            </label>
            <select
              id="adm-service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className={fieldClass}
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.adultRate} din/min (18+)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="adm-age" className={labelClass}>
              Uzrast
            </label>
            <select
              id="adm-age"
              value={age}
              onChange={(e) => setAge(e.target.value as AgeTier)}
              className={fieldClass}
            >
              <option value="adult">18+</option>
              <option value="youth">Do 18 god</option>
            </select>
          </div>
          <div>
            <label htmlFor="adm-minutes" className={labelClass}>
              Trajanje (minuti)
            </label>
            <input
              id="adm-minutes"
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className={fieldClass}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
            <span className="text-sm text-muted-foreground">Cena seanse</span>
            <span className="font-heading text-xl font-extrabold tabular-nums text-primary">
              {formatRSD(previewPrice)}
            </span>
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sačuvaj seansu
          </button>
        </form>
      </Modal>
    </div>
  )
}
