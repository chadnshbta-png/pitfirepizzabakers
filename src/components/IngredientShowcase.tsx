'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Tomato, Cheese, Basil, Pepperoni } from './ingredients'
import { prefersReducedMotion, useSceneParallax } from '@/lib/motion'
import SectionAmbient from './SectionAmbient'

gsap.registerPlugin(ScrollTrigger)

type Ing = {
  Comp: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  name: string
  note: string
  tint: string
  rgb: string
}
const INGS: Ing[] = [
  { Comp: Tomato,    name: 'Vine Tomatoes', note: 'Sun-ripened and crushed for our signature sauce.', tint: 'rgba(200,16,46,0.22)',  rgb: '200,16,46' },
  { Comp: Cheese,    name: 'Mozzarella',    note: 'Stretched fresh, melted to a golden, endless pull.', tint: 'rgba(242,193,78,0.20)', rgb: '242,193,78' },
  { Comp: Basil,     name: 'Garden Basil',  note: 'Hand-picked leaves, torn over the heat of the oven.', tint: 'rgba(63,156,63,0.20)',  rgb: '63,156,63' },
  { Comp: Pepperoni, name: 'Pepperoni',     note: 'Cured slow, sliced thin, curled crisp in the bake.',  tint: 'rgba(176,17,36,0.22)',  rgb: '176,17,36' },
]

/* One suspended ingredient — a body floating in its own pocket of space.
   The wrapper is driven by the scroll-camera (depth + turn); an inner layer
   orbits continuously so it never sits still even when scrolling stops. */
