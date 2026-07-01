'use client'

import Image from 'next/image'
import { GALLERY } from '@/lib/maksaza-data'

export function Gallery() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-foreground">
          Galerija
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-pretty text-muted-foreground">
          Prijatan ambijent i posvećenost svakom detalju — pogled na MAKSAŽA
          doživljaj.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY.map((img, i) => (
          <div
            key={img.src}
            className={`group relative overflow-hidden rounded-2xl border border-border shadow-sm ${
              i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={600}
              height={450}
              className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  )
}
