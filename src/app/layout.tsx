import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

/* Brand typography — "Suisse" per Branding.json is a paid face we can't load,
   so we substitute Hanken Grotesk: a clean neo-grotesque with the same modern,
   high-energy, neutral character. One family for heading + body, exactly as the
   config specifies. The legacy --font-cormorant / --font-josefin variables are
   re-pointed to it so existing utility classes resolve to the brand sans. */
const sans = Hanken_Grotesk({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pizza Hut — Crafted Fresh Daily',
  description:
    'Hand-stretched dough. Premium ingredients. Unforgettable flavor. Pizza Hut, reimagined as a cinematic experience.',
  icons: {
    icon: 'https://d2l1qb2xg9gi7w.cloudfront.net/jd/web-static-images/fav_icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="grain">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
