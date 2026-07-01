'use client'

import { useState } from 'react'
import { PAKETI, SERVICES, paketPrice, serviceRate, formatRSD } from '@/lib/maksaza-data'
import { Check, Zap } from 'lucide-react'

export function PricingTables() {
  const [activeTab, setActiveTab] = useState<'paketi' | 'usluge'>('paketi')
  const [ageTier, setAgeTier] = useState<'youth' | 'adult'>('adult')

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="font-heading text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Cenovnik
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
          Fleksibilne cene za sve – izaberite šta vam najviše odgovara.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 rounded-lg border border-border/50 bg-muted/30 p-1">
          {(['paketi', 'usluge'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-bold transition-all ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {tab === 'paketi' ? '📦 Paketi' : '💆 Usluge'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 rounded-lg border border-border/50 bg-muted/30 p-1">
          {(['youth', 'adult'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setAgeTier(tier)}
              className={`px-4 py-2 rounded-md font-bold transition-all ${
                ageTier === tier
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {tier === 'youth' ? '👦 Do 18 god' : '👨 18+'}
            </button>
          ))}
        </div>
      </div>

      {/* Paketi */}
      {activeTab === 'paketi' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PAKETI.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-2xl border p-6 shadow-sm transition-all duration-300 ${
                p.popular
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10 lg:scale-105'
                  : 'border-border/50 bg-card hover:shadow-md'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-bold text-white">
                  <Zap className="size-3" /> ПОПУЛАРНО
                </div>
              )}
              <h3 className="font-heading text-xl font-bold text-foreground">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <p className="mt-4 text-3xl font-bold text-primary">
                {formatRSD(paketPrice(p, ageTier))}
              </p>
              <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 font-bold text-white transition-all hover:shadow-lg hover:scale-105">
                Odaberi paket
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Usluge */}
      {activeTab === 'usluge' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-border/50">
                <th className="px-4 py-3 font-bold text-foreground">Usluga</th>
                <th className="px-4 py-3 text-right font-bold text-foreground">Cena po minuti</th>
                <th className="px-4 py-3 text-right font-bold text-foreground">Za 30 min</th>
                <th className="px-4 py-3 text-right font-bold text-foreground">Za 60 min</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {SERVICES.map((s) => {
                const rate = serviceRate(s, ageTier)
                return (
                  <tr
                    key={s.id}
                    className="border-b border-border/30 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-foreground">{s.name}</td>
                    <td className="px-4 py-3 text-right text-accent font-bold">
                      {formatRSD(rate)}/min
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatRSD(rate * 30)}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatRSD(rate * 60)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <p className="text-pretty text-foreground leading-relaxed">
          ℹ️ <strong>Napomena:</strong> Sve cene su u dinarima. Putni trošak za dolazak na adresu je <strong>50 din/km</strong>. Redovni klijenti dobijaju <strong>10% popusta</strong> nakon 5. dolaska.
        </p>
      </div>
    </div>
  )
}