function Station({ ing, index }: { ing: Ing; index: number }) {
  const left = index % 2 === 0
  return (
    <div
      className={`relative min-h-[78vh] flex items-center ${left ? 'justify-start' : 'justify-end'} `}
      style={{ perspective: '1400px' }}
    >
      {/* giant ghosted index — deep background plate, lags the scroll.
          Centering lives on this flex wrapper (no transform) so the inner
          span is free for the scroll-camera's transform channel. */}
      <div className={`pointer-events-none absolute inset-y-0 flex items-center ${left ? 'right-[6%]' : 'left-[6%]'}`}>
        <span
          data-par data-par-y="-40"
          className="font-cormorant font-bold leading-none select-none tracking-tighter"
          style={{ fontSize: 'clamp(10rem,30vw,28rem)', color: 'rgba(38,38,38,0.05)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* the floating ingredient cluster */}
      <div
        className="relative flex items-center gap-8 md:gap-16 w-full max-w-2xl"
        style={{ transformStyle: 'preserve-3d', flexDirection: left ? 'row' : 'row-reverse' }}
      >
        {/* visual body */}
        <div
          className="relative shrink-0"
          style={{ width: 'clamp(150px,30vw,300px)', height: 'clamp(150px,30vw,300px)', transformStyle: 'preserve-3d' }}
        >
          {/* deep glow — slowest, furthest back */}
          <div
            data-par data-z="120"
            className="absolute inset-[-40%] rounded-full blur-[60px]"
            style={{ background: `radial-gradient(circle, ${ing.tint} 0%, transparent 65%)` }}
          />
          {/* rim ring — mid depth, turns with the camera */}
          <div
            data-par data-rot="14" data-z="60"
            className="absolute inset-[-8%] rounded-full"
            style={{ border: `1px solid rgba(${ing.rgb},0.18)`, boxShadow: `inset 0 0 60px rgba(${ing.rgb},0.10)` }}
          />
          {/* the ingredient — foreground body, pushes toward camera at centre,
              with its own ceaseless orbital drift */}
          <div
            data-par data-par-y="55" data-z="220" data-rot="-10" data-scl="0.12"
            className="absolute inset-0 flex items-center justify-center will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="animate-orbit" style={{ animationDelay: `${index * 1.4}s`, animationDuration: `${15 + index * 1.5}s` }}>
              <ing.Comp size={300} style={{ width: 'clamp(150px,30vw,300px)', height: 'auto' }} />
            </div>
          </div>
        </div>

        {/* floating label — parallaxes at its own rate, separate plane */}
        <div data-par data-par-y="22" className="relative min-w-0 will-change-transform">
          <span className="block font-josefin text-[10px] tracking-[0.5em] uppercase mb-3" style={{ color: `rgb(${ing.rgb})` }}>
            {String(index + 1).padStart(2, '0')} — The Source
          </span>
          <h3 className="font-cormorant font-semibold text-ink leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2rem,4.2vw,3.6rem)' }}>
            {ing.name}
          </h3>
          <div className="my-5 h-px w-12" style={{ background: `rgb(${ing.rgb})`, opacity: 0.7 }} />
          <p className="italic text-ink/55 leading-relaxed max-w-xs" style={{ fontSize: 'clamp(1rem,1.5vw,1.25rem)' }}>
            {ing.note}
          </p>
        </div>
      </div>

      {/* foreground fragments — small bodies that streak past nearest the camera */}
      <div
        data-par data-par-y="120" data-px={left ? '40' : '-40'}
        className="pointer-events-none absolute will-change-transform"
        style={{ top: '18%', [left ? 'right' : 'left']: '14%' } as React.CSSProperties}
      >
        <div className="animate-orbit opacity-60" style={{ animationDelay: `${index}s` }}>
          <ing.Comp size={44} />
        </div>
      </div>
      <div
        data-par data-par-y="160" data-px={left ? '-30' : '30'}
        className="pointer-events-none absolute will-change-transform"
        style={{ bottom: '20%', [left ? 'left' : 'right']: '20%' } as React.CSSProperties}
      >
        <div className="animate-orbit opacity-40" style={{ animationDelay: `${index * 0.7 + 2}s`, animationDuration: '13s' }}>
          <ing.Comp size={30} />
        </div>
      </div>
    </div>
  )
}

export default function IngredientShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // continuous scroll-camera depth across every tagged layer
  useSceneParallax(sectionRef)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      // header words rise out of depth — a single, restrained entrance so the
      // continuous parallax (not a reveal) carries the section
      gsap.from('[data-head]', {
        opacity: 0, yPercent: 40, filter: 'blur(14px)',
        duration: 1.2, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: root, start: 'top 72%', once: true },
      })

      // each ingredient body fades up from far Z exactly once as it first
      // arrives — afterward the camera engine owns its motion
      gsap.utils.toArray<HTMLElement>('[data-station]').forEach((st) => {
        gsap.from(st, {
          opacity: 0, scale: 0.86,
          duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: st, start: 'top 82%', once: true },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="ingredients" className="relative isolate bg-background overflow-clip py-[12vh]">
      <SectionAmbient variant="ingredients" />
      {/* soft seam into the previous scene — no hard divider */}
      <div className="seam-top" />

      {/* deep ambient field — two large pools on the slowest plane. The
          scroll-camera owns their transform (idle life comes from Atmosphere). */}
      <div data-par data-par-y="-70" className="absolute left-[-15%] top-[10%] w-[60vw] h-[60vw] max-w-[820px] max-h-[820px] rounded-full bg-primary/[0.05] blur-[170px] pointer-events-none" />
      <div data-par data-par-y="-50" className="absolute right-[-18%] top-[55%] w-[55vw] h-[55vw] max-w-[720px] max-h-[720px] rounded-full bg-ember/[0.045] blur-[180px] pointer-events-none" />

      {/* vertical spine — a thread running through the whole journey */}
      <div className="absolute left-1/2 top-[16vh] bottom-[12vh] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ink/10 to-transparent pointer-events-none" />

      <div className="relative max-w-screen-xl mx-auto px-6 md:px-10">
        {/* intro — the only true reveal in the section */}
        <div className="text-center mb-[8vh] md:mb-[6vh]">
          <span data-head className="block font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">The Source</span>
          <h2 data-head className="font-cormorant font-semibold text-ink leading-[1] mt-4 tracking-tight" style={{ fontSize: 'clamp(2.2rem,6vw,5rem)' }}>
            Suspended in <em className="italic font-light text-primary">Flavor</em>
          </h2>
          <p data-head className="italic text-ink/50 mt-5 mx-auto max-w-xl" style={{ fontSize: 'clamp(1rem,1.6vw,1.25rem)' }}>
            Four things we refuse to compromise on — floating, layer by layer.
          </p>
        </div>

        {/* suspended stations */}
        <div>
          {INGS.map((ing, i) => (
            <div data-station key={ing.name}>
              <Station ing={ing} index={i} />
            </div>
          ))}
        </div>
      </div>

      <div className="seam-bottom" />
    </section>
  )
}
