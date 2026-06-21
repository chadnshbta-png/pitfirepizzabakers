'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { menuItems, type MenuCategory } from '@/data/menuItems'
import SectionAmbient from './SectionAmbient'

gsap.registerPlugin(ScrollTrigger)

type Scene = {
  key: Exclude<MenuCategory, 'All'>
  tagline: string
  label: string       // the category's own identity line
  accent: string      // per-category accent (kept within the warm brand family)
}
const SCENES: Scene[] = [
  { key: 'Pizza',    tagline: 'Hand-stretched · fire-baked', label: 'The Centerpiece', accent: '#FF4C00' },
  { key: 'Melts',    tagline: 'Folded · loaded · molten',    label: 'The Fold',        accent: '#E56565' },
  { key: 'Pasta',    tagline: 'Baked · saucy · comforting',  label: 'The Comfort',     accent: '#E2A93B' },
  { key: 'Wings',    tagline: 'Glazed · fire-kissed',        label: 'The Heat',        accent: '#FF6A33' },
  { key: 'Sides',    tagline: 'The supporting cast',         label: 'The Sidekicks',   accent: '#D98A3D' },
  { key: 'Desserts', tagline: 'The sweet finale',            label: 'The Finale',      accent: '#E07A8B' },
]

const ease = [0.16, 1, 0.3, 1] as const

function itemsFor(key: Scene['key']) {
  return menuItems.filter((m) => m.category === key)
}

