'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, Check } from 'lucide-react'
import { SERVICES, TIME_SLOTS, formatRSD, serviceRate, LS } from '@/lib/maksaza-data'

export function Reservation() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState({
    clientName: '',
    contact: '',
    serviceId: '',
    ageTier: 'adult' as 'youth' | 'adult',
    minutes: 30,
    date: '',
    time: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const selectedService = SERVICES.find((s) => s.id === formData.serviceId)
  const price = selectedService
    ? serviceRate(selectedService, formData.ageTier) * formData.minutes
    : 0

  const handleSubmit = () => {
    if (!formData.clientName || !formData.contact || !formData.serviceId || !formData.date || !formData.time) {
      alert('Popunite sva polja!')
      return
    }

    const session = {
      id: Date.now().toString(),
      client: formData.clientName,
      serviceId: formData.serviceId,
      serviceName: selectedService?.name || '',
      minutes: formData.minutes,
      price,
      createdAt: Date.now(),
    }

    const sessions = JSON.parse(localStorage.getItem(LS.sessions) || '[]')
    sessions.push(session)
    localStorage.setItem(LS.sessions, JSON.stringify(sessions))

    setSubmitted(true)
    setTimeout(() => {
      setStep(1)
      setFormData({
        clientName: '',
        contact: '',
        serviceId: '',
        ageTier: 'adult',
        minutes: 30,
        date: '',
        time: '',
      })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="font-heading text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Rezervacija
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
          Zakažite vašu masažu u 3 laka koraka – brzo, jednostavno i sigurno.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <button
              onClick={() => step >= s && setStep(s as any)}
              className={`flex size-10 items-center justify-center rounded-full font-bold transition-all ${
                step >= s
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s ? <Check className="size-5" /> : s}
            </button>
            {s < 3 && (
              <div className={`h-1 w-12 rounded ${step > s ? 'bg-accent' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
        {submitted ? (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <Check className="size-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Rezervacija potvrđena! ✅</h3>
            <p className="mt-2 text-muted-foreground">
              Termin je zakazan. Čekamo vas u {formData.date} u {formData.time}!
            </p>
          </div>
        ) : (
          <>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Korak 1: Osnovno</h3>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Vaše ime
                  </label>
                  <input
                    type="text"
                    placeholder="Unesite ime..."
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/50 bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Kontakt (telefon ili email)
                  </label>
                  <input
                    type="text"
                    placeholder="Unesite kontakt..."
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/50 bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 w-full rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 font-bold text-white transition-all hover:shadow-lg"
                >
                  Dalje →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Korak 2: Usluga</h3>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Odaberite uslugu
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceId: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/50 bg-muted px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">-- Odaberi uslugu --</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Uzrast
                  </label>
                  <div className="flex gap-3">
                    {(['youth', 'adult'] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setFormData({ ...formData, ageTier: tier })}
                        className={`flex-1 rounded-lg px-4 py-2 font-bold transition-all ${
                          formData.ageTier === tier
                            ? 'bg-accent text-white'
                            : 'border border-border/50 bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        {tier === 'youth' ? '👦 Do 18 god' : '👨 18+'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Trajanje (minute)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={formData.minutes}
                    onChange={(e) =>
                      setFormData({ ...formData, minutes: parseInt(e.target.value) })
                    }
                    className="w-full rounded-lg border border-border/50 bg-muted px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {selectedService && (
                    <p className="mt-2 text-sm text-accent font-bold">
                      💰 Cena: {formatRSD(price)}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-lg border border-border/50 px-4 py-3 font-bold text-foreground transition-all hover:bg-muted"
                  >
                    ← Nazad
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 font-bold text-white transition-all hover:shadow-lg"
                  >
                    Dalje →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Korak 3: Termin</h3>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Datum (Subota)
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/50 bg-muted px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Vreme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setFormData({ ...formData, time: t })}
                        className={`rounded-lg px-3 py-2 font-bold transition-all ${
                          formData.time === t
                            ? 'bg-primary text-white'
                            : 'border border-border/50 bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <p className="text-sm font-bold text-foreground">
                    📋 Pregled:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-foreground">
                    <li>👤 {formData.clientName}</li>
                    <li>📱 {formData.contact}</li>
                    <li>💆 {selectedService?.name}</li>
                    <li>⏱️ {formData.minutes} minuta</li>
                    <li>💰 {formatRSD(price)}</li>
                    <li>📅 {formData.date} u {formData.time}</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-lg border border-border/50 px-4 py-3 font-bold text-foreground transition-all hover:bg-muted"
                  >
                    ← Nazad
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 font-bold text-white transition-all hover:shadow-lg"
                  >
                    ✅ Potvrdi rezervaciju
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
