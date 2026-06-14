'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { menuItems, type MenuItem } from '@/data/menuItems'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/* ── Category chapters (real data categories, in display order) ─────── */
const CATS: { key: MenuItem['category']; tagline: string }[] = [
  { key: 'Pizza', tagline: '72-hour fermented · fire-kissed' },
  { key: 'Pasta', tagline: 'Hand-finished · sauced to order' },
  { key: 'Starters', tagline: 'The opening act' },
  { key: 'Desserts', tagline: 'House-made · every day' },
]

/* per-column parallax speed (px) + staggered start offset (px) by column count */
const COL_CONFIG: Record<number, { speed: number; offset: number }[]> = {
  1: [{ speed: -20, offset: 0 }],
  2: [{ speed: -48, offset: 0 }, { speed: 34, offset: 56 }],
  3: [{ speed: -62, offset: 0 }, { speed: 44, offset: 72 }, { speed: -26, offset: 32 }],
}

const GLOW_KEYFRAMES = `
  @keyframes menu-glow-a { 0%,100%{transform:translate(0,0) scale(1);opacity:.06} 50%{transform:translate(40px,-30px) scale(1.12);opacity:.10} }
  @keyframes menu-glow-b { 0%,100%{transform:translate(0,0) scale(1);opacity:.04} 50%{transform:translate(-32px,26px) scale(1.08);opacity:.07} }
`

const BASE_SHADOW = '0 24px 55px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.05)'

