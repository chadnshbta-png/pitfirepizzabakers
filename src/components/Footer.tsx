'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const footerLinks = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'Our Story', href: '#about' },
      { label: 'The Menu', href: '#menu' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Locations', href: '#locations' },
    ],
  },
  {
    heading: 'Locations',
    links: [
      { label: 'Abu Dhabi', href: 'https://maps.app.goo.gl/FbHS6vwzpop2nSV8A?g_st=ipc' },
      { label: 'JVC', href: 'https://maps.app.goo.gl/X583inGeetrXmzVm8?g_st=ipc' },
      { label: 'Arjan', href: 'https://maps.app.goo.gl/XN7DT6JXUEfJGVfc8' },
      { label: 'Dubai Hills', href: 'https://maps.app.goo.gl/z89BcDy8gu62fWUp8' },
      { label: 'JLT', href: 'https://maps.app.goo.gl/xaxDpyG3VYqs1S7A6' },
      { label: 'Mirdif', href: 'https://maps.app.goo.gl/Zn4PmtUFmoWuwqMW9' },
    ],
  },
  {
    heading: 'Experience',
    links: [
      { label: '72 Hour Dough', href: '#about' },
      { label: 'House-Made Daily', href: '#menu' },
      { label: 'Local Ingredients', href: '#about' },
      { label: 'Artisan Process', href: '#about' },
    ],
  },
]

function handleClick(href: string) {
  if (href.startsWith('#')) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.open(href, '_blank', 'noopener')
  }
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <footer
      ref={ref}
      className="relative bg-black border-t border-white/5 pt-20 pb-10 overflow-hidden"
    >
      {/* Red glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 md:mb-20">

          {/* Brand col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="lg:col-span-1"
          >
            <Image
              src="/logo/pitfire-logo-white.svg"
              alt="Pitfire Pizza"
              width={120}
              height={40}
              className="h-9 w-auto mb-6"
            />
            <p className="font-cormorant text-base text-white/40 italic leading-relaxed max-w-xs">
              Crafted to inspire with simple food. 72 hours of artisan dedication in every bite.
            </p>
            <div className="mt-6">
              <span className="font-josefin text-[8px] tracking-[0.4em] uppercase text-primary">
                Since 1984
              </span>
            </div>
          </motion.div>

          {/* Link cols */}
          {footerLinks.map((col, ci) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: (ci + 1) * 0.08 }}
            >
              <h4 className="font-josefin text-[8px] tracking-[0.4em] uppercase text-white/30 mb-5">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleClick(link.href) }}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-josefin text-[10px] tracking-[0.1em] text-white/40 hover:text-white transition-colors duration-300 hover-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── Large wordmark ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="mb-10 overflow-hidden"
        >
          <div
            className="font-cormorant font-light text-white/[0.03] leading-none select-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', letterSpacing: '-0.02em' }}
          >
            PITFIRE PIZZA
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5"
        >
          <p className="font-josefin text-[8px] tracking-[0.3em] uppercase text-white/20">
            © {new Date().getFullYear()} Pitfire Pizza Bakers. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-josefin text-[8px] tracking-[0.3em] uppercase text-white/20">
              Crafted to Inspire
            </span>
            <span className="block w-4 h-px bg-primary/40" />
            <span className="font-josefin text-[8px] tracking-[0.3em] uppercase text-white/20">
              Dubai, UAE
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