export default function MenuExperience() {
  const desktopRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Desktop only — vertical scroll drives the horizontal catalog.
  useEffect(() => {
    const wrap = desktopRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    const mq = window.matchMedia('(min-width: 768px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!mq.matches || reduce) return

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', track)
      const n = panels.length
      const inner = panels.map((p) => ({
        wm: p.querySelector('[data-mwm]') as HTMLElement | null,
        pr: p.querySelector('[data-mpr]') as HTMLElement | null,
        tx: p.querySelector('[data-mtext]') as HTMLElement | null,
      }))

      // Camera-like depth: as each panel passes through viewport centre it
      // scales up, untilts, rises out of Z and brightens — its product turning
      // toward the lens. Off-centre panels recede into the page.
      const applyDepth = (p: number) => {
        for (let i = 0; i < n; i++) {
          const t = i - p * (n - 1)          // 0 = centred, ±1 = neighbour
          const at = Math.min(Math.abs(t), 1.4)
          gsap.set(panels[i], {
            rotationY: gsap.utils.clamp(-12, 12, -t * 12),
            scale: 1 - at * 0.12,
            z: -at * 300,
            opacity: 1 - at * 0.5,
            force3D: true,
          })
          if (inner[i].wm) gsap.set(inner[i].wm, { xPercent: t * 10, force3D: true })
          if (inner[i].pr) gsap.set(inner[i].pr, { xPercent: -t * 9, yPercent: at * 5, rotationY: -t * 10, force3D: true })
          if (inner[i].tx) gsap.set(inner[i].tx, { x: t * 48, force3D: true })
        }
      }

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          onRefresh: (self) => applyDepth(self.progress),
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
            applyDepth(self.progress)
          },
        },
      })

      applyDepth(0)
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <section id="menu" className="relative bg-background">
      <div className="seam-top z-30" />

      {/* ── DESKTOP — horizontal pinned product catalog ── */}
      <div ref={desktopRef} className="hidden md:block relative isolate h-screen overflow-hidden bg-background">
        <SectionAmbient variant="menu" />
        {/* static overlay header */}
        <div className="absolute top-[11vh] left-10 lg:left-16 z-30 pointer-events-none">
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">The Collection</span>
          <h2 className="font-cormorant font-semibold text-ink leading-[0.95] mt-2 tracking-tight" style={{ fontSize: 'clamp(2rem,3.4vw,3.4rem)' }}>
            Browse Every <em className="italic font-light text-primary">Craving</em>
          </h2>
        </div>

        {/* translating track */}
        <div
          ref={trackRef}
          className="flex h-screen will-change-transform"
          style={{ perspective: '1900px', transformStyle: 'preserve-3d' }}
        >
          {SCENES.map((scene, idx) => {
            const items = itemsFor(scene.key)
            const hero = items[0]
            const list = items.slice(0, 5)
            return (
              <div key={scene.key} data-panel className="relative w-screen h-screen shrink-0 overflow-hidden will-change-transform">
                {/* watermark category name */}
                <div data-mwm className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform">
                  <span className="font-cormorant font-bold uppercase leading-none select-none whitespace-nowrap tracking-tighter"
                    style={{ fontSize: 'clamp(8rem,24vw,22rem)', color: 'rgba(38,38,38,0.04)' }}>
                    {scene.key}
                  </span>
                </div>
                {/* category-accent atmosphere */}
                <div className="absolute pointer-events-none rounded-full"
                  style={{ width: '54vw', height: '54vw', right: '-6vw', top: '12vh', background: `radial-gradient(circle, ${scene.accent}26 0%, transparent 62%)`, filter: 'blur(30px)' }} />

                <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-12 lg:px-20 grid grid-cols-2 items-center gap-10">
                  {/* text + index */}
                  <div data-mtext>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-josefin text-[10px] tracking-[0.4em] uppercase text-ink/40">
                        {String(idx + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
                      </span>
                      <span className="block w-8 h-px" style={{ background: scene.accent }} />
                      <span className="font-josefin text-[10px] tracking-[0.4em] uppercase" style={{ color: scene.accent }}>
                        {scene.label}
                      </span>
                    </div>
                    <h3 className="font-cormorant font-semibold text-ink leading-[0.9] mb-3 tracking-tight" style={{ fontSize: 'clamp(3rem,7vw,6.5rem)' }}>
                      {scene.key}
                    </h3>
                    <p className="text-ink/50 mb-8" style={{ fontSize: 'clamp(1rem,1.4vw,1.25rem)' }}>
                      {scene.tagline} · <span className="text-ink/35">{items.length} items</span>
                    </p>
                    <ul className="space-y-3 max-w-sm">
                      {list.map((it) => (
                        <li key={it.id} className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3 group/item">
                          <span className="text-ink/80 group-hover/item:text-ink transition-colors" style={{ fontSize: 'clamp(1rem,1.4vw,1.2rem)' }}>
                            {it.name}
                          </span>
                          {it.tag && (
                            <span className="font-josefin text-[8px] tracking-[0.25em] uppercase whitespace-nowrap px-2 py-1 rounded-full"
                              style={{ color: scene.accent, background: `${scene.accent}14` }}>
                              {it.tag}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* hero product — floating on a lit pedestal */}
                  <div data-mpr className="relative flex items-center justify-center will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
                    {/* accent halo */}
                    <div className="absolute rounded-full"
                      style={{ width: 'clamp(280px,34vw,500px)', height: 'clamp(280px,34vw,500px)', background: `radial-gradient(circle, ${scene.accent}33 0%, transparent 64%)` }} />
                    {/* the product */}
                    <div className="relative z-10 animate-float-slow">
                      <img src={hero.image} alt={hero.name} className="relative w-[34vw] max-w-[480px] product-shadow" />
                      {/* reflection */}
                      <img src={hero.image} alt="" aria-hidden
                        className="absolute left-0 top-full w-[34vw] max-w-[480px] -mt-2 pointer-events-none"
                        style={{ transform: 'scaleY(-1)', opacity: 0.16, WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 45%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 45%)' }} />
                    </div>
                    {/* contact shadow */}
                    <div className="contact-shadow absolute left-1/2 -translate-x-1/2 bottom-[8%] w-[26vw] max-w-[360px] h-[42px] pointer-events-none" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-ink/10 z-30">
          <div ref={progressRef} className="h-full bg-primary origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>

      {/* ── MOBILE — clean vertical product cards ── */}
      <div className="md:hidden px-6 py-[12vh]">
        <div className="text-center mb-14">
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">The Collection</span>
          <h2 className="font-cormorant font-semibold text-ink leading-[0.98] mt-3 tracking-tight" style={{ fontSize: 'clamp(2.4rem,11vw,3.4rem)' }}>
            Browse Every <em className="italic font-light text-primary">Craving</em>
          </h2>
        </div>

        <div className="flex flex-col gap-16" style={{ perspective: '1200px' }}>
          {SCENES.map((scene, idx) => {
            const items = itemsFor(scene.key)
            const hero = items[0]
            const list = items.slice(0, 4)
            return (
              <motion.div
                key={scene.key}
                initial={{ opacity: 0, y: 44, scale: 0.94, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.8, ease }}
              >
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute rounded-full" style={{ width: '66vw', height: '66vw', background: `radial-gradient(circle, ${scene.accent}33 0%, transparent 62%)` }} />
                  <img src={hero.image} alt={hero.name} className="relative z-10 w-[62vw] max-w-[300px] product-shadow animate-float-slow" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-josefin text-[9px] tracking-[0.4em] uppercase text-ink/40">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="block w-6 h-px" style={{ background: scene.accent }} />
                  <span className="font-josefin text-[9px] tracking-[0.4em] uppercase" style={{ color: scene.accent }}>{scene.label}</span>
                </div>
                <h3 className="font-cormorant font-semibold text-ink leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.4rem,12vw,3.2rem)' }}>{scene.key}</h3>
                <p className="text-ink/50 mt-1 mb-5" style={{ fontSize: '1.05rem' }}>{scene.tagline}</p>
                <ul className="space-y-2.5">
                  {list.map((it) => (
                    <li key={it.id} className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-2.5">
                      <span className="text-ink/80" style={{ fontSize: '1.1rem' }}>{it.name}</span>
                      {it.tag && <span className="font-josefin text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-full" style={{ color: scene.accent, background: `${scene.accent}14` }}>{it.tag}</span>}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
