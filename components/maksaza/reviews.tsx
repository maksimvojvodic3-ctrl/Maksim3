'use client'

import { useState, useEffect } from 'react'
import { Star, User } from 'lucide-react'
import { STATS } from '@/lib/maksaza-data'

export function Reviews() {
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('maksaza_reviews')
    if (stored) {
      setReviews(JSON.parse(stored))
    }
  }, [])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="font-heading text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Utisci klijenata
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
          Pročitajte šta kažu naši zadovoljni klijenti o našem salonu.
        </p>
      </div>

      {/* Statistika */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Prosečna ocena', value: `${avgRating} ⭐` },
          { label: 'Ukupno recenzija', value: reviews.length },
          { label: 'Zadovoljnih klijenata', value: `${reviews.filter(r => r.rating >= 4).length}` },
          { label: 'Redovnih klijenata', value: '100+' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 p-6 text-center shadow-sm"
          >
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-2 text-sm text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recenzije */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 6).map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('sr-RS')}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-pretty text-sm text-foreground leading-relaxed">
              "{review.text}"
            </p>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground">
            Još nema recenzija. Zakažite masažu i budite prvi koji ćete ostaviti ocenu! ⭐
          </p>
        </div>
      )}
    </div>
  )
}
