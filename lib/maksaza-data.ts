// MAKSAŽA — centralna logika i podaci

export type AgeTier = 'youth' | 'adult'

export type Service = {
  id: string
  name: string
  youthRate: number // din/min — do 18 god
  adultRate: number // din/min — 18+
  minMinutes?: number // minimalno trajanje (npr. Kombo paket)
}

export type Paket = {
  id: string
  name: string
  desc: string // trajanje
  youthPrice: number // din — do 18 god
  adultPrice: number // din — 18+
  popular?: boolean
}

export type Session = {
  id: string
  client: string
  serviceId: string
  serviceName: string
  minutes: number
  price: number
  createdAt: number
}

export type StoredUser = {
  username: string
  password: string
  contact: string
  contactType: string
  discount: number // osvojeni bonus popust u %
  createdAt: number
}

export const ADMIN_PASSWORD = 'admin123'

// Kontakt i informacije
export const INFO = {
  home: 'Masaža u vašem domu — putni trošak 50 din/km',
  location: 'Banovo brdo i okolina',
  hours: 'Subota 10:00–14:00, po prethodnoj rezervaciji',
  loyalty: 'Popust za redovne klijente: 10% popusta nakon 5. dolaska.',
  email: 'salon.maksaza@gmail.com',
} as const

// CENOVNIK — pojedinačne usluge (din/min, po uzrastu)
export const SERVICES: Service[] = [
  { id: 'hodanje-leda', name: 'Hodanje po leđima', youthRate: 5, adultRate: 10 },
  { id: 'masaza-lica', name: 'Masaža lica', youthRate: 8, adultRate: 15 },
  { id: 'masaza-ruku', name: 'Masaža ruku', youthRate: 10, adultRate: 20 },
  { id: 'masaza-stopala', name: 'Masaža stopala', youthRate: 10, adultRate: 20 },
  { id: 'masaza-leda', name: 'Masaža leđa', youthRate: 12, adultRate: 25 },
  { id: 'masaza-nogu', name: 'Masaža nogu', youthRate: 12, adultRate: 25 },
  {
    id: 'kombo',
    name: 'Kombo paket (ruke + noge + leđa)',
    youthRate: 25,
    adultRate: 55,
    minMinutes: 30,
  },
]

// PAKETI / KARTE (din, po uzrastu)
export const PAKETI: Paket[] = [
  {
    id: 'dnevna',
    name: 'Dnevna karta',
    desc: '20 min',
    youthPrice: 250,
    adultPrice: 500,
  },
  {
    id: 'nedeljna',
    name: 'Nedeljna karta',
    desc: '2 sata',
    youthPrice: 1320,
    adultPrice: 2640,
  },
  {
    id: 'mesecna',
    name: 'Mesečna karta',
    desc: '8 sati',
    youthPrice: 4800,
    adultPrice: 9600,
    popular: true,
  },
  {
    id: 'godisnja',
    name: 'Godišnja karta',
    desc: '96 sati',
    youthPrice: 50400,
    adultPrice: 100800,
  },
]

export function serviceRate(s: Service, age: AgeTier): number {
  return age === 'youth' ? s.youthRate : s.adultRate
}

export function paketPrice(p: Paket, age: AgeTier): number {
  return age === 'youth' ? p.youthPrice : p.adultPrice
}

// Termini za rezervaciju (10:00 - 13:30, Subota 10:00–14:00)
export const TIME_SLOTS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
]

// Nedeljni baneri — menja se tačno jednom nedeljno (po broju nedelje u godini)
export const WEEKLY_BANNERS = [
  '🎉 Popust ove nedelje: 10% na sve Mesečne i Godišnje karte!',
  '🎉 Popust ove nedelje: 5% na Kombo paket masaža!',
  '🎉 Popust ove nedelje: Besplatnih 10 minuta uz svaku masažu leđa!',
  '🎉 Popust ove nedelje: 15% na Masažu nogu i stopala!',
  '🎉 Popust ove nedelje: 2 + 1 gratis na Masažu lica!',
  '🎉 Popust ove nedelje: Nedeljna karta po ceni Dnevne — uštedi!',
]

// Zanimljivosti — menja se svakog dana
export const DAILY_FACTS = [
  'Masaža smanjuje nivo kortizola (hormona stresa) i do 30%.',
  'Već 15 minuta masaže leđa može sniziti krvni pritisak.',
  'Redovna masaža poboljšava cirkulaciju i ubrzava oporavak mišića.',
  'Masaža podstiče lučenje serotonina i dopamina — hormona sreće.',
  'Kvalitetan san je lakši nakon večernje relaks masaže.',
  'Masaža nogu smanjuje osećaj težine i otoka nakon dugog dana.',
  'Masaža lica podstiče cirkulaciju i daje koži zdrav sjaj.',
]

// ISO broj nedelje u godini
export function getWeekNumber(d = new Date()): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export function getDayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0)
  const diff = d.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

