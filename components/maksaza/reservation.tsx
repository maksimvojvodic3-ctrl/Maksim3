'use client'

import { useState } from 'react'
import { CalendarCheck, Sparkles } from 'lucide-react'
import {
  SERVICES,
  TIME_SLOTS,
  formatRSD,
  serviceRate,
  type AgeTier,
} from '@/lib/maksaza-data'
import { fieldClass, labelClass } from './modal'

export function Reservation({ discount }: { discount: number }) {
  const [serviceId, setServiceId] = useState(SERVICES[4].id)
  const [age, setAge] = useState<AgeTier>('adult')
  const [minutes, setMinutes] = useState(30)
  const [time, setTime] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<string | null>(null)

  const service = SERVICES.find((s) => s.id === serviceId)!
  const mins = Number(minutes) || 0
  const basePrice = serviceRate(service, age) * mins
  const finalPrice = basePrice * (1 - discount / 100)

  const book = () => {
    if (!time) return
    setConfirmed(
      `Rezervacija primljena: ${service.name} (${mins} min, ${
        age === 'youth' ? 'do 18 god' : '18+'
      }) u ${time}. Cena: ${formatRSD(finalPrice)}${
        discount > 0 ? ` (sa ${discount}% bonus popusta)` : ''
      }. Kontaktiraćemo te radi potvrde.`,
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h3 className="font-heading mb-1 text-2xl font-bold text-foreground">
        Rezervacija termina
      </h3>
      <p className="mb-5 text-sm text-muted-foreground">
        Izaberi uslugu, uzrast i trajanje, pa slobodan termin (10:00 – 13:30).
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label htmlFor="res-service" className={labelClass}>
              Usluga
            </label>
            <select
              id="res-service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className={fieldClass}
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="res-age" className={labelClass}>
                Uzrast
              </label>
              <select
                id="res-age"
                value={age}
                onChange={(e) => setAge(e.target.value as AgeTier)}
                className={fieldClass}
              >
                <option value="adult">18+</option>
                <option value="youth">Do 18 god</option>
              </select>
            </div>
            <div>
              <label htmlFor="res-minutes" className={labelClass}>
                Trajanje (min)
              </label>
              <input
                id="res-minutes"
                type="number"
                min={service.minMinutes ?? 1}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className={fieldClass}
              />
            </div>
          </div>

          {service.minMinutes && (
            <p className="text-xs text-muted-foreground">
              Minimalno trajanje za ovu uslugu: {service.minMinutes} min.
            </p>
          )}

          {discount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-medium text-accent">
              <Sparkles className="size-4" />
              Tvoj bonus popust: {discount}% — primenjuje se na cenu.
            </div>
          )}

          <div className="rounded-lg bg-secondary/50 px-4 py-3">
            <p className="text-sm text-muted-foreground">Za naplatu</p>
            <p className="text-2xl font-extrabold tabular-nums text-primary">
              {formatRSD(finalPrice)}
              {discount > 0 && (
                <span className="ml-2 text-sm font-medium text-muted-foreground line-through">
                  {formatRSD(basePrice)}
                </span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {serviceRate(service, age)} din/min × {mins} min
            </p>
          </div>
        </div>

        <div>
          <span className={labelClass}>Termin</span>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((t) => {
              const active = time === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={[
                    'rounded-lg border px-2 py-2.5 text-sm font-semibold tabular-nums transition-colors',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:border-accent hover:text-accent',
                  ].join(' ')}
                >
                  {t}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={book}
            disabled={!time}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CalendarCheck className="size-4" />
            Rezerviši termin
          </button>
        </div>
      </div>

      {confirmed && (
        <p className="mt-5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {confirmed}
        </p>
      )}
    </div>
  )
}
