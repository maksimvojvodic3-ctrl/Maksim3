'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Shuffle, Timer, Footprints, Trophy } from 'lucide-react'

const SIZE = 4 // 4x4 => brojevi 1..15, prazno polje = 0
const TOTAL = SIZE * SIZE

function isSolved(tiles: number[]) {
  for (let i = 0; i < TOTAL - 1; i++) {
    if (tiles[i] !== i + 1) return false
  }
  return tiles[TOTAL - 1] === 0
}

function countInversions(arr: number[]) {
  const vals = arr.filter((v) => v !== 0)
  let inv = 0
  for (let i = 0; i < vals.length; i++) {
    for (let j = i + 1; j < vals.length; j++) {
      if (vals[i] > vals[j]) inv++
    }
  }
  return inv
}

// Rešivost za 4x4: (inverzije + red praznog polja odozdo) mora biti paran
function isSolvable(tiles: number[]) {
  const inv = countInversions(tiles)
  const blankIndex = tiles.indexOf(0)
  const rowFromBottom = SIZE - Math.floor(blankIndex / SIZE)
  return (inv + rowFromBottom) % 2 === 0
}

function shuffled(): number[] {
  let tiles: number[]
  do {
    tiles = Array.from({ length: TOTAL }, (_, i) => i)
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
    }
  } while (!isSolvable(tiles) || isSolved(tiles))
  return tiles
}

export function PuzzleGame({
  disabled,
  onSolved,
  alreadyWon,
}: {
  disabled?: boolean
  onSolved: () => void
  alreadyWon?: boolean
}) {
  const [tiles, setTiles] = useState<number[]>(() =>
    Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL),
  )
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [solved, setSolved] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => () => stopTimer(), [stopTimer])

  const startGame = useCallback(() => {
    setTiles(shuffled())
    setMoves(0)
    setSeconds(0)
    setSolved(false)
    setRunning(true)
    stopTimer()
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
  }, [stopTimer])

  const move = useCallback(
    (index: number) => {
      if (!running || solved) return
      const blank = tiles.indexOf(0)
      const r1 = Math.floor(index / SIZE)
      const c1 = index % SIZE
      const r2 = Math.floor(blank / SIZE)
      const c2 = blank % SIZE
      const adjacent =
        (r1 === r2 && Math.abs(c1 - c2) === 1) ||
        (c1 === c2 && Math.abs(r1 - r2) === 1)
      if (!adjacent) return
      const next = tiles.slice()
      ;[next[index], next[blank]] = [next[blank], next[index]]
      setTiles(next)
      setMoves((m) => m + 1)
      if (isSolved(next)) {
        setSolved(true)
        setRunning(false)
        stopTimer()
        onSolved()
      }
    },
    [running, solved, tiles, onSolved, stopTimer],
  )

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Izazov slagalice
          </h3>
          <p className="text-sm text-muted-foreground">
            Složi brojeve od 1 do 15 po redu. Prazno polje ide u donji desni ugao.
          </p>
        </div>
        <button
          type="button"
          onClick={startGame}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Shuffle className="size-4" />
          {running ? 'Promešaj ponovo' : 'Započni izazov'}
        </button>
      </div>

      {disabled && (
        <p className="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-medium text-accent">
          Prijavi se da bi igrao/la izazov i osvojio/la bonus popust.
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-foreground">
          <Footprints className="size-4 text-accent" /> Potezi: {moves}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-foreground">
          <Timer className="size-4 text-accent" /> {mm}:{ss}
        </span>
        {alreadyWon && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
            <Trophy className="size-4" /> Već osvojen bonus
          </span>
        )}
      </div>

      <div
        className="mx-auto grid aspect-square w-full max-w-sm gap-2 rounded-xl bg-secondary/60 p-2"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
      >
        {tiles.map((tile, i) => {
          if (tile === 0) {
            return <div key={i} className="rounded-lg bg-transparent" aria-hidden />
          }
          const correct = tile === i + 1
          return (
            <button
              key={i}
              type="button"
              onClick={() => move(i)}
              disabled={!running || solved}
              className={[
                'flex aspect-square items-center justify-center rounded-lg text-xl font-bold tabular-nums shadow-sm transition-all sm:text-2xl',
                running && !solved ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default',
                correct
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground ring-1 ring-border',
              ].join(' ')}
            >
              {tile}
            </button>
          )
        })}
      </div>

      {solved && (
        <p className="mt-4 text-center text-sm font-semibold text-primary">
          Bravo! Rešeno za {moves} poteza i {mm}:{ss}. Zavrti Točak Sreće!
        </p>
      )}
      {!running && !solved && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Pritisni „Započni izazov” da promešaš tablu i pokreneš tajmer.
        </p>
      )}
    </div>
  )
}
