'use client'

import { Check, Star } from 'lucide-react'
import { PAKETI, SERVICES, formatRSD } from '@/lib/maksaza-data'

export function PricingTables() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* CENOVNIK */}
      <section aria-labelledby="cenovnik-title">
        <h3
          id="cenovnik-title"
          className="font-heading mb-1 text-2xl font-bold text-foreground"
        >
          Cenovnik
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Cene su izražene po minutu (din/min).
        </p>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Usluga</th>
                <th className="px-4 py-3 text-right font-semibold">Do 18 god</th>
                <th className="px-4 py-3 text-right font-semibold">18+</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map((s, i) => (
                <tr
                  key={s.id}
                  className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/40'}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {s.name}
                    {s.minMinutes && (
                      <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                        min. {s.minMinutes} min
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                    {s.youthRate} din/min
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-accent">
                    {s.adultRate} din/min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PAKETI */}
      <section aria-labelledby="paketi-title">
        <h3
          id="paketi-title"
          className="font-heading mb-1 text-2xl font-bold text-foreground"
        >
          Paketi i karte
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Cena za uzrast do 18 god i 18+.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PAKETI.map((p) => (
            <div
              key={p.id}
              className={[
                'relative flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1',
                p.popular ? 'border-accent ring-2 ring-accent/30' : 'border-border',
              ].join(' ')}
            >
              {p.popular && (
                <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
                  <Star className="size-3" /> Najpopularnije
                </span>
              )}
              <h4 className="font-heading text-lg font-bold text-foreground">
                {p.name}
              </h4>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {p.desc}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-secondary/50 px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Do 18 god
                  </p>
                  <p className="font-heading text-lg font-extrabold tabular-nums text-foreground">
                    {formatRSD(p.youthPrice)}
                  </p>
                </div>
                <div className="rounded-lg bg-accent/10 px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">18+</p>
                  <p className="font-heading text-lg font-extrabold tabular-nums text-accent">
                    {formatRSD(p.adultPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
