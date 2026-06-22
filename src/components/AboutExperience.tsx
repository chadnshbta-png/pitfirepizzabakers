'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/motion'
import SectionAmbient from './SectionAmbient'

gsap.registerPlugin(ScrollTrigger)

type Chapter = {
  year: string
  kicker: string
  title: string
  body: string
  image: string
}

const CHAPTERS: Chapter[] = [
  {
    year: '1958',
    kicker: 'The Origin',
    title: 'Two Brothers, One Oven',
    body: 'It began in May 1958, when Dan and Frank Carney opened a 550-square-foot restaurant in Wichita, Kansas. They made every pizza by hand — Frank rolling the dough, Dan filling the crust with sauce — while a captivated crowd watched the dough fly overhead.',
    image: '/images/our_story_1.png',
  },
  {
    year: '1959',
    kicker: 'The Craft',
    title: 'A Place for Great Ideas',
    body: 'Pizza Hut was always entrepreneurial and fast-thinking — a place where everyone shared the learning. As Frank Carney put it, the brand’s greatest strength was “an awful lot of people who came up with great ideas.” By 1963 there were forty-two restaurants.',
    image: '/images/our_story_2.jpg',
  },
  {
    year: '1980',
    kicker: 'The Quality',
    title: 'The Birth of Pan Pizza',
    body: 'In 1980 we introduced Pan Pizza across the network — a thicker crust baked in deep pans that quickly became iconic. The recipe evolved, but the philosophy never did: use real ingredients, and make every pie worth the wait.',
    image: '/images/our_story_3.jpg',
  },
  {
    year: 'Today',
    kicker: 'The Promise',
    title: 'More Than Just the Pizza',
    body: 'The philosophy was, and still is, “take care of the customer.” Generosity, hard work, friendship, innovation and fun — that experience lives in every box we hand over. It was, and always will be, more than just the pizza.',
    image: '/images/ourstory.webp',
  },
]

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export default function AboutExperience() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const ticksRef = useRef<HTMLDivElement>(null)

  // ── Desktop: pinned cinematic sequence — chapters cross-dissolve through Z ──
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const mq = window.matchMedia('(min-width: 768px)')
    if (!mq.matches) return
    // Reduced motion: skip the pinned scrub. Hide the intro overlay (so it can't
    // sit over the chapters) and reveal a single readable chapter at rest.
    if (prefersReducedMotion()) {
      const introEl = root.querySelector('[data-intro]') as HTMLElement | null
      if (introEl) gsap.set(introEl, { autoAlpha: 0 })
      const chaptersR = gsap.utils.toArray<HTMLElement>('[data-chapter]', root)
      chaptersR.forEach((c, i) => gsap.set(c, { autoAlpha: i === 0 ? 1 : 0 }))
      return
    }

    const ctx = gsap.context(() => {
      const stage = root.querySelector('[data-stage]') as HTMLElement
      const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]', root)
      const n = chapters.length
      const parts = chapters.map((c) => ({
        root: c,
        img: c.querySelector('[data-c-img]') as HTMLElement,
        year: c.querySelector('[data-c-year]') as HTMLElement,
        text: c.querySelector('[data-c-text]') as HTMLElement,
      }))
      // cache hot-loop lookups once (no querySelector inside the scrub handler)
      const ticks = ticksRef.current
        ? (Array.from(ticksRef.current.children) as HTMLElement[]).map((tk) => ({
            fill: tk.querySelector('[data-tick-fill]') as HTMLElement,
            label: tk.querySelector('[data-tick-label]') as HTMLElement,
          }))
        : []
      const chromeEls = Array.from(root.querySelectorAll<HTMLElement>('[data-chrome]'))

      // intro-sequence layers
      const intro = root.querySelector('[data-intro]') as HTMLElement | null
      const introEls = {
        eyebrow: root.querySelector('[data-intro-eyebrow]') as HTMLElement | null,
        l1: root.querySelector('[data-intro-l1]') as HTMLElement | null,
        l2: root.querySelector('[data-intro-l2]') as HTMLElement | null,
        copy: root.querySelector('[data-intro-copy]') as HTMLElement | null,
      }

      // smoothstep — eased 0→1 ramp between two thresholds
      const smooth = (x: number, a: number, b: number) => {
        const t = clamp((x - a) / (b - a), 0, 1)
        return t * t * (3 - 2 * t)
      }

      // The pinned scroll is split into an INTRO act and a CHAPTERS act. The
      // intro reveals (eyebrow → title lines → copy), holds, then the whole
      // group recedes into depth as the chapters cross-fade in — a documentary
      // chapter-card handoff. INTRO is the fraction of total scroll it owns.
      const chapScroll = (n - 1) * 88
      const INTRO = 0.26
      const total = Math.round(chapScroll / (1 - INTRO))

      const apply = (p: number) => {
        // ── INTRO ACT ──────────────────────────────────────────────────
        const ip = clamp(p / INTRO, 0, 1)
        const recede = smooth(ip, 0.62, 1)              // recedes over the tail
        if (intro) gsap.set(intro, { z: -recede * 380, scale: 1 - recede * 0.18, yPercent: -recede * 7, autoAlpha: 1 - recede, force3D: true })
        if (introEls.eyebrow) gsap.set(introEls.eyebrow, { autoAlpha: smooth(ip, 0, 0.07), y: (1 - smooth(ip, 0, 0.07)) * 18, force3D: true })
        if (introEls.l1) gsap.set(introEls.l1, { autoAlpha: smooth(ip, 0.05, 0.22), yPercent: (1 - smooth(ip, 0.05, 0.22)) * 105, force3D: true })
        if (introEls.l2) gsap.set(introEls.l2, { autoAlpha: smooth(ip, 0.12, 0.30), yPercent: (1 - smooth(ip, 0.12, 0.30)) * 105, force3D: true })
        if (introEls.copy) gsap.set(introEls.copy, { autoAlpha: smooth(ip, 0.24, 0.44), y: (1 - smooth(ip, 0.24, 0.44)) * 22, force3D: true })

        // ── CHAPTERS ACT ───────────────────────────────────────────────
        const cp = clamp((p - INTRO) / (1 - INTRO), 0, 1)
        const chGate = smooth(p, INTRO * 0.72, INTRO) // chapters fade in as intro leaves
        const pos = cp * (n - 1)
        for (let i = 0; i < n; i++) {
          const d = i - pos
          const ad = clamp(Math.abs(d), 0, 1.25)
          const part = parts[i]
          gsap.set(part.root, {
            autoAlpha: clamp(1 - ad * 1.05, 0, 1) * chGate,
            zIndex: 10 - Math.round(ad * 10),
            force3D: true,
          })
          gsap.set(part.img, {
            yPercent: d * -16,
            z: -ad * 380,
            scale: 1 - ad * 0.16,
            rotateY: d * 7,
            force3D: true,
          })
          gsap.set(part.year, { yPercent: d * 46, xPercent: d * 8, force3D: true })
          gsap.set(part.text, { y: d * 80, force3D: true })
        }
        const active = Math.round(pos)
        ticks.forEach((tk, i) => {
          const on = i === active
          if (tk.fill) gsap.set(tk.fill, { scaleX: i <= pos ? 1 : clamp(pos - i + 1, 0, 1) })
          if (tk.label) gsap.set(tk.label, { color: on ? '#FF4C00' : 'rgba(38,38,38,0.4)', fontWeight: on ? 600 : 400 })
        })
        // chrome (ticks + progress) belongs to the chapters act only
        for (const el of chromeEls) gsap.set(el, { autoAlpha: chGate })
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${cp})`
      }

      gsap.to({}, {
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => '+=' + total + '%',
          pin: stage,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          onRefresh: (self) => apply(self.progress),
          onUpdate: (self) => apply(self.progress),
        },
      })

      apply(0)
    }, root)

    return () => ctx.revert()
  }, [])

  // ── Mobile: clean editorial stack with simple reveals ──
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const mq = window.matchMedia('(min-width: 768px)')
    if (mq.matches || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-m-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 40,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="story" className="relative bg-background">
      {/* ── DESKTOP — pinned cinematic sequence ── */}
      <div data-stage className="hidden md:flex relative isolate h-screen w-full overflow-hidden bg-background items-center"
        style={{ perspective: '1600px' }}>
        <SectionAmbient variant="story" />
        {/* ambient warmth */}
        <div className="absolute -left-[10%] top-[12%] w-[46vw] h-[46vw] max-w-[640px] max-h-[640px] rounded-full bg-primary/[0.06] blur-[150px] pointer-events-none" />
        <div className="absolute -right-[12%] bottom-[8%] w-[42vw] h-[42vw] max-w-[560px] max-h-[560px] rounded-full bg-secondary/[0.07] blur-[160px] pointer-events-none" />

        {/* ── INTRO SEQUENCE — a documentary chapter card that reveals, holds,
            then recedes into depth before the story chapters take over. Its own
            layer (z-40), so it never collides with the chapter content. ── */}
        <div data-intro className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6 pointer-events-none will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
          <span data-intro-eyebrow className="block font-josefin text-[11px] tracking-[0.6em] uppercase text-primary mb-7 will-change-transform">
            Our Story
          </span>
          <h2 className="font-cormorant font-semibold text-ink leading-[0.92] tracking-tight overflow-hidden" style={{ fontSize: 'clamp(2.6rem,7vw,6rem)' }}>
            <span className="block overflow-hidden">
              <span data-intro-l1 className="block will-change-transform">Sixty-Five Years</span>
            </span>
            <span className="block overflow-hidden">
              <span data-intro-l2 className="block italic font-light text-primary will-change-transform">in the Making</span>
            </span>
          </h2>
          <p data-intro-copy className="italic text-ink/55 mt-8 max-w-xl leading-relaxed will-change-transform" style={{ fontSize: 'clamp(1.05rem,1.5vw,1.3rem)' }}>
            From a single oven in Wichita to tables around the world — sixty-five years of one promise: take care of the customer.
          </p>
        </div>

        {/* chapter layers — stacked, cross-dissolved by scroll.
            Editorial magazine spread: text owns the LEFT column, imagery owns
            the RIGHT column, with a clear empty gutter between them. The giant
            year numeral lives entirely inside the image column as a faint
            typographic backdrop — it never crosses into the reading column. */}
        {CHAPTERS.map((c) => (
          <div data-chapter key={c.year} className="absolute inset-0 flex items-center will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            <div className="relative w-full max-w-screen-2xl mx-auto px-12 lg:px-20 grid grid-cols-12 items-center gap-x-10 lg:gap-x-20">
              {/* text — dedicated left column (cols 1–5) */}
              <div data-c-text className="col-start-1 col-span-12 md:col-span-5 relative z-20 will-change-transform">
                <div className="flex items-center gap-3 mb-6">
                  <span className="block w-10 h-px bg-primary" />
                  <span className="font-josefin text-[11px] tracking-[0.45em] uppercase text-primary">{c.kicker}</span>
                </div>
                <h3 className="font-cormorant font-semibold text-ink leading-[1.04] mb-7 tracking-tight" style={{ fontSize: 'clamp(2.1rem,3.6vw,3.5rem)' }}>
                  {c.title}
                </h3>
                <p className="text-ink/60 leading-[1.9] max-w-md" style={{ fontSize: 'clamp(1rem,1.15vw,1.16rem)' }}>
                  {c.body}
                </p>
                <span className="mt-8 hidden md:inline-flex items-center gap-3 font-josefin text-[10px] tracking-[0.4em] uppercase text-ink/35">
                  <span className="block w-6 h-px bg-ink/25" />
                  Est. {c.year}
                </span>
              </div>

              {/* spacer gutter (col 6) is intentionally empty for breathing room */}

              {/* imagery — dedicated right column (cols 7–12) */}
              <div className="col-start-1 md:col-start-7 col-span-12 md:col-span-6 relative z-10 mt-10 md:mt-0" style={{ perspective: '1400px' }}>
                {/* giant year numeral — backdrop confined to the image column */}
                <div data-c-year className="pointer-events-none absolute -top-[12vh] right-[-2vw] z-0 will-change-transform">
                  <span className="font-cormorant font-bold leading-none select-none tracking-tighter"
                    style={{ fontSize: 'clamp(8rem,14vw,17rem)', color: 'rgba(38,38,38,0.045)' }}>
                    {c.year}
                  </span>
                </div>

                <div data-c-img className="relative z-10 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
                  {/* offset matte — a quiet gallery frame behind the plate */}
                  <div className="absolute -inset-3 rounded-[18px] border border-ink/10 pointer-events-none" />
                  <div className="relative rounded-[14px] overflow-hidden card-surface"
                    style={{ aspectRatio: '5 / 6', boxShadow: '0 50px 90px rgba(38,38,38,0.18)' }}>
                    <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover animate-breathe" />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(38,38,38,0.28), transparent 50%)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* timeline ticks */}
        <div ref={ticksRef} data-chrome className="absolute bottom-[7vh] left-10 lg:left-16 right-10 lg:right-16 z-30 flex gap-3">
          {CHAPTERS.map((c) => (
            <div key={c.year} className="flex-1">
              <div className="relative h-px bg-ink/12 overflow-hidden">
                <div data-tick-fill className="absolute inset-0 bg-primary origin-left" style={{ transform: 'scaleX(0)' }} />
              </div>
              <span data-tick-label className="block mt-3 font-josefin text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(38,38,38,0.4)' }}>
                {c.year}
              </span>
            </div>
          ))}
        </div>

        {/* global scrub progress */}
        <div data-chrome className="absolute bottom-0 left-0 right-0 h-px bg-ink/10 z-30">
          <div ref={progressRef} className="h-full bg-primary origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>

      {/* ── MOBILE — editorial stack ── */}
      <div className="md:hidden px-6 pt-[16vh] pb-[12vh]">
        <div data-m-reveal className="mb-14">
          <span className="block font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">Our Story</span>
          <h2 className="font-cormorant font-semibold text-ink leading-[0.98] mt-3 tracking-tight" style={{ fontSize: 'clamp(2.4rem,11vw,3.2rem)' }}>
            Sixty-Five Years <em className="italic font-light text-primary">in the Making</em>
          </h2>
        </div>
        <div className="flex flex-col gap-[12vh]">
          {CHAPTERS.map((c) => (
            <div key={c.year} data-m-reveal>
              <div className="relative mb-6">
                <span className="absolute -top-10 -left-1 font-cormorant font-bold leading-none select-none pointer-events-none tracking-tighter"
                  style={{ fontSize: 'clamp(5rem,22vw,8rem)', color: 'rgba(38,38,38,0.06)' }}>
                  {c.year}
                </span>
                <div className="relative rounded-[12px] overflow-hidden card-surface" style={{ aspectRatio: '4 / 5' }}>
                  <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="block w-7 h-px bg-primary" />
                <span className="font-josefin text-[10px] tracking-[0.4em] uppercase text-primary">{c.kicker} · {c.year}</span>
              </div>
              <h3 className="font-cormorant font-semibold text-ink leading-[1.05] mb-4 tracking-tight" style={{ fontSize: 'clamp(2rem,8vw,2.6rem)' }}>
                {c.title}
              </h3>
              <p className="text-ink/60 leading-[1.8]" style={{ fontSize: '1.05rem' }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
