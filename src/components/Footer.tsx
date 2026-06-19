'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const columns = [
  {
    heading: 'Menu',
    links: [
      { label: 'Pizzas', href: '#menu' },
      { label: 'Melts', href: '#menu' },
      { label: 'Pasta', href: '#menu' },
      { label: 'Wings', href: '#menu' },
      { label: 'Sides', href: '#menu' },
      { label: 'Desserts', href: '#menu' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Our Story', href: '#story' },
      { label: 'Ingredients', href: '#ingredients' },
      { label: 'Signature Recipes', href: '#signature' },
      { label: 'Why Pizza Hut', href: '#menu' },
    ],
  },
]

const hours = [
  { day: 'Sun — Thu', time: '11:00 — 01:00' },
  { day: 'Fri — Sat', time: '11:00 — 02:00' },
]

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', d: 'M16 3H8a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V8a5 5 0 00-5-5zm-4 5.5A3.5 3.5 0 1112 15.5 3.5 3.5 0 0112 8.5zM17.5 6a1 1 0 11-1 1 1 1 0 011-1z' },
  { label: 'Facebook', href: 'https://facebook.com', d: 'M14 9h3V6h-3a4 4 0 00-4 4v2H8v3h2v6h3v-6h2.5l.5-3H13v-1.5A1.5 1.5 0 0114 9z' },
  { label: 'X', href: 'https://x.com', d: 'M4 4l7 8.5L4 20h2l6-6.5L17 20h3l-7.3-8.8L19.5 4h-2l-5.4 5.9L7 4z' },
  { label: 'TikTok', href: 'https://tiktok.com', d: 'M16 3c.4 2.6 2 4.2 4.5 4.4v3c-1.7.1-3.2-.4-4.5-1.3v6.1A6.2 6.2 0 119.8 9v3.1a3.1 3.1 0 103.2 3V3z' },
]

function go(href: string) {
  if (href.startsWith('#')) document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  else window.open(href, '_blank', 'noopener')
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <footer ref={ref} className="relative bg-black border-t border-white/5 pt-24 pb-10 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[240px] bg-primary/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12 mb-20">
          {/* brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="col-span-2"
          >
            <Image src="/logo/pizzahut-desktop-logo.svg" alt="Pizza Hut" width={160} height={40} className="h-9 w-auto mb-6" />
            <p className="font-cormorant italic text-white/40 leading-relaxed max-w-xs" style={{ fontSize: '1.05rem' }}>
              Hand-stretched dough, premium ingredients and a promise kept since 1958 — take care of the customer.
            </p>
            <div className="flex items-center gap-3 mt-7">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* link columns */}
          {columns.map((col, ci) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: (ci + 1) * 0.08 }}
            >
              <h4 className="font-josefin text-[8px] tracking-[0.4em] uppercase text-white/30 mb-5">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={(e) => { e.preventDefault(); go(l.href) }}
                      className="font-josefin text-[11px] tracking-[0.1em] text-white/45 hover:text-white transition-colors duration-300 hover-underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* contact + hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.24 }}
          >
            <h4 className="font-josefin text-[8px] tracking-[0.4em] uppercase text-white/30 mb-5">Contact</h4>
            <a href="tel:+966920000910" className="block font-cormorant text-white/70 hover:text-white transition-colors mb-1" style={{ fontSize: '1.15rem' }}>
              920 000 910
            </a>
            <a href="mailto:hello@pizzahut.me" className="block font-josefin text-[11px] tracking-[0.08em] text-white/40 hover:text-white transition-colors mb-6">
              hello@pizzahut.me
            </a>
            <h4 className="font-josefin text-[8px] tracking-[0.4em] uppercase text-white/30 mb-4">Hours</h4>
            <ul className="space-y-2">
              {hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between gap-4">
                  <span className="font-josefin text-[10px] tracking-[0.1em] text-white/45">{h.day}</span>
                  <span className="font-cormorant text-white/70" style={{ fontSize: '0.95rem' }}>{h.time}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* big wordmark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="mb-10 overflow-hidden"
        >
          <div className="font-cormorant font-light text-white/[0.04] leading-none select-none" style={{ fontSize: 'clamp(3rem,13vw,11rem)', letterSpacing: '-0.02em' }}>
            PIZZA HUT
          </div>
        </motion.div>

        {/* bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5"
        >
          <p className="font-josefin text-[8px] tracking-[0.3em] uppercase text-white/20">
            © {new Date().getFullYear()} Yum! III (UK) Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-josefin text-[8px] tracking-[0.3em] uppercase text-white/20">Crafted Fresh Daily</span>
            <span className="block w-4 h-px bg-primary/40" />
            <span className="font-josefin text-[8px] tracking-[0.3em] uppercase text-white/20">Jeddah, KSA</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