export function weeklyBanner(d = new Date()): string {
  return WEEKLY_BANNERS[getWeekNumber(d) % WEEKLY_BANNERS.length]
}

export function dailyFact(d = new Date()): string {
  return DAILY_FACTS[getDayOfYear(d) % DAILY_FACTS.length]
}

export function formatRSD(n: number): string {
  return new Intl.NumberFormat('sr-RS').format(Math.round(n)) + ' din'
}

// Lokalni "storage" ključevi
export const LS = {
  users: 'maksaza_users',
  current: 'maksaza_current_user',
  sessions: 'maksaza_sessions',
  reviews: 'maksaza_reviews',
} as const

export const WHEEL_SLICES = [5, 10, 15, 20, 5, 10]

// Opisi usluga i benefiti — za SEO i prezentaciju
export const SERVICE_HIGHLIGHTS = [
  {
    id: 'leda',
    title: 'Masaža leđa',
    text: 'Oslobađa napetost u leđima i ramenima, ublažava bolove od sedenja i poboljšava držanje tela.',
  },
  {
    id: 'noge',
    title: 'Masaža nogu i stopala',
    text: 'Smanjuje osećaj težine i otoka, podstiče cirkulaciju i donosi pravo olakšanje nakon dugog dana.',
  },
  {
    id: 'ruke',
    title: 'Masaža ruku',
    text: 'Opušta umorne mišiće šaka i podlaktica — idealno za sve koji rade za računarom.',
  },
  {
    id: 'lice',
    title: 'Masaža lica',
    text: 'Podstiče cirkulaciju, opušta mimične mišiće i daje koži zdrav, prirodan sjaj.',
  },
  {
    id: 'kombo',
    title: 'Kombo paket',
    text: 'Ruke, noge i leđa u jednom tretmanu — kompletno opuštanje celog tela.',
  },
  {
    id: 'dom',
    title: 'Dolazak na adresu',
    text: 'Uživajte u masaži u udobnosti svog doma — dolazimo na vašu adresu uz mali putni trošak.',
  },
]

// Zašto MAKSAŽA — prednosti
export const WHY_US = [
  'Profesionalan i ljubazan pristup svakom klijentu',
  'Povoljne cene po minutu i fleksibilni paketi',
  'Nedeljni popusti i bonus Točak Sreće',
  '10% popusta za redovne klijente nakon 5. dolaska',
]

// Galerija ambijenta
export const GALLERY = [
  { src: '/maksaza-gallery-1.png', alt: 'Opuštajuća masaža leđa u MAKSAŽA salonu' },
  { src: '/maksaza-gallery-2.png', alt: 'Spa ambijent — peškiri, sveća i eukaliptus' },
  { src: '/maksaza-gallery-3.png', alt: 'Masaža stopala uz aroma ulja' },
]

// Utisci klijenata — prave recenzije koje klijenti sami ostave (čuva se lokalno)
export type Review = {
  id: string
  name: string
  rating: number
  text: string
  createdAt: number
}

// Činjenične brojke (bez izmišljenih podataka)
export const STATS = [
  { value: '7', label: 'Vrsta masaža' },
  { value: 'Subota', label: 'Radni dan' },
  { value: 'Banovo brdo', label: 'Lokacija' },
  { value: 'Na adresu', label: 'Dolazimo i kod vas' },
]

// Česta pitanja — odgovori su zasnovani na stvarnim podacima salona
export const FAQ = [
  {
    q: 'Kako da zakažem termin?',
    a: 'Termin birate u sekciji „Rezervacija" — izaberete uslugu, uzrast i jedan od slobodnih termina subotom (10:00–14:00), po prethodnoj rezervaciji.',
  },
  {
    q: 'Da li dolazite na kućnu adresu?',
    a: 'Da. Masažu radimo i u vašem domu uz putni trošak od 50 din/km. Lokacija salona je Banovo brdo i okolina.',
  },
  {
    q: 'Kako se računa cena?',
    a: 'Cena se računa po minutu, a razlikuje se za uzrast do 18 godina i 18+. Tačne cene po usluzi nalaze se u sekciji „Cenovnik".',
  },
  {
    q: 'Da li postoji popust za stalne klijente?',
    a: 'Da — redovni klijenti dobijaju 10% popusta nakon 5. dolaska. Dodatni bonus popust možete osvojiti kroz igru (slagalica + Točak Sreće).',
  },
  {
    q: 'Kako da osvojim bonus popust?',
    a: 'Prijavite se, rešite slagalicu 4×4 i zavrtite Točak Sreće. Osvojeni popust se čuva na vašem profilu i automatski primenjuje pri rezervaciji.',
  },
  {
    q: 'Kako da vas kontaktiram?',
    a: 'Pišite nam na salon.maksaza@gmail.com ili kroz „AI Menadžer" chat dole desno za brze informacije o cenama i terminima.',
  },
]
