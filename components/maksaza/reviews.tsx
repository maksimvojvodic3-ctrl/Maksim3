'use client'

import { useEffect, useState } from 'react'
import { Star, Quote, MessageSquarePlus } from 'lucide-react'
import { LS, STATS, type Review } from '@/lib/maksaza-data'

function loadReviews(): Review[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LS.reviews)
    return raw ? (JSON.parse(raw) as Review[]) : []
  } catch {
    return []
  }
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setReviews(loadReviews())
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    const review: Review = {
      id: crypto.randomUUID(),
      name: name.trim(),
      rating,
      text: text.trim(),
      createdAt: Date.now(),
    }
    const next = [review, ...reviews]
    setReviews(next)
    localStorage.setItem(LS.reviews, JSON.stringify(next))
    setName('')
    setText('')
    setRating(5)
    setDone(true)
    setTimeout(() => setDone(false), 4000)
  }

  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null

  const fieldClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30'

  return (
    <div>
      {/* Traka sa činjeničnim podacima */}
      <div className="mb-10 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-foreground">
          Utisci klijenata
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-pretty text-muted-foreground">
          {avg
            ? `Prosečna ocena ${avg} / 5 na osnovu ${reviews.length} ${
                reviews.length === 1 ? 'utiska' : 'utisaka'
              }.`
            : 'Budite prvi koji će podeliti iskustvo sa MAKSAŽA tretmanima.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Forma za ostavljanje utiska */}
        <form
          onSubmit={submit}
          className="lg:col-span-2 h-fit rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <MessageSquarePlus className="size-5 text-accent" />
            Ostavite svoj utisak
          </h3>

          <label htmlFor="rev-name" className="mb-1 block text-sm font-medium text-foreground">
            Ime
          </label>
          <input
            id="rev-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vaše ime"
            className={`mb-4 ${fieldClass}`}
          />

          <span className="mb-1 block text-sm font-medium text-foreground">Ocena</span>
          <div className="mb-4 flex items-center gap-1" role="radiogroup" aria-label="Ocena">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} od 5`}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  className="rounded p-0.5"
                >
                  <Star
                    className={`size-7 transition-colors ${
                      value <= (hover || rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          <label htmlFor="rev-text" className="mb-1 block text-sm font-medium text-foreground">
            Vaš utisak
          </label>
          <textarea
            id="rev-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Kako je proteklo vaše iskustvo?"
            className={`mb-4 resize-none ${fieldClass}`}
          />

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Pošalji utisak
          </button>

          {done && (
            <p className="mt-3 text-center text-sm font-medium text-primary">
              Hvala! Vaš utisak je objavljen.
            </p>
          )}
        </form>

        {/* Lista pravih utisaka */}
        <div className="lg:col-span-3">
          {reviews.length === 0 ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
              <Quote className="mb-3 size-10 text-accent/30" />
              <p className="text-pretty font-medium text-foreground">
                Još nema utisaka.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Prvi utisak ostavite preko forme — prikazaće se ovde.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((r) => (
                <figure
                  key={r.id}
                  className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <Quote className="absolute right-5 top-5 size-8 text-accent/20" />
                  <div
                    className="mb-3 flex items-center gap-0.5"
                    aria-label={`Ocena ${r.rating} od 5`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < r.rating
                            ? 'fill-accent text-accent'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-pretty text-foreground leading-relaxed">
                    {r.text}
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-primary font-heading font-bold text-primary-foreground">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {r.name}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
