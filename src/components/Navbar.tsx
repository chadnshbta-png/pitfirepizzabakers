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
            maxWidth: scrolled ? 940 : 1320,
            paddingInline: scrolled ? '1.1rem' : '1.6rem',
            paddingBlock: scrolled ? '0.55rem' : '0.9rem',
            borderRadius: 999,
            background: scrolled ? 'rgba(12,8,8,0.6)' : 'rgba(0,0,0,0)',
            backdropFilter: scrolled ? 'blur(24px) saturate(140%)' : 'blur(0px)',
            WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(140%)' : 'blur(0px)',
            borderColor: scrolled ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0)',
            boxShadow: scrolled ? '0 18px 55px rgba(0,0,0,0.55)' : '0 0 0 rgba(0,0,0,0)',
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
              <span className="block w-px h-7 bg-white/12" />
              <span className="font-josefin text-[8px] leading-[1.5] tracking-[0.42em] uppercase text-white/40">
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
                      isActive ? 'text-white' : 'text-white/50 hover:text-white'
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
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 h-px w-0 bg-white/40 transition-all duration-400 group-hover:w-5" />
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Order CTA */}
          <div className="hidden md:block shrink-0">
            <a
              href="#menu"
              onClick={(e) => { e.preventDefault(); handleLinkClick('#menu') }}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/20 px-5 py-2.5 font-josefin text-[10px] tracking-[0.3em] uppercase text-white transition-colors duration-500 hover:border-primary"
            >
              <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="relative z-10">Order Now</span>
              <span className="relative z-10 w-4 h-px bg-white/50 group-hover:w-6 group-hover:bg-white transition-all duration-500" />
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center gap-1.5 shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block h-px w-6 bg-white origin-left transition-all" />
            <motion.span animate={menuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }} className="block h-px w-6 bg-white" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block h-px w-6 bg-white origin-left transition-all" />
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
            className="fixed inset-0 z-40 bg-black/96 backdrop-blur-2xl flex flex-col items-center justify-center"
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
                    className={`font-cormorant text-4xl font-light transition-colors ${
                      active === link.href ? 'text-primary' : 'text-white/80 hover:text-white'
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
              className="mt-12 inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-3 font-josefin text-[11px] tracking-[0.3em] uppercase text-white"
            >
              Order Now
              <span className="w-5 h-px bg-primary" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
