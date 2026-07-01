'use client'

import { useMemo, useRef, useState } from 'react'
import { WHEEL_SLICES } from '@/lib/maksaza-data'

// Naizmenične boje kriški: tamno zelena i ljubičasta
const COLORS = ['#2f5d3a', '#7c4dbd', '#3c7a4c', '#9460d6', '#2f5d3a', '#7c4dbd']

export function LuckyWheel({
  canSpin,
  onResult,
}: {
  canSpin: boolean
  onResult: (discount: number) => void
}) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  const n = WHEEL_SLICES.length
  const sliceAngle = 360 / n

  // conic-gradient pozadina sa jednakim kriškama
  const background = useMemo(() => {
    const stops = WHEEL_SLICES.map((_, i) => {
      const start = (i * sliceAngle).toFixed(2)
      const end = ((i + 1) * sliceAngle).toFixed(2)
      return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`
    }).join(', ')
    return `conic-gradient(from -${sliceAngle / 2}deg, ${stops})`
  }, [sliceAngle])

  const spin = () => {
    if (spinning || !canSpin) return
    setSpinning(true)
    const winner = Math.floor(Math.random() * n)
    const extraTurns = 6 // pun krug x6 radi efekta
    // kazaljka je na vrhu (12h). Rotiramo tako da centar kriške "winner" dođe na vrh.
    const target = extraTurns * 360 + (360 - winner * sliceAngle)
    const base = rotation - (rotation % 360)
    const next = base + target
    setRotation(next)
    window.setTimeout(() => {
      setSpinning(false)
      onResult(WHEEL_SLICES[winner])
    }, 4200)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        {/* Kazaljka */}
        <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
          <div className="h-0 w-0 border-x-[14px] border-t-[24px] border-x-transparent border-t-accent drop-shadow" />
        </div>
        {/* Obruč */}
        <div className="rounded-full bg-card p-3 shadow-2xl ring-4 ring-accent/40">
          <div
            ref={wheelRef}
            className="relative size-64 rounded-full sm:size-72"
            style={{
              background,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? 'transform 4.1s cubic-bezier(0.18, 0.9, 0.2, 1)'
                : 'none',
            }}
          >
            {WHEEL_SLICES.map((d, i) => {
              const angle = i * sliceAngle
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 origin-left"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span className="ml-[28%] inline-block -translate-y-1/2 text-base font-extrabold text-white drop-shadow sm:text-lg">
                    {d}%
                  </span>
                </div>
              )
            })}
            {/* Centar */}
            <div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-card font-heading text-xs font-bold text-primary shadow ring-2 ring-accent/40">
              MŽ
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning || !canSpin}
        className="inline-flex items-center justify-center rounded-full bg-accent px-10 py-3 text-base font-extrabold tracking-wide text-accent-foreground shadow-lg transition-all hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
      >
        {spinning ? 'Vrti se…' : 'ZAVRTI'}
      </button>
    </div>
  )
}
