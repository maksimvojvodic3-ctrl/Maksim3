import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://maksaza-sajt.vercel.app'),
  title: {
    default: 'MAKSAŽA — Premium Masaža & Wellness | Banovo brdo, Beograd',
    template: '%s | MAKSAŽA',
  },
  description:
    'MAKSAŽA — premium masaža i wellness na Banovom brdu (Beograd) i dolazak na adresu. Masaža leđa, nogu, stopala, ruku, lica i kombo paket. Povoljan cenovnik po minutu, mesečne i godišnje karte, nedeljni popusti i bonus Točak Sreće. Rezerviši termin subotom.',
  generator: 'v0.app',
  applicationName: 'MAKSAŽA',
  keywords: [
    'masaža',
    'masaza Beograd',
    'masaža Banovo brdo',
    'masaža leđa',
    'masaža nogu',
    'masaža stopala',
    'masaža ruku',
    'masaža lica',
    'relax masaža',
    'wellness Beograd',
    'masaža u kući',
    'masaža na adresu',
    'MAKSAŽA',
    'opuštajuća masaža',
    'sportska masaža',
  ],
  authors: [{ name: 'MAKSAŽA' }],
  creator: 'MAKSAŽA',
  category: 'health',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    url: 'https://maksaza-sajt.vercel.app',
    siteName: 'MAKSAŽA',
    title: 'MAKSAŽA — Premium Masaža & Wellness',
    description:
      'Premium masaža i wellness na Banovom brdu i dolazak na adresu. Cenovnik, paketi, nedeljni popusti i bonus Točak Sreće. Rezerviši termin.',
    images: [
      {
        url: '/maksaza-hero.png',
        width: 900,
        height: 700,
        alt: 'MAKSAŽA premium wellness ambijent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAKSAŽA — Premium Masaža & Wellness',
    description:
      'Premium masaža i wellness na Banovom brdu i dolazak na adresu. Cenovnik, paketi, nedeljni popusti i bonus Točak Sreće.',
    images: ['/maksaza-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2f5d3a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="sr"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HealthAndBeautyBusiness',
              name: 'MAKSAŽA',
              description:
                'Premium masaža i wellness — masaža leđa, nogu, stopala, ruku, lica i kombo paket. Dolazak na adresu.',
              image: 'https://maksaza-sajt.vercel.app/maksaza-hero.png',
              url: 'https://maksaza-sajt.vercel.app',
              email: 'salon.maksaza@gmail.com',
              areaServed: 'Banovo brdo, Beograd',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Banovo brdo',
                addressRegion: 'Beograd',
                addressCountry: 'RS',
              },
              priceRange: '$$',
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Saturday',
                  opens: '10:00',
                  closes: '14:00',
                },
              ],
            }),
          }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
