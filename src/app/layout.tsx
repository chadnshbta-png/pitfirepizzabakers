import type { Metadata } from 'next'
import { Cormorant_Garamond, Josefin_Sans } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const josefin = Josefin_Sans({
  weight: ['100', '200', '300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-josefin',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pitfire Pizza — Crafted to Inspire',
  description:
    '72 Hour Artisan Dough. Premium Ingredients. Unforgettable Flavor. Experience pizza reimagined.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${josefin.variable}`}>
      <body className="grain">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
