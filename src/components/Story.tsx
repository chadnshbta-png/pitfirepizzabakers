'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/* ── Ambient glow keyframes (separate elements — never touched by JS) ── */
const KEYFRAMES = `
  @keyframes story-glow-a {
    0%,100% { transform:translate(0,0) scale(1); opacity:.07; }
    50%      { transform:translate(36px,-26px) scale(1.10); opacity:.11; }
  }
  @keyframes story-glow-b {
    0%,100% { transform:translate(0,0) scale(1); opacity:.04; }
    50%      { transform:translate(-30px,24px) scale(1.07); opacity:.07; }
  }
`

/* ── Shared style atoms ─────────────────────────────────────────────── */
const eyebrow: React.CSSProperties = {
  fontSize: '.6rem', letterSpacing: '.52em', textTransform: 'uppercase', color: '#D12626',
}
const supporting: React.CSSProperties = {
  fontSize: 'clamp(1.05rem,1.75vw,1.45rem)', fontWeight: 300,
  color: 'rgba(255,255,255,.58)', lineHeight: 1.85,
}
const eyebrowRow = (label: string) => (
  <div
    data-pfx data-speed="-55" data-fade="1"
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}
  >
    <span style={{ width: '2.5rem', height: '1px', background: '#D12626', opacity: .6 }} />
    <span className="font-josefin" style={eyebrow}>{label}</span>
    <span style={{ width: '2.5rem', height: '1px', background: '#D12626', opacity: .6 }} />
  </div>
)

/* ── Giant decorative numeral (deep parallax layer) ─────────────────── */
function Numeral({ n }: { n: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', top: 'clamp(1rem,6vh,5rem)', left: 0, right: 0,
        textAlign: 'center', zIndex: 0, pointerEvents: 'none',
      }}
    >
      <span
        data-pfx data-speed="135" data-fade="1"
        className="font-cormorant"
        style={{
          display: 'inline-block', fontWeight: 300, lineHeight: 1,
          fontSize: 'clamp(9rem,26vw,22rem)',
          color: 'rgba(255,255,255,.04)', userSelect: 'none', willChange: 'transform',
        }}
      >
        {n}
      </span>
    </div>
  )
}

