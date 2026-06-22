'use client'

import { useRef, useEffect, useState } from 'react'
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

/* ──────────────────────────────────────────────────────────────────────────
   One coverflow card. Self-contained on an opaque gallery surface (so rotated
   neighbours never ghost through one another), with a hover-swappable hero and
   a product filmstrip that renders every image in the category.
   The card root (and its [data-mwm]/[data-mpr]/[data-mtext] children) are owned
   by GSAP's depth engine — React only ever rewrites the inner content, never
   the transform, so hover re-renders and scroll transforms never fight.
   ────────────────────────────────────────────────────────────────────────── */
function CategoryCard({ scene, idx }: { scene: Scene; idx: number }) {
  const items = itemsFor(scene.key)
  const [activeId, setActiveId] = useState(items[0]?.id)
  const active = items.find((i) => i.id === activeId) ?? items[0]

  return (
    <div
      data-panel
      className="relative shrink-0 overflow-hidden rounded-[34px] card-surface flex flex-col"
      style={{ width: 'var(--cardW)', height: 'min(80vh, 760px)' }}
    >
      {/* watermark category name — clipped inside the card */}
      <div data-mwm className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform">
        <span className="font-cormorant font-bold uppercase leading-none select-none whitespace-nowrap tracking-tighter"
          style={{ fontSize: 'clamp(7rem,18vw,17rem)', color: 'rgba(38,38,38,0.04)' }}>
          {scene.key}
        </span>
      </div>
      {/* category-accent atmosphere */}
      <div className="absolute pointer-events-none rounded-full"
        style={{ width: '46vw', height: '46vw', right: '-10vw', top: '6vh', background: `radial-gradient(circle, ${scene.accent}24 0%, transparent 64%)`, filter: 'blur(34px)' }} />

      {/* ── top: text + hero ── */}
      <div className="relative z-10 grid grid-cols-2 items-center gap-6 lg:gap-10 px-10 lg:px-16 pt-12 flex-1 min-h-0">
        {/* text + active product detail */}
        <div data-mtext className="min-w-0 will-change-transform">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-josefin text-[10px] tracking-[0.4em] uppercase text-ink/40">
              {String(idx + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
            </span>
            <span className="block w-8 h-px" style={{ background: scene.accent }} />
            <span className="font-josefin text-[10px] tracking-[0.4em] uppercase" style={{ color: scene.accent }}>
              {scene.label}
            </span>
          </div>
          <h3 className="font-cormorant font-semibold text-ink leading-[0.9] mb-3 tracking-tight" style={{ fontSize: 'clamp(2.6rem,5vw,5rem)' }}>
            {scene.key}
          </h3>
          <p className="text-ink/45 mb-6" style={{ fontSize: 'clamp(0.95rem,1.1vw,1.1rem)' }}>
            {scene.tagline} · <span className="text-ink/30">{items.length} items</span>
          </p>

          {/* active item — crossfades as you browse the filmstrip */}
          <div className="min-h-[7.5rem]">
            <motion.div key={active?.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
              <div className="flex items-center gap-3 mb-3">
                <h4 className="font-cormorant font-semibold text-ink leading-tight tracking-tight" style={{ fontSize: 'clamp(1.4rem,2vw,2rem)' }}>
                  {active?.name}
                </h4>
                {active?.tag && (
                  <span className="font-josefin text-[8px] tracking-[0.25em] uppercase whitespace-nowrap px-2 py-1 rounded-full"
                    style={{ color: scene.accent, background: `${scene.accent}16` }}>
                    {active.tag}
                  </span>
                )}
              </div>
              <p className="text-ink/55 leading-relaxed max-w-sm" style={{ fontSize: 'clamp(0.95rem,1.1vw,1.1rem)' }}>
                {active?.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* hero product — floating on a lit pedestal, swaps on hover */}
        <div data-mpr className="relative flex items-center justify-center h-full will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute rounded-full"
            style={{ width: 'clamp(240px,26vw,420px)', height: 'clamp(240px,26vw,420px)', background: `radial-gradient(circle, ${scene.accent}33 0%, transparent 64%)` }} />
          <div className="relative z-10 animate-float-slow">
            <motion.img
              key={active?.id}
              src={active?.image}
              alt={active?.name}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              draggable={false}
              className="relative w-[24vw] max-w-[360px] object-contain product-shadow"
              style={{ maxHeight: '40vh' }}
            />
            <img src={active?.image} alt="" aria-hidden
              className="absolute left-0 top-full w-[24vw] max-w-[360px] -mt-2 pointer-events-none object-contain"
              style={{ maxHeight: '40vh', transform: 'scaleY(-1)', opacity: 0.14, WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 45%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 45%)' }} />
          </div>
          <div className="contact-shadow absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[18vw] max-w-[260px] h-[34px] pointer-events-none" />
        </div>
      </div>

      {/* ── bottom: product filmstrip — every item in the category ── */}
      <div className="relative z-10 px-10 lg:px-16 pb-8 pt-2">
        <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {items.map((it) => {
            const on = it.id === active?.id
            return (
              <button
                key={it.id}
                type="button"
                onMouseEnter={() => setActiveId(it.id)}
                onFocus={() => setActiveId(it.id)}
                onClick={() => setActiveId(it.id)}
                aria-label={it.name}
                className="group/thumb relative shrink-0 rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  width: 'clamp(58px,4.6vw,78px)',
                  height: 'clamp(58px,4.6vw,78px)',
                  background: on ? `${scene.accent}12` : 'rgba(38,38,38,0.035)',
                  boxShadow: on ? `0 0 0 1.5px ${scene.accent}, 0 10px 22px ${scene.accent}26` : 'inset 0 0 0 1px rgba(38,38,38,0.06)',
                  transform: on ? 'translateY(-4px)' : 'none',
                }}
              >
                <img src={it.image} alt="" aria-hidden draggable={false}
                  className="absolute inset-0 w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover/thumb:scale-110" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function MenuExperience() {
  const desktopRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  // Desktop only — vertical scroll drives a depth-based coverflow gallery.
  useEffect(() => {
    const wrap = desktopRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    const mq = window.matchMedia('(min-width: 768px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!mq.matches) return
    // Reduced motion: skip the pinned scrub entirely. Hide the intro overlay so
    // it never covers the gallery, and leave the cards at their natural layout.
    if (reduce) {
      const introEl = wrap.querySelector('[data-menu-intro]') as HTMLElement | null
      if (introEl) gsap.set(introEl, { autoAlpha: 0 })
      return
    }

    const clamp = gsap.utils.clamp

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const introPx = () => window.innerHeight * 1.1   // scroll length owned by the intro
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', track)
      const n = panels.length
      const inner = panels.map((p) => ({
        wm: p.querySelector('[data-mwm]') as HTMLElement | null,
        pr: p.querySelector('[data-mpr]') as HTMLElement | null,
        tx: p.querySelector('[data-mtext]') as HTMLElement | null,
      }))
      const dots = dotsRef.current ? (Array.from(dotsRef.current.children) as HTMLElement[]) : []
      // cache the inner bar elements once — no querySelector inside the scrub loop
      const dotBars = dots.map((d) => d.querySelector('[data-dot-bar]') as HTMLElement | null)

      // intro-sequence layers — a chapter card that reveals, holds, then zooms
      // out into depth before the gallery takes over (mirrors Our Story)
      const intro = wrap.querySelector('[data-menu-intro]') as HTMLElement | null
      const mEyebrow = wrap.querySelector('[data-menu-eyebrow]') as HTMLElement | null
      const mTitle = wrap.querySelector('[data-menu-title]') as HTMLElement | null
      const mCopy = wrap.querySelector('[data-menu-copy]') as HTMLElement | null
      const chromeEls = Array.from(wrap.querySelectorAll<HTMLElement>('[data-menu-chrome]'))

      const smooth = (x: number, a: number, b: number) => {
        const t = clamp(0, 1, (x - a) / (b - a))
        return t * t * (3 - 2 * t)
      }

      // layout cached on refresh only — never read per frame (no thrash)
      let dist = 0
      let INTRO = 0.3
      const measure = () => { dist = distance(); const ix = introPx(); INTRO = ix / (ix + dist || 1) }

      // Coverflow depth: the card at the playhead is centred, full-size, fully
      // opaque and on top; neighbours tilt in Y, recede in Z, shrink, fade and
      // tuck slightly inward — a luxurious depth carousel rather than a slider.
      // `gate` (0..1) fades the whole gallery in as the intro recedes.
      const applyDepth = (p: number, gate = 1) => {
        const pos = p * (n - 1)
        for (let i = 0; i < n; i++) {
          const t = i - pos                       // signed distance from centre
          const at = Math.min(Math.abs(t), 2)
          gsap.set(panels[i], {
            rotationY: clamp(-1, 1, t) * -26,
            scale: 1 - at * 0.13,
            z: -at * 260,
            xPercent: clamp(-1.6, 1.6, t) * -5,
            opacity: (1 - Math.min(at, 1) * 0.6) * gate,
            // keep cards below the overlay chrome (indicator at z-40);
            // centre card sits on top of its neighbours so nothing ghosts through
            zIndex: 20 - Math.round(at * 6),
            pointerEvents: gate > 0.9 && Math.abs(t) < 0.5 ? 'auto' : 'none',
            force3D: true,
          })
          if (inner[i].wm) gsap.set(inner[i].wm, { xPercent: t * 9, force3D: true })
          if (inner[i].pr) gsap.set(inner[i].pr, { xPercent: -t * 8, yPercent: at * 4, force3D: true })
          if (inner[i].tx) gsap.set(inner[i].tx, { x: t * 30, force3D: true })
        }
        const activeIdx = Math.round(clamp(0, n - 1, pos))
        dots.forEach((d, i) => {
          const on = i === activeIdx
          gsap.set(d, { color: on ? SCENES[i].accent : 'rgba(38,38,38,0.32)' })
          const bar = dotBars[i]
          if (bar) gsap.set(bar, { scaleX: on ? 1 : 0, backgroundColor: SCENES[i].accent })
        })
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
      }

      const apply = (p: number) => {
        // ── INTRO ACT — reveal (eyebrow → title → copy), hold, then zoom out ──
        const ip = clamp(0, 1, p / INTRO)
        const recede = smooth(ip, 0.6, 1)
        if (intro) gsap.set(intro, { autoAlpha: 1 - recede, scale: 1 - recede * 0.22, z: -recede * 460, force3D: true })
        if (mEyebrow) { const r = smooth(ip, 0, 0.08); gsap.set(mEyebrow, { autoAlpha: r, y: (1 - r) * 18, force3D: true }) }
        if (mTitle) { const r = smooth(ip, 0.06, 0.30); gsap.set(mTitle, { autoAlpha: r, yPercent: (1 - r) * 100, force3D: true }) }
        if (mCopy) { const r = smooth(ip, 0.24, 0.48); gsap.set(mCopy, { autoAlpha: r, y: (1 - r) * 22, force3D: true }) }

        // ── GALLERY ACT — drives the coverflow translate + depth ──
        const gp = clamp(0, 1, (p - INTRO) / (1 - INTRO))
        const gGate = smooth(p, INTRO * 0.7, INTRO)   // fades in as the intro leaves
        gsap.set(track, { x: -gp * dist, force3D: true })
        applyDepth(gp, gGate)
        for (const el of chromeEls) gsap.set(el, { autoAlpha: gGate })
      }

      gsap.to({}, {
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => '+=' + (introPx() + distance()),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          onRefresh: (self) => { measure(); apply(self.progress) },
          onUpdate: (self) => apply(self.progress),
        },
      })

      measure()
      apply(0)
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <section id="menu" className="relative bg-background">
      <div className="seam-top z-30" />

      {/* ── DESKTOP — depth coverflow gallery ── */}
      <div ref={desktopRef} className="hidden md:block relative isolate h-screen overflow-hidden bg-background" style={{ perspective: '2000px' }}>
        <SectionAmbient variant="menu" />

        {/* ── INTRO SEQUENCE — a chapter card that reveals, holds, then zooms
            out into depth before the gallery begins (mirrors Our Story). Its own
            layer (z-50), so menu content never appears abruptly behind it. ── */}
        <div data-menu-intro className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-6 pointer-events-none will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
          <span data-menu-eyebrow className="block font-josefin text-[11px] tracking-[0.6em] uppercase text-primary mb-7 will-change-transform">
            The Menu
          </span>
          <h2 className="font-cormorant font-semibold text-ink leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(3rem,9vw,8rem)' }}>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-menu-title className="block will-change-transform">
                The <em className="italic font-light text-primary">Collection</em>
              </span>
            </span>
          </h2>
          <p data-menu-copy className="italic text-ink/55 mt-8 max-w-xl leading-relaxed will-change-transform" style={{ fontSize: 'clamp(1.05rem,1.5vw,1.3rem)' }}>
            Every craving has its chapter — hand-stretched pizzas, molten melts, comforting pasta, fiery wings and the sweet finale.
          </p>
        </div>

        {/* translating coverflow track */}
        <div
          ref={trackRef}
          className="flex items-center h-screen will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            // a CSS var drives card width AND the edge padding that centres each card
            '--cardW': 'min(1100px, 84vw)',
            paddingInline: 'calc((100vw - var(--cardW)) / 2)',
            gap: 'clamp(2rem, 4vw, 5rem)',
          } as React.CSSProperties}
        >
          {SCENES.map((scene, idx) => (
            <CategoryCard key={scene.key} scene={scene} idx={idx} />
          ))}
        </div>

        {/* category indicator — the curated gallery index */}
        <div ref={dotsRef} data-menu-chrome className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 z-40 flex items-center gap-5 lg:gap-7 pointer-events-none">
          {SCENES.map((s) => (
            <div key={s.key} className="relative font-josefin text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(38,38,38,0.32)' }}>
              {s.key}
              <span data-dot-bar className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full origin-left" style={{ transform: 'scaleX(0)' }} />
            </div>
          ))}
        </div>

        {/* progress bar */}
        <div data-menu-chrome className="absolute bottom-0 left-0 right-0 h-px bg-ink/10 z-40">
          <div ref={progressRef} className="h-full bg-primary origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>

      {/* ── MOBILE — clean vertical product cards with a filmstrip ── */}
      <div className="md:hidden px-6 py-[12vh]">
        <div className="text-center mb-14">
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">The Menu</span>
          <h2 className="font-cormorant font-semibold text-ink leading-[0.98] mt-3 tracking-tight" style={{ fontSize: 'clamp(2.4rem,11vw,3.4rem)' }}>
            The <em className="italic font-light text-primary">Collection</em>
          </h2>
          <p className="italic text-ink/55 mt-4 mx-auto max-w-xs leading-relaxed" style={{ fontSize: '1.02rem' }}>
            Every craving has its chapter.
          </p>
        </div>

        <div className="flex flex-col gap-16" style={{ perspective: '1200px' }}>
          {SCENES.map((scene, idx) => {
            const items = itemsFor(scene.key)
            const hero = items[0]
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
                  <img src={hero.image} alt={hero.name} className="relative z-10 w-[62vw] max-w-[300px] object-contain product-shadow animate-float-slow" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-josefin text-[9px] tracking-[0.4em] uppercase text-ink/40">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="block w-6 h-px" style={{ background: scene.accent }} />
                  <span className="font-josefin text-[9px] tracking-[0.4em] uppercase" style={{ color: scene.accent }}>{scene.label}</span>
                </div>
                <h3 className="font-cormorant font-semibold text-ink leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.4rem,12vw,3.2rem)' }}>{scene.key}</h3>
                <p className="text-ink/50 mt-1 mb-5" style={{ fontSize: '1.05rem' }}>{scene.tagline} · {items.length} items</p>

                {/* horizontal product filmstrip — uses every image */}
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                  {items.map((it) => (
                    <div key={it.id} className="shrink-0 w-[88px]">
                      <div className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden" style={{ background: 'rgba(38,38,38,0.035)', boxShadow: 'inset 0 0 0 1px rgba(38,38,38,0.06)' }}>
                        <img src={it.image} alt={it.name} className="absolute inset-0 w-full h-full object-contain p-2" />
                      </div>
                      <p className="mt-2 text-ink/60 leading-tight" style={{ fontSize: '0.72rem' }}>{it.name}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
