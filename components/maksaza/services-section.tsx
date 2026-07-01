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

const SITE_URL = 'https://vercel.app'
const SHARE_TEXT =
  'MAKSAŽA – premium masaža & wellness. Pogledaj cenovnik, rezerviši termin i osvoji bonus popust!'

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
        <h2 className="font-heading text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Naše usluge
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
          Profesionalne masaže prilagođene vašim potrebama – za opuštanje, oporavak i zdravlje tela.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_HIGHLIGHTS.map((s, idx) => (
          <article
            key={s.id}
            className="group rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:scale-105"
            style={{
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <span className="mb-4 inline-flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-all duration-300 group-hover:scale-110 group-hover:from-primary/40 group-hover:to-accent/40">
              <HeartHandshake className="size-6" />
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {s.title}
            </h3>
            <p className="mt-3 text-pretty text-sm text-muted-foreground leading-relaxed">
              {s.text}
            </p>
          </article>
        ))}
      </div>

      {/* Zašto MAKSAŽA + Deljenje */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 p-8 shadow-sm">
          <h3 className="font-heading text-2xl font-bold text-foreground">
            🎯 Zašto MAKSAŽA?
          </h3>
          <ul className="mt-6 space-y-4">
            {WHY_US.map((item, idx) => (
              <li key={item} className="flex items-start gap-3" style={{ animationDelay: `${idx * 50}ms` }}>
                <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold">
                  <Check className="size-4" />
                </span>
                <span className="text-pretty text-foreground leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 p-8 text-center shadow-sm">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/20 text-accent">
            <Share2 className="size-7" />
          </span>
          <h3 className="font-heading mt-4 text-2xl font-bold text-foreground">
            📢 Podeli sa prijateljima
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-pretty text-foreground/80 leading-relaxed">
            Pomozi prijateljima da se opuste – podeli sajt i preporuke u jednom kliku.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://whatsapp.com/share?text=${encodeURIComponent(SHARE_TEXT + ' ' + SITE_URL)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all duration-200 hover:bg-green-50 hover:border-green-300 hover:text-green-700 dark:hover:bg-green-950"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-950"
            >
              <ThumbsUp className="size-4" /> Facebook
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              {copied ? (
                <>
                  <Check className="size-4" /> Kopirano!
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
