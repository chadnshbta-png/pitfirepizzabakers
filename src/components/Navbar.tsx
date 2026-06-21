'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#story' },
  { label: 'Ingredients', href: '#ingredients' },
  { label: 'Menu', href: '#menu' },
  { label: 'Signature', href: '#signature' },
]

const ease = [0.16, 1, 0.3, 1] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy — highlight the section crossing the viewport centre
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1))
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive('#' + e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const handleLinkClick = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  // The Hero is a dark, full-screen pinned scene that stays in view for a long
  // scroll distance, so raw scrollY can't drive the theme. While the Hero owns
  // the viewport keep the bar transparent with light text; only once a light
  // content scene takes over do we show the light glass pill with ink text.
  const overHero = active === '#home'
  const showChrome = scrolled && !overHero
  const lightText = overHero

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, top: scrolled ? 12 : 26 }}
        transition={{ opacity: { duration: 0.9, delay: 0.3 }, y: { duration: 0.9, delay: 0.3 }, top: { duration: 0.6, ease } }}
        className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <nav
          className="pointer-events-auto w-full flex items-center justify-between gap-4 border"
          style={{
            maxWidth: showChrome ? 940 : 1320,
            paddingInline: showChrome ? '1.1rem' : '1.6rem',
            paddingBlock: showChrome ? '0.55rem' : '0.9rem',
            borderRadius: 999,
            background: showChrome ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0)',
            backdropFilter: showChrome ? 'blur(24px) saturate(140%)' : 'blur(0px)',
            WebkitBackdropFilter: showChrome ? 'blur(24px) saturate(140%)' : 'blur(0px)',
            borderColor: showChrome ? 'rgba(38,38,38,0.08)' : 'rgba(255,255,255,0)',
            boxShadow: showChrome ? '0 18px 50px rgba(38,38,38,0.12)' : '0 0 0 rgba(0,0,0,0)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Logo lockup */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#home') }}
            className="group relative z-10 flex items-center gap-3.5 shrink-0"
          >
            <Image
              src="/logo/pizzahut-desktop-logo.svg"
              alt="Pizza Hut"
              width={150}
              height={37}
              className="h-7 md:h-9 w-auto transition-transform duration-500 group-hover:scale-[1.05]"
              priority
            />
            <span className="hidden lg:flex items-center gap-3.5">
              <span className={`block w-px h-7 transition-colors duration-500 ${lightText ? 'bg-white/25' : 'bg-ink/15'}`} />
              <span className={`font-josefin text-[8px] leading-[1.5] tracking-[0.42em] uppercase transition-colors duration-500 ${lightText ? 'text-white/55' : 'text-ink/45'}`}>
                Crafted<br />Fresh
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {links.map((link) => {
              const isActive = active === link.href
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
                    className={`group relative flex items-center gap-2 px-3.5 lg:px-4 py-2 font-josefin text-[10px] tracking-[0.26em] uppercase transition-colors duration-300 ${
                      isActive
                        ? (lightText ? 'text-white' : 'text-ink')
                        : (lightText ? 'text-white/60 hover:text-white' : 'text-ink/55 hover:text-ink')
                    }`}
                  >
                    {/* active dot */}
                    <span
                      className={`block rounded-full bg-primary transition-all duration-400 ${
                        isActive ? 'w-1.5 h-1.5 opacity-100' : 'w-0 h-1.5 opacity-0'
                      }`}
                    />
                    <span className={`transition-all duration-400 ${isActive ? '' : '-ml-3.5'}`}>{link.label}</span>
                    {/* hover underline */}
                    <span className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 h-px w-0 transition-all duration-400 group-hover:w-5 ${lightText ? 'bg-white/50' : 'bg-ink/40'}`} />
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Order CTA — solid brand orange (Branding.json buttonPrimary) */}
          <div className="hidden md:block shrink-0">
            <a
              href="#menu"
              onClick={(e) => { e.preventDefault(); handleLinkClick('#menu') }}
              className="btn-depth btn-primary group relative inline-flex items-center gap-2.5 px-5 py-2.5 font-josefin text-[10px] tracking-[0.3em] uppercase"
            >
              <span className="relative z-10">Order Now</span>
              <span className="relative z-10 w-4 h-px bg-white/60 group-hover:w-6 group-hover:bg-white transition-all duration-500" />
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center gap-1.5 shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className={`block h-px w-6 origin-left transition-all ${lightText && !menuOpen ? 'bg-white' : 'bg-ink'}`} />
            <motion.span animate={menuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }} className={`block h-px w-6 transition-all ${lightText && !menuOpen ? 'bg-white' : 'bg-ink'}`} />
            <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className={`block h-px w-6 origin-left transition-all ${lightText && !menuOpen ? 'bg-white' : 'bg-ink'}`} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-[#F9F9F9]/97 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <ul className="flex flex-col items-center gap-7">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.07, duration: 0.45, ease }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
                    className={`font-cormorant text-4xl font-medium tracking-tight transition-colors ${
                      active === link.href ? 'text-primary' : 'text-ink/80 hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href="#menu"
              onClick={(e) => { e.preventDefault(); handleLinkClick('#menu') }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="btn-depth btn-primary mt-12 inline-flex items-center gap-3 px-8 py-3.5 font-josefin text-[11px] tracking-[0.3em] uppercase"
            >
              Order Now
              <span className="w-5 h-px bg-white/70" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
