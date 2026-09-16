'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { FAQ as FAQ_ITEMS } from '@/lib/maksaza-data'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div>
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
          <HelpCircle className="size-3.5" /> Česta pitanja
        </span>
        <h2 className="font-heading mt-3 text-3xl font-extrabold text-foreground">
          Sve što vas zanima
        </h2>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i
          return (
            <div
              key={item.q}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-heading font-bold text-foreground">
                  {item.q}
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 text-accent transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-pretty text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
