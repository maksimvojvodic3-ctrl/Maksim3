'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import {
  INFO,
  PAKETI,
  SERVICES,
  TIME_SLOTS,
  formatRSD,
} from '@/lib/maksaza-data'

type ChatMsg = { role: 'user' | 'bot'; text: string }

const WELCOME =
  'Dobrodošli u MAKSAŽA! Ja sam vaš AI Menadžer. Pitajte me o cenama, uslugama, paketima, lokaciji ili terminima. 😊'

const SUGGESTIONS = ['Cene', 'Lokacija', 'Termini', 'Masaža leđa', 'Paketi']

function answer(raw: string): string {
  const q = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // ukloni dijakritike (š,ž,đ,č,ć)

  // Pozdrav
  if (/\b(zdravo|cao|ćao|hej|hello|hi|dobar dan|pozdrav)\b/.test(q)) {
    return 'Zdravo! Kako mogu da vam pomognem — interesuju vas cene, paketi, lokacija ili termini?'
  }

  // Lokacija / dolazak na adresu
  if (/(lokacija|adresa|gde se|gde ste|dolaz|kuc|dom|kuci|teren)/.test(q)) {
    return `Lokacija: ${INFO.location}. ${INFO.home}.`
  }

  // Termini / radno vreme
  if (/(termin|radno|vreme|kad|kada|sat|otvor|zakaz|rezerv)/.test(q)) {
    return `Radno vreme: ${INFO.hours}. Dostupni termini za rezervaciju: ${TIME_SLOTS.join(', ')}.`
  }

  // Email / kontakt
  if (/(email|mejl|mail|kontakt|javim|poruk)/.test(q)) {
    return `Možete nas kontaktirati na email: ${INFO.email}. Rado ćemo odgovoriti i potvrditi termin.`
  }

  // Popust / lojalnost
  if (/(popust|akcij|jeftin|nedeljn|lojaln|redovn|bonus|tocak|tačak|igr|slagalic)/.test(q)) {
    return `${INFO.loyalty} Uz to, svake nedelje imamo novi popust, a kroz igru (slagalica + Točak Sreće) možete osvojiti bonus popust od 5–20%.`
  }

  // Paketi / karte
  if (/(paket|karta|karte|mesecn|nedeljn|godisnj|dnevn|pretplat)/.test(q)) {
    const lines = PAKETI.map(
      (p) =>
        `• ${p.name} (${p.desc}): ${formatRSD(p.youthPrice)} do 18 god / ${formatRSD(
          p.adultPrice,
        )} 18+`,
    ).join('\n')
    return `Naši paketi i karte:\n${lines}`
  }

  // Konkretna usluga po imenu
  const matched = SERVICES.find((s) => {
    const key = s.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    if (q.includes('leda') && key.includes('leda') && !key.includes('hodanje'))
      return true
    if (q.includes('lice') || q.includes('lica')) return key.includes('lica')
    if (q.includes('ruk')) return key.includes('ruku')
    if (q.includes('stopal')) return key.includes('stopala')
    if (q.includes('nog')) return key.includes('nogu')
    if (q.includes('hodanje')) return key.includes('hodanje')
    if (q.includes('kombo')) return key.includes('kombo')
    return false
  })
  if (matched) {
    const extra = matched.minMinutes
      ? ` (minimalno ${matched.minMinutes} min)`
      : ''
    return `${matched.name}${extra}: ${matched.youthRate} din/min za uzrast do 18 god, ${matched.adultRate} din/min za 18+.`
  }

  // Opšte cene
  if (/(cen|kost|kosta|kostaju|kolik|para|din|placa|cenovnik|uslug|masaz)/.test(q)) {
    const lines = SERVICES.map(
      (s) => `• ${s.name}: ${s.youthRate} din/min (do 18) / ${s.adultRate} din/min (18+)`,
    ).join('\n')
    return `Cenovnik usluga (po minutu):\n${lines}\n\nPitajte me i za pakete ili konkretnu masažu!`
  }

  // Hvala
  if (/(hvala|fala|super|odlicno|ok)\b/.test(q)) {
    return 'Nema na čemu! Tu sam ako imate još pitanja. 🌿'
  }

  return 'Mogu da vam pomognem oko cena, usluga, paketa, lokacije i termina. Probajte npr.: „Koliko košta masaža leđa?“ ili „Gde se nalazite?“.'
}

export function AiManager() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'bot', text: WELCOME },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const send = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    setMessages((m) => [
      ...m,
      { role: 'user', text: clean },
      { role: 'bot', text: answer(clean) },
    ])
    setInput('')
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Zatvori AI Menadžer' : 'Otvori AI Menadžer'}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 font-bold text-accent-foreground shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="size-5" /> : <Bot className="size-5" />}
        <span className="hidden sm:inline">AI Menadžer</span>
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <span className="grid size-8 place-items-center rounded-full bg-primary-foreground/15">
              <Bot className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold leading-tight">
                AI Menadžer
              </p>
              <p className="text-xs opacity-80">MAKSAŽA · obično odgovara odmah</p>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-background/40 p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <p
                  className={[
                    'max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-br-sm bg-primary text-primary-foreground'
                      : 'rounded-bl-sm border border-border bg-card text-foreground',
                  ].join(' ')}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-card px-3 pt-2">
            <div className="flex flex-wrap gap-1.5 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Napišite pitanje…"
              aria-label="Poruka za AI Menadžera"
              className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
            <button
              type="submit"
              aria-label="Pošalji poruku"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-opacity hover:opacity-90"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
