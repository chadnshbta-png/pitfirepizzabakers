'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { menuItems, type MenuCategory } from '@/data/menuItems'

gsap.registerPlugin(ScrollTrigger)

type Scene = { key: Exclude<MenuCategory, 'All'>; tagline: string; accent: string }
const SCENES: Scene[] = [
  { key: 'Pizza',    tagline: 'Hand-stretched · fire-baked', accent: '#C8102E' },
  { key: 'Melts',    tagline: 'Folded · loaded · molten',    accent: '#E2A93B' },
  { key: 'Pasta',    tagline: 'Baked · saucy · comforting',  accent: '#C8102E' },
  { key: 'Wings',    tagline: 'Glazed · fire-kissed',        accent: '#E23744' },
  { key: 'Sides',    tagline: 'The supporting cast',         accent: '#E2A93B' },
  { key: 'Desserts', tagline: 'The sweet finale',            accent: '#C8102E' },
]

const ease = [0.16, 1, 0.3, 1] as const

function itemsFor(key: Scene['key']) {
  return menuItems.filter((m) => m.category === key)
}

export default function MenuExperience() {
  const desktopRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Desktop only — vertical scroll drives the horizontal track.
  useEffect(() => {
    const wrap = desktopRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    const mq = window.matchMedia('(min-width: 768px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!mq.matches || reduce) return

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
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
          // refresh AFTER the Hero's upstream pin so our start/end are measured
          // against the final document height (prevents overlap with the Hero)
          refreshPriority: -1,
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <section id="menu" className="relative bg-black">
      {/* clean top edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-30" />

      {/* ── DESKTOP — horizontal pinned track ── */}
      <div ref={desktopRef} className="hidden md:block relative h-screen overflow-hidden bg-black">
        {/* static overlay header */}
        <div className="absolute top-[12vh] left-10 lg:left-16 z-30 pointer-events-none">
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">The Menu</span>
          <h2 className="font-cormorant font-light text-white leading-[0.95] mt-2" style={{ fontSize: 'clamp(2rem,3.4vw,3.4rem)' }}>
            Explore Every <em className="italic text-primary">Craving</em>
          </h2>
        </div>

        {/* translating track */}
        <div ref={trackRef} className="flex h-screen will-change-transform">
          {SCENES.map((scene, idx) => {
            const items = itemsFor(scene.key)
            const hero = items[0]
            const list = items.slice(0, 5)
            return (
              <div key={scene.key} className="relative w-screen h-screen shrink-0 overflow-hidden">
                {/* watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-cormorant font-light uppercase leading-none select-none whitespace-nowrap"
                    style={{ fontSize: 'clamp(8rem,24vw,22rem)', color: 'rgba(255,255,255,0.035)' }}>
                    {scene.key}
                  </span>
                </div>
                <div className="absolute pointer-events-none rounded-full"
                  style={{ width: '52vw', height: '52vw', right: '-8vw', top: '14vh', background: `radial-gradient(circle, ${scene.accent}22 0%, transparent 60%)`, filter: 'blur(30px)' }} />

                <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-12 lg:px-20 grid grid-cols-2 items-center gap-10">
                  {/* text + list */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-josefin text-[10px] tracking-[0.4em] uppercase text-white/40">
                        {String(idx + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
                      </span>
                      <span className="block w-8 h-px" style={{ background: scene.accent }} />
                      <span className="font-josefin text-[10px] tracking-[0.4em] uppercase" style={{ color: scene.accent }}>
                        {items.length} items
                      </span>
                    </div>
                    <h3 className="font-cormorant font-light text-white leading-[0.92] mb-3" style={{ fontSize: 'clamp(3rem,7vw,6.5rem)' }}>
                      {scene.key}
                    </h3>
                    <p className="font-cormorant italic text-white/45 mb-8" style={{ fontSize: 'clamp(1rem,1.5vw,1.3rem)' }}>
                      {scene.tagline}
                    </p>
                    <ul className="space-y-3 max-w-sm">
                      {list.map((it) => (
                        <li key={it.id} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 group">
                          <span className="font-cormorant text-white/85 group-hover:text-white transition-colors" style={{ fontSize: 'clamp(1rem,1.4vw,1.25rem)' }}>
                            {it.name}
                          </span>
                          {it.tag && (
                            <span className="font-josefin text-[8px] tracking-[0.25em] uppercase whitespace-nowrap" style={{ color: scene.accent }}>
                              {it.tag}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* hero product */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute rounded-full"
                      style={{ width: 'clamp(260px,32vw,460px)', height: 'clamp(260px,32vw,460px)', background: `radial-gradient(circle, ${scene.accent}33 0%, transparent 62%)` }} />
                    <img src={hero.image} alt={hero.name} className="relative z-10 w-[34vw] max-w-[460px] product-shadow" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-30">
          <div ref={progressRef} className="h-full bg-primary origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>

      {/* ── MOBILE — clean vertical stack ── */}
      <div className="md:hidden px-6 py-[12vh]">
        <div className="text-center mb-14">
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">The Menu</span>
          <h2 className="font-cormorant font-light text-white leading-[0.98] mt-3" style={{ fontSize: 'clamp(2.4rem,11vw,3.4rem)' }}>
            Explore Every <em className="italic text-primary">Craving</em>
          </h2>
        </div>

        <div className="flex flex-col gap-14">
          {SCENES.map((scene, idx) => {
            const items = itemsFor(scene.key)
            const hero = items[0]
            const list = items.slice(0, 4)
            return (
              <motion.div
                key={scene.key}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.7, ease }}
              >
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute rounded-full" style={{ width: '64vw', height: '64vw', background: `radial-gradient(circle, ${scene.accent}2e 0%, transparent 62%)` }} />
                  <img src={hero.image} alt={hero.name} className="relative z-10 w-[62vw] max-w-[300px] product-shadow" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-josefin text-[9px] tracking-[0.4em] uppercase text-white/40">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="block w-6 h-px" style={{ background: scene.accent }} />
                  <span className="font-josefin text-[9px] tracking-[0.4em] uppercase" style={{ color: scene.accent }}>{items.length} items</span>
                </div>
                <h3 className="font-cormorant font-light text-white leading-[0.95]" style={{ fontSize: 'clamp(2.4rem,12vw,3.2rem)' }}>{scene.key}</h3>
                <p className="font-cormorant italic text-white/45 mt-1 mb-5" style={{ fontSize: '1.05rem' }}>{scene.tagline}</p>
                <ul className="space-y-2.5">
                  {list.map((it) => (
                    <li key={it.id} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5">
                      <span className="font-cormorant text-white/85" style={{ fontSize: '1.1rem' }}>{it.name}</span>
                      {it.tag && <span className="font-josefin text-[8px] tracking-[0.25em] uppercase" style={{ color: scene.accent }}>{it.tag}</span>}
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
