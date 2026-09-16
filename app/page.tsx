'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Lightbulb,
  LogIn,
  LogOut,
  UserRound,
  Gift,
  PartyPopper,
  MapPin,
  Clock,
  Home,
  BadgePercent,
  Mail,
} from 'lucide-react'
import {
  INFO,
  LS,
  dailyFact,
  weeklyBanner,
  type Session,
  type StoredUser,
} from '@/lib/maksaza-data'
import { PricingTables } from '@/components/maksaza/pricing-tables'
import { Reservation } from '@/components/maksaza/reservation'
import { PuzzleGame } from '@/components/maksaza/puzzle-game'
import { LuckyWheel } from '@/components/maksaza/lucky-wheel'
import { AdminPanel } from '@/components/maksaza/admin-panel'
import { AuthModal, type AuthResult } from '@/components/maksaza/auth-modal'
import { Modal } from '@/components/maksaza/modal'
import { AiManager } from '@/components/maksaza/ai-manager'
import { ServicesSection } from '@/components/maksaza/services-section'
import { Gallery } from '@/components/maksaza/gallery'
import { Reviews } from '@/components/maksaza/reviews'
import { Faq } from '@/components/maksaza/faq'

const NAV = [
  { id: 'usluge', label: 'Usluge' },
  { id: 'cenovnik', label: 'Cenovnik' },
  { id: 'galerija', label: 'Galerija' },
  { id: 'utisci', label: 'Utisci' },
  { id: 'faq', label: 'Pitanja' },
  { id: 'info', label: 'Info' },
  { id: 'rezervacija', label: 'Rezervacija' },
  { id: 'igra', label: 'Igra & Nagrada' },
  { id: 'admin', label: 'Admin' },
]

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const [banner, setBanner] = useState('')
  const [fact, setFact] = useState('')

  const [users, setUsers] = useState<StoredUser[]>([])
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])

  const [authOpen, setAuthOpen] = useState(false)
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [reward, setReward] = useState<number | null>(null)

  // init iz localStorage (klijent)
  useEffect(() => {
    setMounted(true)
    setBanner(weeklyBanner())
    setFact(dailyFact())
    setUsers(readJSON<StoredUser[]>(LS.users, []))
    setSessions(readJSON<Session[]>(LS.sessions, []))
    setCurrentUser(localStorage.getItem(LS.current))
  }, [])

  const persistUsers = useCallback((next: StoredUser[]) => {
    setUsers(next)
    localStorage.setItem(LS.users, JSON.stringify(next))
  }, [])

  const persistSessions = useCallback((next: Session[]) => {
    setSessions(next)
    localStorage.setItem(LS.sessions, JSON.stringify(next))
  }, [])

  const user = users.find((u) => u.username === currentUser) ?? null
  const discount = user?.discount ?? 0

  const handleRegister = useCallback(
    (data: {
      username: string
      password: string
      contact: string
      contactType: string
    }): AuthResult => {
      if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
        return { ok: false, error: 'To korisničko ime već postoji.' }
      }
      const next: StoredUser[] = [
        ...users,
        { ...data, discount: 0, createdAt: Date.now() },
      ]
      persistUsers(next)
      setCurrentUser(data.username)
      localStorage.setItem(LS.current, data.username)
      return { ok: true }
    },
    [users, persistUsers],
  )

  const handleLogin = useCallback(
    (username: string, password: string): AuthResult => {
      const found = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase(),
      )
      if (!found || found.password !== password) {
        return { ok: false, error: 'Pogrešno ime ili lozinka.' }
      }
      setCurrentUser(found.username)
      localStorage.setItem(LS.current, found.username)
      return { ok: true }
    },
    [users],
  )

  const handleLogout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem(LS.current)
    setPuzzleSolved(false)
  }, [])

  const handleWheelResult = useCallback(
    (won: number) => {
      setReward(won)
      if (currentUser) {
        const next = users.map((u) =>
          u.username === currentUser
            ? { ...u, discount: Math.max(u.discount, won) }
            : u,
        )
        persistUsers(next)
      }
    },
    [currentUser, users, persistUsers],
  )

  const addSession = useCallback(
    (s: Omit<Session, 'id' | 'createdAt'>) => {
      const next = [
        ...sessions,
        { ...s, id: crypto.randomUUID(), createdAt: Date.now() },
      ]
      persistSessions(next)
    },
    [sessions, persistSessions],
  )

  const deleteSession = useCallback(
    (id: string) => {
      persistSessions(sessions.filter((s) => s.id !== id))
    },
    [sessions, persistSessions],
  )

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary font-heading text-lg font-extrabold text-primary-foreground">
              M
            </span>
            <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
              MAKSAŽA
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {mounted && user ? (
              <>
                <span className="hidden items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground sm:inline-flex">
                  <UserRound className="size-4 text-accent" />
                  {user.username}
                  {discount > 0 && (
                    <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                      -{discount}%
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <LogOut className="size-4" /> Odjava
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <LogIn className="size-4" /> Prijava
              </button>
            )}
          </div>
        </div>
      </header>

      {/* WEEKLY BANNER */}
      <div className="bg-accent text-accent-foreground" id="top">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2.5 text-center text-sm font-semibold">
          <Gift className="size-4 shrink-0" />
          <span className="text-balance">
            {mounted ? banner : 'Nedeljni popust se učitava…'}
          </span>
        </div>
      </div>

      {/* DAILY FACT */}
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-sm text-foreground">
          <Lightbulb className="size-4 shrink-0 text-primary" />
          <span className="text-pretty">
            <strong className="font-semibold">Zanimljivost dana:</strong>{' '}
            {mounted ? fact : '…'}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
              <Sparkles className="size-3.5" /> Premium masaža & wellness
            </span>
            <h1 className="font-heading mt-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground text-balance sm:text-5xl">
              Opusti telo i um uz MAKSAŽA tretmane
            </h1>
            <p className="mt-4 max-w-md text-pretty text-muted-foreground leading-relaxed">
              Profesionalne masaže, fleksibilni paketi i nedeljni popusti. Reši
              izazov slagalice, zavrti Točak Sreće i osvoji bonus popust na svoju
              rezervaciju.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#rezervacija"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Rezerviši termin
              </a>
              <a
                href="#igra"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                Igraj i osvoji popust
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
              <Image
                src="/maksaza-hero.png"
                alt="MAKSAŽA premium wellness ambijent sa peškirima, eukaliptusom i svećom"
                width={900}
                height={700}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-card px-5 py-3 shadow-lg sm:block">
              <p className="font-heading text-2xl font-extrabold text-primary">
                -10%
              </p>
              <p className="text-xs text-muted-foreground">
                za redovne klijente
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-16 px-4 py-12">
        {/* USLUGE & ZAŠTO MAKSAŽA */}
        <section id="usluge" className="scroll-mt-24">
          <ServicesSection />
        </section>

        {/* CENOVNIK & PAKETI */}
        <section id="cenovnik" className="scroll-mt-24">
          <PricingTables />
        </section>

        {/* GALERIJA */}
        <section id="galerija" className="scroll-mt-24">
          <Gallery />
        </section>

        {/* UTISCI KLIJENATA */}
        <section id="utisci" className="scroll-mt-24">
          <Reviews />
        </section>

        {/* ČESTA PITANJA */}
        <section id="faq" className="scroll-mt-24">
          <Faq />
        </section>

        {/* INFO & KONTAKT */}
        <section id="info" className="scroll-mt-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Home className="size-5" />, title: 'Dolazak na adresu', text: INFO.home },
              { icon: <MapPin className="size-5" />, title: 'Lokacija', text: INFO.location },
              { icon: <Clock className="size-5" />, title: 'Termini', text: INFO.hours },
              { icon: <BadgePercent className="size-5" />, title: 'Lojalnost', text: INFO.loyalty },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="mb-3 grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  {item.icon}
                </span>
                <h4 className="font-heading font-bold text-foreground">
                  {item.title}
                </h4>
                <p className="mt-1 text-pretty text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
            <Mail className="size-4" />
            <a href={`mailto:${INFO.email}`} className="hover:underline">
              {INFO.email}
            </a>
          </div>
        </section>

        {/* REZERVACIJA */}
        <section id="rezervacija" className="scroll-mt-24">
          <Reservation discount={discount} />
        </section>

        {/* IGRA & NAGRADA */}
        <section id="igra" className="scroll-mt-24 space-y-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-extrabold text-foreground">
              Igra & Nagrada
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-pretty text-muted-foreground">
              Reši slagalicu 4×4, a zatim zavrti Točak Sreće za bonus popust koji
              se čuva na tvom profilu.
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <PuzzleGame
              disabled={!mounted || !user}
              alreadyWon={discount > 0}
              onSolved={() => setPuzzleSolved(true)}
            />

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-heading mb-1 text-2xl font-bold text-foreground">
                Točak Sreće
              </h3>
              <p className="mb-5 text-sm text-muted-foreground">
                {puzzleSolved
                  ? 'Otključano! Zavrti i osvoji svoj bonus popust.'
                  : 'Reši slagalicu da otključaš Točak Sreće.'}
              </p>
              <div
                className={
                  puzzleSolved
                    ? ''
                    : 'pointer-events-none select-none opacity-40 blur-[1px]'
                }
              >
                <LuckyWheel canSpin={puzzleSolved} onResult={handleWheelResult} />
              </div>
            </div>
          </div>
        </section>

        {/* ADMIN */}
        <section id="admin" className="scroll-mt-24">
          <AdminPanel
            sessions={sessions}
            onAdd={addSession}
            onDelete={deleteSession}
          />
        </section>
      </main>

      <footer className="border-t border-border bg-secondary/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary font-heading font-extrabold text-primary-foreground">
              M
            </span>
            <span className="font-heading text-lg font-extrabold text-foreground">
              MAKSAŽA
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Premium masaža & wellness · {INFO.location} · Subota 10:00–14:00 ·{' '}
            {INFO.email}
          </p>
        </div>
      </footer>

      {/* AI MENADŽER (CHATBOT) */}
      <AiManager />

      {/* AUTH MODAL */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onRegister={handleRegister}
        onLogin={handleLogin}
      />

      {/* REWARD MODAL */}
      <Modal
        open={reward !== null}
        onClose={() => setReward(null)}
        title="Čestitamo!"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-accent/15 text-accent">
            <PartyPopper className="size-8" />
          </div>
          <p className="text-pretty text-foreground leading-relaxed">
            🎉 Čestitamo! Rešili ste slagalicu, zavrteli točak i osvojili bonus od{' '}
            <strong className="text-accent">{reward}% popusta!</strong>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Popust je sačuvan na tvom profilu i automatski se primenjuje pri
            rezervaciji.
          </p>
          <button
            type="button"
            onClick={() => setReward(null)}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Iskoristi popust
          </button>
        </div>
      </Modal>
    </div>
  )
}
