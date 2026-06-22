'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Pepperoni, Basil, Tomato, Olive, Cheese } from './ingredients'
import { signaturePizza } from '@/data/menuItems'
import SectionAmbient from './SectionAmbient'

gsap.registerPlugin(ScrollTrigger)

/* toppings placed on the pizza surface, each with a radial "separation" vector */
type Chip = {
  Comp: React.ComponentType<{ size?: number }>
  left: number; top: number; size: number; sepX: number; sepY: number
}
const CHIPS: Chip[] = [
  { Comp: Pepperoni, left: 38, top: 36, size: 58, sepX: -260, sepY: -200 },
  { Comp: Basil,     left: 62, top: 32, size: 50, sepX:  240, sepY: -240 },
  { Comp: Tomato,    left: 66, top: 58, size: 52, sepX:  320, sepY:  120 },
  { Comp: Olive,     left: 44, top: 62, size: 40, sepX: -120, sepY:  300 },
  { Comp: Cheese,    left: 30, top: 54, size: 56, sepX: -340, sepY:  140 },
  { Comp: Pepperoni, left: 56, top: 46, size: 44, sepX:  140, sepY:   60 },
  { Comp: Basil,     left: 48, top: 30, size: 38, sepX:    0, sepY: -320 },
]

export default function SignatureExperience() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const pizza = root.querySelector('[data-pizza]') as HTMLElement
      const plate = root.querySelector('[data-plate]') as HTMLElement
      const glow = root.querySelector('[data-glow]') as HTMLElement
      const chips = gsap.utils.toArray<HTMLElement>('[data-chip]', root)
      const title = root.querySelector('[data-title]') as HTMLElement
      const sub = root.querySelector('[data-sub]') as HTMLElement
      const cta = root.querySelector('[data-cta]') as HTMLElement

      if (reduce) {
        gsap.set([title, sub, cta], { opacity: 1, y: 0 })
        return
      }

      gsap.set([sub, cta], { opacity: 0, y: 30 })
      gsap.set(title, { opacity: 0, y: 40 })

      // scale the topping-separation travel to the viewport so nothing flies
      // off-bounds on small screens
      const travel = Math.min(1, window.innerWidth / 1200)

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=300%',
          pin: '[data-stage]',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
        },
      })

      // 1 — camera pushes in hard from the deep, title rises
      tl.fromTo(pizza, { scale: 0.58, rotate: -10, z: -340, rotateX: 14 }, { scale: 1.06, rotate: 0, z: 0, rotateX: 0, duration: 1 }, 0)
        .fromTo(plate, { scale: 0.6, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 1 }, 0)
        .fromTo(glow, { opacity: 0.3, scale: 0.8 }, { opacity: 0.8, scale: 1, duration: 1 }, 0)
        .to(title, { opacity: 1, y: 0, duration: 0.6 }, 0.15)

      // 2 — separate the toppings in 3D (build "layer by layer", lifting toward
      //     camera) while the camera tilts down over the deconstruction
      tl.to(pizza, { scale: 1.28, rotate: 9, rotateX: -10, duration: 1 }, 1)
        .to(plate, { rotate: 30, duration: 1.4 }, 1)
        .to(glow, { opacity: 1, scale: 1.2, duration: 1 }, 1)
      chips.forEach((c, i) => {
        tl.to(c, {
          x: parseFloat(c.dataset.sepx!) * travel,
          y: parseFloat(c.dataset.sepy!) * travel,
          z: 120 + i * 26,
          rotateX: gsap.utils.random(-40, 40),
          rotateZ: gsap.utils.random(-60, 60),
          scale: 1.35,
          duration: 0.9,
        }, 1 + i * 0.05)
      })
      tl.to(title, { opacity: 0, y: -30, duration: 0.5 }, 1.1)
        .to(sub, { opacity: 1, y: 0, duration: 0.6 }, 1.4)

      // 3 — reassemble
      tl.to(pizza, { scale: 1.04, rotate: -4, rotateX: 0, duration: 1 }, 2.4)
        .to(glow, { opacity: 0.75, scale: 1, duration: 1 }, 2.4)
      chips.forEach((c, i) => {
        tl.to(c, { x: 0, y: 0, z: 0, rotateX: 0, rotateZ: 0, scale: 1, duration: 0.9 }, 2.4 + i * 0.04)
      })
      tl.to(sub, { opacity: 0, y: -30, duration: 0.5 }, 2.5)

      // 4 — settle + CTA
      tl.to(pizza, { scale: 1, rotate: 0, duration: 0.8 }, 3.3)
        .to(cta, { opacity: 1, y: 0, duration: 0.6 }, 3.4)
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="signature" className="relative bg-background">
      <div data-stage className="relative isolate h-screen w-full overflow-hidden flex items-center justify-center bg-background">
        <SectionAmbient variant="signature" />
        {/* soft warm vignette grounding the product on the light stage */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,76,0,0.08), rgba(249,249,249,0) 58%)' }} />

        {/* scroll-reactive atmospheric glow */}
        <div data-glow className="absolute rounded-full pointer-events-none will-change-transform"
          style={{
            width: 'min(92vw, 760px)', height: 'min(92vw, 760px)',
            background: 'radial-gradient(circle, rgba(255,76,0,0.20) 0%, rgba(229,101,101,0.10) 40%, rgba(249,249,249,0) 66%)',
          }} />

        {/* slow turning rim-light — a halo of warmth orbiting behind the product */}
        <div className="absolute rounded-full pointer-events-none animate-halo"
          style={{
            width: 'min(96vw, 820px)', height: 'min(96vw, 820px)',
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,76,0,0.18) 40deg, transparent 90deg, transparent 200deg, rgba(229,101,101,0.14) 250deg, transparent 300deg)',
            filter: 'blur(40px)',
          }} />

        {/* moving studio light — a soft warm band pans across the stage,
            reading as a light being walked over a premium product shot */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 mix-blend-multiply">
          <div className="absolute top-0 left-0 h-full w-[34%] animate-light-sweep"
            style={{ background: 'linear-gradient(105deg, transparent 0%, rgba(255,76,0,0.05) 45%, rgba(255,76,0,0.09) 50%, rgba(255,76,0,0.05) 55%, transparent 100%)', filter: 'blur(16px)' }} />
        </div>

        {/* rotating plate halo */}
        <div data-plate className="absolute rounded-full will-change-transform"
          style={{
            width: 'min(86vw, 720px)', height: 'min(86vw, 720px)',
            background: 'conic-gradient(from 0deg, rgba(255,76,0,0.0), rgba(255,76,0,0.18), rgba(255,76,0,0.0), rgba(229,101,101,0.16), rgba(255,76,0,0.0))',
            maskImage: 'radial-gradient(circle, transparent 38%, black 40%, black 70%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 38%, black 40%, black 70%, transparent 72%)',
          }} />

        {/* pizza + separable toppings */}
        <div className="relative flex items-center justify-center" style={{ width: 'min(82vw, 560px)', height: 'min(82vw, 560px)', perspective: '1100px', transformStyle: 'preserve-3d' }}>
          <img
            data-pizza
            src={signaturePizza}
            alt="Pizza Hut signature pan pizza, built layer by layer"
            width={1480}
            height={690}
            decoding="async"
            draggable={false}
            className="relative z-10 w-full h-auto object-contain product-shadow will-change-transform pointer-events-none"
            style={{ imageRendering: 'auto', backfaceVisibility: 'hidden' }}
          />
          {CHIPS.map((c, i) => (
            <div
              key={i}
              data-chip
              data-sepx={c.sepX}
              data-sepy={c.sepY}
              className="absolute z-20 will-change-transform pointer-events-none"
              style={{ left: `${c.left}%`, top: `${c.top}%`, transform: 'translate(-50%,-50%)' }}
            >
              <c.Comp size={c.size} />
            </div>
          ))}
        </div>

        {/* copy overlays */}
        <div className="absolute top-[12vh] left-0 right-0 text-center px-6 z-30">
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">Layer by Layer</span>
        </div>

        <div data-title className="absolute left-0 right-0 bottom-[12vh] text-center px-6 z-30 pointer-events-none">
          <h2 className="font-cormorant font-semibold text-ink leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.6rem,8vw,6.5rem)' }}>
            Signature <em className="italic font-light text-primary">Recipes</em>
          </h2>
        </div>

        <div data-sub className="absolute left-0 right-0 bottom-[14vh] text-center px-6 z-30 pointer-events-none">
          <p className="text-ink/65 mx-auto max-w-xl" style={{ fontSize: 'clamp(1.3rem,3vw,2.2rem)', fontWeight: 300 }}>
            Built layer by layer with <em className="italic text-primary">premium ingredients.</em>
          </p>
        </div>

        <div data-cta className="absolute left-0 right-0 bottom-[12vh] text-center px-6 z-30">
          <a
            href="#menu"
            onClick={(e) => { e.preventDefault(); document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="btn-depth btn-primary inline-flex items-center gap-4 px-10 py-4 font-josefin text-[10px] tracking-[0.4em] uppercase pointer-events-auto"
          >
            Explore the Menu
            <span className="w-5 h-px bg-white/60" />
          </a>
        </div>
      </div>
    </section>
  )
}
