'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion, useTilt, useSceneParallax } from '@/lib/motion'
import SectionAmbient from './SectionAmbient'

gsap.registerPlugin(ScrollTrigger)

type Card = { num: string; title: string; line: string; icon: React.JSX.Element; parY: number; offset: string }

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const CARDS: Card[] = [
  {
    num: '01',
    title: 'Fresh Daily',
    line: 'Dough proofed and stretched by hand every single morning.',
    parY: 78,
    offset: 'md:mt-0',
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" {...stroke}>
        <path d="M24 6c3 6-2 8-2 12a6 6 0 0012 0c0-2-1-4-2-5 4 2 8 7 8 14a16 16 0 01-32 0c0-9 8-13 16-21z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Fast Delivery',
    line: 'Hot, boxed and at your door before the cheese settles.',
    parY: 30,
    offset: 'md:mt-28',
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" {...stroke}>
        <circle cx="14" cy="34" r="5" />
        <circle cx="35" cy="34" r="5" />
        <path d="M19 34h11M6 16h9l5 13M30 20h7l5 8v6h-3" />
        <path d="M15 16l2 6" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Premium Ingredients',
    line: 'Real cheese, vine tomatoes and toppings worth the wait.',
    parY: 56,
    offset: 'md:mt-14',
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" {...stroke}>
        <path d="M24 8C16 8 8 14 8 22c0 10 10 18 16 18s16-8 16-18c0-8-8-14-16-14z" />
        <path d="M24 8c0 6 6 8 12 10M24 40c0-8-6-12-14-14" />
        <circle cx="20" cy="22" r="1.6" />
        <circle cx="29" cy="26" r="1.6" />
        <circle cx="25" cy="18" r="1.6" />
      </svg>
    ),
  },
]

function WhyCard({ card }: { card: Card }) {
  const tiltRef = useRef<HTMLDivElement>(null)
  useTilt(tiltRef, { max: 9, scale: 1.04, lift: 12, perspective: 1200 })

  return (
    // Three independent transform layers so nothing fights for a channel:
    //   outer  → continuous scroll-camera depth (useSceneParallax)
    //   middle → one-shot entrance (gsap.from on [data-card])
    //   inner  → cursor tilt (useTilt)
    <div
      data-par data-par-y={card.parY} data-z="70" data-rot="6"
      className={`relative ${card.offset} will-change-transform`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* oversized ghost numeral floating behind the card on a deeper plane */}
      <span
        data-par data-par-y="-46"
        className="pointer-events-none absolute -top-[12%] -left-[6%] font-cormorant font-bold leading-none select-none -z-10 tracking-tighter"
        style={{ fontSize: 'clamp(7rem,12vw,12rem)', color: 'rgba(38,38,38,0.05)' }}
      >
        {card.num}
      </span>

      <div data-card className="will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
        {/* the card body — owns its own cursor tilt (separate transform channels) */}
        <div
          ref={tiltRef}
          className="card-surface rounded-[14px] p-9 md:p-11 relative overflow-hidden group will-change-transform"
        >
          {/* top accent line grows on hover */}
          <span className="absolute top-0 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-700" />
          {/* corner number */}
          <span className="absolute top-6 right-7 font-cormorant font-bold text-ink/[0.08] leading-none tracking-tighter" style={{ fontSize: 'clamp(2.4rem,4vw,3.4rem)' }}>
            {card.num}
          </span>

          <div className="text-primary mb-8">{card.icon}</div>
          <h3 className="font-cormorant font-semibold text-ink mb-4 tracking-tight" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
            {card.title}
          </h3>
          <p className="text-ink/55 leading-[1.7]" style={{ fontSize: 'clamp(1rem,1.4vw,1.15rem)' }}>
            {card.line}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useSceneParallax(sectionRef)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const reduce = prefersReducedMotion()

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('[data-card], [data-why-eyebrow], [data-why-title]', { autoAlpha: 1, y: 0, x: 0, z: 0, rotateX: 0, rotateY: 0, scale: 1, yPercent: 0 })
        return
      }

      // One scrubbed timeline so the whole chapter is *driven by scroll progress*
      // as the section rises into view — heading and cards emerge from depth in a
      // cinematic stagger rather than firing once on a threshold.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 88%',
          end: 'top 30%',
          scrub: 1,
        },
      })

      // heading participates — rises out of depth with a slow scale (progressive
      // emphasis), then its continuous data-par drift keeps it part of the scene
      tl.fromTo('[data-why-eyebrow]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.5 }, 0)
        .fromTo('[data-why-title]', { autoAlpha: 0, yPercent: 70, scale: 0.88 }, { autoAlpha: 1, yPercent: 0, scale: 1, ease: 'power3.out', duration: 0.85 }, 0.04)

      // cards emerge from different depths and directions — alternating sweep
      // (not one block), each tied to its own slice of the scroll
      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card, i) => {
        const dir = i === 1 ? 0 : i === 0 ? -1 : 1
        tl.fromTo(card,
          { autoAlpha: 0, y: 110, x: dir * 64, z: -400, rotateX: 18, rotateY: dir * -12 },
          { autoAlpha: 1, y: 0, x: 0, z: 0, rotateX: 0, rotateY: 0, ease: 'power3.out', duration: 0.95 },
          0.22 + i * 0.16)
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate bg-background py-[18vh] overflow-clip">
      <SectionAmbient variant="why" />
      <div className="seam-top" />

      {/* ambient pools on the slowest plane — driven by the scroll-camera */}
      <div data-par data-par-y="-60" className="absolute left-[8%] top-[18%] w-[44vw] h-[44vw] max-w-[620px] max-h-[620px] bg-primary/[0.05] rounded-full blur-[170px] pointer-events-none" />
      <div data-par data-par-y="-44" className="absolute right-[6%] bottom-[10%] w-[40vw] h-[40vw] max-w-[560px] max-h-[560px] bg-ember/[0.04] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 relative">
        {/* header — outer plane carries continuous scroll-camera depth (data-par
            scale = biggest when centred → progressive emphasis); inner words
            carry the scroll-driven entrance. Separate transform channels. */}
        <div data-par data-par-y="26" data-scl="0.05" className="text-center mb-24 md:mb-32 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
          <span data-why-eyebrow className="block font-josefin text-[10px] tracking-[0.5em] uppercase text-primary will-change-transform">Why Pizza Hut</span>
          <h2 data-why-title className="font-cormorant font-semibold text-ink leading-[0.98] mt-4 tracking-tight will-change-transform" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)' }}>
            Made the <em className="italic font-light text-primary">Right</em> Way
          </h2>
        </div>

        {/* staggered Z-plane panels */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start" style={{ perspective: '1700px', transformStyle: 'preserve-3d' }}>
          {CARDS.map((c) => (
            <WhyCard key={c.num} card={c} />
          ))}
        </div>
      </div>

      <div className="seam-bottom" />
    </section>
  )
}
