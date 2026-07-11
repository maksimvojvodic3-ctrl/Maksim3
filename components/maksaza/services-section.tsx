'use client'

import { useState } from 'react'
import {
  Check,
  Share2,
  Copy,
  ThumbsUp,
  MessageCircle,
  HeartHandshake,
} from 'lucide-react'
import { SERVICE_HIGHLIGHTS, WHY_US } from '@/lib/maksaza-data'

const SITE_URL = 'https://maksaza-sajt.vercel.app'
const SHARE_TEXT =
  'MAKSAŽA — premium masaža & wellness. Pogledaj cenovnik, rezerviši termin i osvoji bonus popust!'

export function ServicesSection() {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-extrabold text-foreground">
          Naše usluge
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-pretty text-muted-foreground leading-relaxed">
          Profesionalne masaže prilagođene vašim potrebama — za opuštanje,
          oporavak i zdravlje tela.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_HIGHLIGHTS.map((s) => (
          <article
            key={s.id}
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <HeartHandshake className="size-5" />
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {s.title}
            </h3>
            <p className="mt-2 text-pretty text-sm text-muted-foreground leading-relaxed">
              {s.text}
            </p>
          </article>
        ))}
      </div>

      {/* Zašto MAKSAŽA + Deljenje */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
          <h3 className="font-heading text-xl font-bold text-foreground">
            Zašto MAKSAŽA?
          </h3>
          <ul className="mt-4 space-y-3">
            {WHY_US.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3.5" />
                </span>
                <span className="text-pretty text-sm text-foreground leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center sm:p-8">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/15 text-accent">
            <Share2 className="size-6" />
          </span>
          <h3 className="font-heading mt-3 text-xl font-bold text-foreground">
            Podeli MAKSAŽA sa prijateljima
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm text-muted-foreground leading-relaxed">
            Pomozi prijateljima da se opuste — podeli sajt i preporuke u jednom
            kliku.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SITE_URL}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            >
              <ThumbsUp className="size-4" /> Facebook
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-primary" /> Kopirano!
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Kopiraj link
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