/* ── Cinematic video frame (chapters 2 & 3) — 3D tilt + internal pan ── */
function VideoFrame({ src }: { src: string }) {
  return (
    <div style={{ perspective: '1300px' }}>
      <div
        data-pfx data-speed="34" data-rot="8" data-scale="0.07" data-fade="1"
        style={{
          position: 'relative',
          width: 'min(1160px, 90vw)', margin: '0 auto',
          aspectRatio: '16 / 9', borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(209,38,38,.16)',
          boxShadow: '0 50px 120px rgba(0,0,0,.7), 0 0 70px rgba(209,38,38,.10)',
          transformStyle: 'preserve-3d', willChange: 'transform',
        }}
      >
        <video
          data-vpan="10"
          src={src}
          autoPlay muted loop playsInline
          style={{
            position: 'absolute', left: 0, top: '-15%',
            width: '100%', height: '130%', objectFit: 'cover',
            willChange: 'transform',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,.15), transparent 30%, transparent 75%, rgba(0,0,0,.35))',
        }} />
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <span style={{
        display: 'block', width: '1px', height: 'clamp(4rem,9vh,8rem)',
        background: 'linear-gradient(to bottom, transparent, rgba(209,38,38,.45), transparent)',
      }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   About — three cinematic chapters with a live-position parallax engine
   ══════════════════════════════════════════════════════════════════════ */
export default function Story() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    const mAmp = mobile ? 0.5 : 1      // translate amplitude scale
    const mRot = mobile ? 0 : 1        // 3D tilt off on mobile

    const pfx = gsap.utils.toArray<HTMLElement>('[data-pfx]', root).map(el => ({
      el,
      speed: parseFloat(el.dataset.speed || '0'),
      rot: parseFloat(el.dataset.rot || '0'),
      scale: parseFloat(el.dataset.scale || '0'),
      fade: el.dataset.fade === '1',
    }))
    const vids = gsap.utils.toArray<HTMLElement>('[data-vpan]', root).map(el => ({
      el, pan: parseFloat(el.dataset.vpan || '0'),
    }))

    // Reduced motion → everything static and fully visible, no ticker.
    if (reduce) {
      pfx.forEach(p => { if (p.fade) p.el.style.opacity = '1' })
      return
    }

    const update = () => {
      const h = window.innerHeight
      const vc = h / 2

      for (const it of pfx) {
        const r = it.el.getBoundingClientRect()
        if (r.bottom < -350 || r.top > h + 350) continue           // skip offscreen
        const q = clamp((r.top + r.height / 2 - vc) / h, -1.2, 1.2) // +below center, 0 center, −above
        const y = q * it.speed * mAmp
        const rotateX = it.rot * q * mRot
        const scale = it.scale ? 1 - clamp(Math.abs(q), 0, 0.6) * it.scale : 1
        gsap.set(it.el, { y, rotateX, scale, force3D: true })
        if (it.fade) it.el.style.opacity = String(clamp((0.72 - q) / 0.42, 0, 1))
      }

      for (const v of vids) {
        const p = v.el.parentElement
        if (!p) continue
        const r = p.getBoundingClientRect()
        if (r.bottom < -350 || r.top > h + 350) continue
        const q = clamp((r.top + r.height / 2 - vc) / h, -1, 1)
        gsap.set(v.el, { yPercent: q * v.pan * (mobile ? 0.6 : 1), force3D: true })
      }
    }

    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <section
      id="story"
      ref={sectionRef}
      style={{ background: '#000', position: 'relative', overflowX: 'clip' }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Ambient red glow ── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '24%', right: '-8%', width: '52%', height: '46%',
          background: 'radial-gradient(ellipse,#D12626 0%,transparent 68%)',
          filter: 'blur(150px)', animation: 'story-glow-a 26s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '8%', left: '-10%', width: '46%', height: '44%',
          background: 'radial-gradient(ellipse,#D12626 0%,transparent 66%)',
          filter: 'blur(165px)', animation: 'story-glow-b 32s ease-in-out infinite', animationDelay: '-15s',
        }} />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CHAPTER 01 — headline OVER full-bleed cinematic video
      ════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative', minHeight: '108vh', overflow: 'hidden', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Full-bleed video (internal vertical pan) */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <video
            data-vpan="7"
            src="/video/Create_a_premium_cinematic_web.mp4"
            autoPlay muted loop playsInline
            style={{
              position: 'absolute', left: 0, top: '-10%',
              width: '100%', height: '120%', objectFit: 'cover', willChange: 'transform',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,.45) 0%, rgba(0,0,0,.72) 70%, rgba(0,0,0,.92) 100%)',
          }} />
        </div>

        {/* Headline (foreground parallax) */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(1.5rem,5vw,4rem)', maxWidth: '1100px' }}>
          <div
            data-pfx data-speed="-55" data-fade="1"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}
          >
            <span style={{ width: '2.5rem', height: '1px', background: '#D12626', opacity: .6 }} />
            <span className="font-josefin" style={eyebrow}>Chapter One · Our Craft</span>
            <span style={{ width: '2.5rem', height: '1px', background: '#D12626', opacity: .6 }} />
          </div>

          <h2
            data-pfx data-speed="-40" data-scale="0.05" data-fade="1"
            className="font-cormorant"
            style={{
              fontSize: 'clamp(3rem,11vw,11rem)', fontWeight: 300, color: '#fff',
              lineHeight: 0.96, letterSpacing: '-0.025em', textShadow: '0 20px 80px rgba(0,0,0,.6)',
              willChange: 'transform',
            }}
          >
            Pizza Is a<br />Simple Food.
          </h2>

          <p
            data-pfx data-speed="-28" data-fade="1"
            className="font-josefin"
            style={{
              marginTop: '2.25rem', fontSize: 'clamp(.6rem,1vw,.72rem)',
              letterSpacing: '.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)',
            }}
          >
            Dough · Tomatoes · Cheese · Toppings
          </p>
        </div>
      </div>

      {/* Supporting copy beneath chapter 1 */}
      <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(5rem,11vh,11rem) clamp(1.5rem,5vw,4rem)' }}>
        <p data-pfx data-speed="-30" data-fade="1" className="font-cormorant" style={{ ...supporting, maxWidth: '40rem', margin: '0 auto', textAlign: 'center' }}>
          But in the forty years we&apos;ve been passionate about pizza, the one thing
          we&apos;ve learned is that the perfect pizza is not just a recipe — it&apos;s an
          ever-evolving quest for perfection.
        </p>
      </div>

      <Divider />

      {/* ════════════════════════════════════════════════════════════════
          CHAPTER 02 — OUR STYLE
      ════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(6rem,13vh,13rem) 0 clamp(5rem,10vh,10rem)' }}>
        <Numeral n="02" />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(1.5rem,5vw,4rem)', marginBottom: 'clamp(3rem,7vh,7rem)' }}>
          {eyebrowRow('Chapter Two')}
          <h2
            data-pfx data-speed="-44" data-scale="0.05" data-fade="1"
            className="font-cormorant"
            style={{ fontSize: 'clamp(3rem,10vw,9.5rem)', fontWeight: 300, color: '#fff', lineHeight: 0.98, letterSpacing: '-0.02em', willChange: 'transform' }}
          >
            Our Style
          </h2>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <VideoFrame src="/video/Italian-Tomatoes.mp4" />
        </div>

        <div data-pfx data-speed="-26" data-fade="1" style={{ position: 'relative', zIndex: 2, maxWidth: '40rem', margin: '0 auto', padding: 'clamp(3rem,7vh,7rem) clamp(1.5rem,5vw,4rem) 0', textAlign: 'center' }}>
          <p className="font-cormorant" style={{ ...supporting, color: 'rgba(255,255,255,.66)', marginBottom: '1.6rem' }}>
            Our pizza style is not quite Neapolitan, not quite New York — but
            somewhere perfectly in between.
          </p>
          <p className="font-cormorant" style={{ ...supporting, fontSize: 'clamp(.95rem,1.45vw,1.15rem)', color: 'rgba(255,255,255,.4)' }}>
            Our 72-Hour artisan doughmaking process takes place daily in small
            batches. This long ferment produces wonderful crust aroma, texture and
            mouth feel — and makes every bite highly digestible.
          </p>
        </div>
      </div>

      <Divider />

      {/* ════════════════════════════════════════════════════════════════
          CHAPTER 03 — THE PROMISE
      ════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(6rem,13vh,13rem) 0 clamp(8rem,16vh,16rem)' }}>
        <Numeral n="03" />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(1.5rem,5vw,4rem)', marginBottom: 'clamp(3rem,7vh,7rem)' }}>
          {eyebrowRow('Chapter Three')}
          <h2
            data-pfx data-speed="-44" data-scale="0.05" data-fade="1"
            className="font-cormorant"
            style={{ fontSize: 'clamp(3rem,10vw,9.5rem)', fontWeight: 300, color: '#fff', lineHeight: 0.98, letterSpacing: '-0.02em', willChange: 'transform' }}
          >
            The Promise
          </h2>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <VideoFrame src="/video/Pressing-Dough.mp4" />
        </div>

        <div data-pfx data-speed="-26" data-fade="1" style={{ position: 'relative', zIndex: 2, maxWidth: '40rem', margin: '0 auto', padding: 'clamp(3rem,7vh,7rem) clamp(1.5rem,5vw,4rem) 0', textAlign: 'center' }}>
          <p className="font-cormorant" style={{ ...supporting, fontSize: 'clamp(1.2rem,2vw,1.6rem)', color: 'rgba(255,255,255,.82)', marginBottom: '1.6rem' }}>
            You&apos;ll never feel sick, tired and too full after eating a Pitfire Pizza.
          </p>
          <p className="font-cormorant" style={{ ...supporting, fontSize: 'clamp(.95rem,1.45vw,1.15rem)', color: 'rgba(255,255,255,.4)' }}>
            We go to great lengths to ensure that every experience delivers
            freshness, value, and craft.
          </p>
        </div>
      </div>
    </section>
  )
}