/* ── Floating food card with 3D hover ───────────────────────────────── */
function MenuCard({ item }: { item: MenuItem }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el || window.innerWidth < 768) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, {
      rotateY: x * 10, rotateX: -y * 8, scale: 1.05, z: 40,
      duration: 0.4, ease: 'power2.out', transformPerspective: 900, overwrite: 'auto',
    })
    el.style.zIndex = '5'
    el.style.boxShadow = [
      `${-x * 32}px ${-y * 32 + 22}px 70px rgba(0,0,0,.7)`,
      '0 0 55px rgba(209,38,38,.28)',
      '0 0 0 1px rgba(209,38,38,.32)',
    ].join(',')
  }

  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, z: 0, duration: 0.55, ease: 'power2.out', overwrite: 'auto' })
    el.style.boxShadow = BASE_SHADOW
    el.style.zIndex = '1'
  }

  return (
    <div data-reveal style={{ opacity: 1 }}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          position: 'relative', borderRadius: '16px', overflow: 'hidden',
          background: 'rgba(14,7,7,.6)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,.06)', boxShadow: BASE_SHADOW,
          cursor: 'pointer', willChange: 'transform', transformStyle: 'preserve-3d',
        }}
      >
        {/* Image (natural ratio → gallery masonry) */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={item.image} alt={item.name}
            loading="lazy"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent 45%)', pointerEvents: 'none' }} />
          {item.tag && (
            <span className="font-josefin" style={{
              position: 'absolute', top: 12, left: 12,
              fontSize: '.5rem', letterSpacing: '.34em', textTransform: 'uppercase',
              color: '#fff', background: 'rgba(209,38,38,.92)', padding: '5px 9px', borderRadius: 4,
            }}>{item.tag}</span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '16px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
            <h3 className="font-cormorant" style={{ fontSize: '1.3rem', fontWeight: 300, color: 'rgba(255,255,255,.94)', lineHeight: 1.15 }}>
              {item.name}
            </h3>
            <span className="font-josefin" style={{ flexShrink: 0, fontSize: '.6rem', letterSpacing: '.22em', color: '#D12626', whiteSpace: 'nowrap' }}>
              AED&nbsp;—
            </span>
          </div>
          <p className="font-cormorant" style={{ fontSize: '.95rem', fontStyle: 'italic', color: 'rgba(255,255,255,.42)', lineHeight: 1.55, marginTop: 6 }}>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   Menu — a 3D cinematic food gallery
   ════════════════════════════════════════════════════════════════════ */
export default function Menu() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(3)

  /* responsive column count */
  useEffect(() => {
    const calc = () => setCols(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  /* parallax + reveal engine (live position, no pin/sticky) */
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    const mAmp = mobile ? 0.5 : 1

    type T = { el: HTMLElement; kind: 'pfx' | 'rev'; speed: number; rot: number; scale: number; fade: boolean; rect?: DOMRect }
    const targets: T[] = [
      ...gsap.utils.toArray<HTMLElement>('[data-pfx]', root).map(el => ({
        el, kind: 'pfx' as const,
        speed: parseFloat(el.dataset.speed || '0'),
        rot: parseFloat(el.dataset.rot || '0'),
        scale: parseFloat(el.dataset.scale || '0'),
        fade: el.dataset.fade === '1',
      })),
      ...gsap.utils.toArray<HTMLElement>('[data-reveal]', root).map(el => ({
        el, kind: 'rev' as const, speed: 0, rot: 0, scale: 0, fade: true,
      })),
    ]

    if (reduce) {
      targets.forEach(t => { if (t.fade) t.el.style.opacity = '1' })
      return
    }

    const update = () => {
      const h = window.innerHeight
      const vc = h / 2
      // PASS 1 — read all rects (avoid layout thrash)
      for (const t of targets) t.rect = t.el.getBoundingClientRect()
      // PASS 2 — write transforms / opacity
      for (const t of targets) {
        const r = t.rect!
        if (r.bottom < -400 || r.top > h + 400) continue
        const q = clamp((r.top + r.height / 2 - vc) / h, -1.2, 1.2)
        if (t.kind === 'pfx') {
          gsap.set(t.el, {
            y: q * t.speed * mAmp,
            scale: t.scale ? 1 - clamp(Math.abs(q), 0, 0.6) * t.scale : 1,
            force3D: true,
          })
          if (t.fade) t.el.style.opacity = String(clamp((0.8 - q) / 0.4, 0, 1))
        } else {
          t.el.style.opacity = String(clamp((0.62 - q) / 0.26, 0, 1))
        }
      }
    }

    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [cols])

  return (
    <section
      id="menu"
      ref={sectionRef}
      style={{ background: '#000', position: 'relative', overflowX: 'clip' }}
    >
      <style>{GLOW_KEYFRAMES}</style>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '8%', right: '-8%', width: '50%', height: '44%', background: 'radial-gradient(ellipse,#D12626 0%,transparent 68%)', filter: 'blur(150px)', animation: 'menu-glow-a 28s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '46%', height: '42%', background: 'radial-gradient(ellipse,#D12626 0%,transparent 66%)', filter: 'blur(165px)', animation: 'menu-glow-b 34s ease-in-out infinite', animationDelay: '-16s' }} />
      </div>

      {/* ── Section intro ── */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: 'clamp(5rem,12vh,9rem) clamp(1.5rem,5vw,4rem) clamp(2rem,5vh,4rem)' }}>
        <div data-pfx data-speed="-40" data-fade="1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.6rem' }}>
          <span style={{ width: '2.5rem', height: '1px', background: '#D12626', opacity: .6 }} />
          <span className="font-josefin" style={{ fontSize: '.6rem', letterSpacing: '.52em', textTransform: 'uppercase', color: '#D12626' }}>The Menu</span>
          <span style={{ width: '2.5rem', height: '1px', background: '#D12626', opacity: .6 }} />
        </div>
        <h2 data-pfx data-speed="-30" data-scale="0.04" data-fade="1" className="font-cormorant" style={{ fontSize: 'clamp(2.6rem,6vw,5.5rem)', fontWeight: 300, color: '#fff', lineHeight: 1.02, letterSpacing: '-.02em' }}>
          Crafted with <em style={{ fontStyle: 'italic', color: '#D12626' }}>Obsession.</em>
        </h2>
        <p data-pfx data-speed="-22" data-fade="1" className="font-cormorant" style={{ fontSize: 'clamp(1rem,1.5vw,1.2rem)', fontStyle: 'italic', color: 'rgba(255,255,255,.4)', marginTop: '1.4rem' }}>
          A curated exhibition — every item house-made, every day.
        </p>
      </div>

      {/* ── Category chapters ── */}
      {CATS.map(cat => {
        const items = menuItems.filter(m => m.category === cat.key)
        if (!items.length) return null
        const conf = COL_CONFIG[cols]
        const columns: MenuItem[][] = Array.from({ length: cols }, () => [])
        items.forEach((it, i) => columns[i % cols].push(it))

        return (
          <div key={cat.key} style={{ position: 'relative', zIndex: 1, padding: 'clamp(4rem,9vh,8rem) 0 clamp(5rem,10vh,9rem)' }}>
            {/* Giant background watermark */}
            <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(1rem,5vh,4rem)', left: 0, right: 0, textAlign: 'center', zIndex: 0, pointerEvents: 'none' }}>
              <span data-pfx data-speed="130" data-fade="1" className="font-cormorant" style={{ display: 'inline-block', fontWeight: 300, lineHeight: 1, fontSize: 'clamp(7rem,24vw,19rem)', color: 'rgba(255,255,255,.035)', textTransform: 'uppercase', userSelect: 'none', whiteSpace: 'nowrap', willChange: 'transform' }}>
                {cat.key}
              </span>
            </div>

            {/* Cinematic category title */}
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(1.5rem,5vw,4rem)', marginBottom: 'clamp(2.5rem,6vh,5.5rem)' }}>
              <div data-pfx data-speed="-50" data-fade="1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.8rem', marginBottom: '1.2rem' }}>
                <span style={{ width: '1.6rem', height: '1px', background: '#D12626', opacity: .6 }} />
                <span className="font-josefin" style={{ fontSize: '.52rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>
                  {items.length} {items.length === 1 ? 'Creation' : 'Creations'}
                </span>
                <span style={{ width: '1.6rem', height: '1px', background: '#D12626', opacity: .6 }} />
              </div>
              <h2 data-pfx data-speed="-78" data-scale="0.05" data-fade="1" className="font-cormorant" style={{ fontSize: 'clamp(3rem,11vw,9rem)', fontWeight: 300, color: '#fff', lineHeight: 1, letterSpacing: '0.01em', textTransform: 'uppercase', willChange: 'transform' }}>
                {cat.key}
              </h2>
              <p data-pfx data-speed="-34" data-fade="1" className="font-cormorant" style={{ fontSize: 'clamp(1rem,1.5vw,1.25rem)', fontStyle: 'italic', color: 'rgba(255,255,255,.42)', marginTop: '1rem' }}>
                {cat.tagline}
              </p>
            </div>

            {/* Curated columns (each a depth layer) */}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,4vw,3rem)', display: 'flex', gap: 'clamp(1rem,2vw,1.75rem)', alignItems: 'flex-start' }}>
              {columns.map((col, ci) => (
                <div
                  key={ci}
                  data-pfx data-speed={String(conf[ci].speed)}
                  style={{ flex: 1, minWidth: 0, marginTop: cols === 1 ? 0 : conf[ci].offset, display: 'flex', flexDirection: 'column', gap: 'clamp(1rem,2vw,1.75rem)', willChange: 'transform' }}
                >
                  {col.map(item => <MenuCard key={item.id} item={item} />)}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* ── Closing note ── */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(1.5rem,5vw,4rem) clamp(6rem,12vh,11rem)' }}>
        <p data-reveal className="font-cormorant" style={{ opacity: 1, fontSize: 'clamp(1.1rem,1.8vw,1.5rem)', fontStyle: 'italic', color: 'rgba(255,255,255,.42)', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.7 }}>
          Sweet Italian fennel sausage, all desserts, dressings and most toppings
          are house-made daily.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <span style={{ width: '2rem', height: '1px', background: 'rgba(209,38,38,.5)' }} />
          <span className="font-josefin" style={{ fontSize: '.55rem', letterSpacing: '.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)' }}>Made fresh · Every day</span>
          <span style={{ width: '2rem', height: '1px', background: 'rgba(209,38,38,.5)' }} />
        </div>
      </div>
    </section>
  )
}
