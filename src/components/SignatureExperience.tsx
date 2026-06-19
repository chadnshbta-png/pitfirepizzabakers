'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Pepperoni, Basil, Tomato, Olive, Cheese } from './ingredients'
import { signaturePizza } from '@/data/menuItems'

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

      // 1 — zoom in + title
      tl.fromTo(pizza, { scale: 0.82, rotate: -6 }, { scale: 1.06, rotate: 0, duration: 1 }, 0)
        .fromTo(plate, { scale: 0.7, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 1 }, 0)
        .to(title, { opacity: 1, y: 0, duration: 0.6 }, 0.15)

      // 2 — separate the toppings (build "layer by layer")
      tl.to(pizza, { scale: 1.2, rotate: 9, duration: 1 }, 1)
        .to(plate, { rotate: 30, duration: 1.4 }, 1)
      chips.forEach((c, i) => {
        tl.to(c, {
          x: parseFloat(c.dataset.sepx!) * travel,
          y: parseFloat(c.dataset.sepy!) * travel,
          rotate: gsap.utils.random(-60, 60),
          scale: 1.3,
          duration: 0.9,
        }, 1 + i * 0.05)
      })
      tl.to(title, { opacity: 0, y: -30, duration: 0.5 }, 1.1)
        .to(sub, { opacity: 1, y: 0, duration: 0.6 }, 1.4)

      // 3 — reassemble
      tl.to(pizza, { scale: 1.04, rotate: -4, duration: 1 }, 2.4)
      chips.forEach((c, i) => {
        tl.to(c, { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.9 }, 2.4 + i * 0.04)
      })
      tl.to(sub, { opacity: 0, y: -30, duration: 0.5 }, 2.5)

      // 4 — settle + CTA
      tl.to(pizza, { scale: 1, rotate: 0, duration: 0.8 }, 3.3)
        .to(cta, { opacity: 1, y: 0, duration: 0.6 }, 3.4)
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="signature" className="relative bg-black">
      <div data-stage className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        {/* deep red vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(200,16,46,0.14), rgba(0,0,0,0) 55%)' }} />

        {/* rotating plate halo */}
        <div data-plate className="absolute rounded-full will-change-transform"
          style={{
            width: 'min(86vw, 720px)', height: 'min(86vw, 720px)',
            background: 'conic-gradient(from 0deg, rgba(200,16,46,0.0), rgba(200,16,46,0.16), rgba(200,16,46,0.0), rgba(226,55,68,0.14), rgba(200,16,46,0.0))',
            maskImage: 'radial-gradient(circle, transparent 38%, black 40%, black 70%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 38%, black 40%, black 70%, transparent 72%)',
          }} />

        {/* pizza + separable toppings */}
        <div className="relative flex items-center justify-center" style={{ width: 'min(82vw, 560px)', height: 'min(82vw, 560px)' }}>
          <img
            data-pizza
            src={signaturePizza}
            alt="Pizza Hut Chicken Supreme"
            className="relative z-10 w-full product-shadow will-change-transform pointer-events-none"
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
          <h2 className="font-cormorant font-light text-white leading-[0.95]" style={{ fontSize: 'clamp(2.6rem,8vw,6.5rem)' }}>
            Signature <em className="italic text-primary">Recipes</em>
          </h2>
        </div>

        <div data-sub className="absolute left-0 right-0 bottom-[14vh] text-center px-6 z-30 pointer-events-none">
          <p className="font-cormorant text-white/70 mx-auto max-w-xl" style={{ fontSize: 'clamp(1.3rem,3vw,2.2rem)', fontWeight: 300 }}>
            Built layer by layer with<br /><em className="italic text-primary">premium ingredients.</em>
          </p>
        </div>

        <div data-cta className="absolute left-0 right-0 bottom-[12vh] text-center px-6 z-30">
          <a
            href="#menu"
            onClick={(e) => { e.preventDefault(); document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-4 px-10 py-4 border border-white/20 font-josefin text-[10px] tracking-[0.4em] uppercase text-white/80 hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-500 pointer-events-auto"
          >
            Explore the Menu
            <span className="w-5 h-px bg-white/40" />
          </a>
        </div>
      </div>
    </section>
  )
}
