'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { locations } from '@/data/locations'

/* ════════════════════════════════════════════════════════════════════
   3D FLY-THROUGH MODEL
   --------------------------------------------------------------------
   A virtual camera travels forward along Z. Each location lives at its
   own world-Z depth. Real CSS `perspective` does the scaling, so a panel
   moving through translateZ -450 → 0 → +137 scales 0.7 → 1.0 → 1.15.
   ════════════════════════════════════════════════════════════════════ */
const PERSPECTIVE = 1050
const SPACING = 1150          // Z gap between consecutive locations
const START_Z = -700          // depth of the first location
const N = locations.length

const WORLD_Z = locations.map((_, i) => START_Z - i * SPACING)
const TRAVEL = -WORLD_Z[N - 1]   // journey ends with the last location resting in focus

/* per-location screen-plane scatter (world px) + base tilt — organic, not a grid */
const SCATTER = [
  { x: -170, y: -72, rot: -4 },
  { x:  192, y:  58, rot:  5 },
  { x: -118, y: 112, rot: -3 },
  { x:  162, y: -110, rot:  4 },
  { x: -204, y:  48, rot: -5 },
  { x:  150, y:  96, rot:  3 },
]

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/* opacity over the panel's life as it flies toward + past the camera */
function depthOpacity(rz: number) {
  if (rz <= -1700 || rz >= 340) return 0
  if (rz < -850) return clamp((rz + 1700) / 850, 0, 1)   // emerge from the deep
  if (rz <= 90) return 1                                  // in the world
  return clamp(1 - (rz - 90) / 250, 0, 1)                // sweep past camera
}

export default function Locations() {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null))
  const barRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef(0)

  // HUD elements are updated via refs (NOT React state) so the component
  // never re-renders — a re-render would let React reconcile the panel
  // `style` prop and wipe GSAP's inline transform/opacity, flashing every
  // panel to centered full-size for a frame.
  const hudNumRef = useRef<HTMLSpanElement>(null)
  const hudNameRef = useRef<HTMLDivElement>(null)
  const hudAddrRef = useRef<HTMLDivElement>(null)
  const hudCountRef = useRef<HTMLSpanElement>(null)

  const [simple, setSimple] = useState(false)   // mobile / reduced-motion fallback

  /* ── Decide experience tier ─────────────────────────────────────── */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768
    setSimple(reduce || small)
  }, [])

  /* ── 3D camera rig ──────────────────────────────────────────────── */
  useEffect(() => {
    if (simple) return
    const section = sectionRef.current
    const frame = frameRef.current
    if (!section || !frame) return

    const apply = (progress: number) => {
      const cam = progress * TRAVEL
      let focus = 0
      let best = Infinity

      panelRefs.current.forEach((el, i) => {
        if (!el) return
        const rz = WORLD_Z[i] + cam
        const op = depthOpacity(rz)
        const dist = Math.abs(rz)

        if (op > 0.4 && dist < best) { best = dist; focus = i }

        const tz = Math.min(rz, 340)                         // cap before camera plane
        const rotY = clamp(-rz / 60, -11, 11) + SCATTER[i].rot
        const rotX = clamp(rz / 150, -5, 5)
        const blur = clamp((dist - 120) / 190, 0, 5)          // sharp focal window
        const bright = clamp(1 - dist / 1800, 0.45, 1)

        gsap.set(el, {
          xPercent: -50, yPercent: -50,
          x: SCATTER[i].x, y: SCATTER[i].y, z: tz,
          rotationY: rotY, rotationX: rotX,
          opacity: op,
          filter: `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(3)})`,
          pointerEvents: op > 0.82 ? 'auto' : 'none',
        })
      })

      if (barRef.current) gsap.set(barRef.current, { scaleX: progress })

      // Black curtain: opaque while the section enters (p<0.05) and leaves
      // (p>0.93). Guarantees the scene is never visible bleeding into the
      // previous/next section even as the sticky frame sticks/releases.
      if (curtainRef.current) {
        const fadeIn = clamp((0.05 - progress) / 0.05, 0, 1)
        const fadeOut = clamp((progress - 0.93) / 0.07, 0, 1)
        curtainRef.current.style.opacity = String(Math.max(fadeIn, fadeOut))
      }

      if (focus !== focusRef.current) {
        focusRef.current = focus
        const loc = locations[focus]
        const pad = `0${focus + 1}`
        if (hudNumRef.current) hudNumRef.current.textContent = pad
        if (hudNameRef.current) hudNameRef.current.textContent = loc.name
        if (hudAddrRef.current) hudAddrRef.current.textContent = loc.address
        if (hudCountRef.current) hudCountRef.current.textContent = pad
      }
    }

    // Containment is pure CSS: the section is a tall scroll runway and the
    // inner frame is `position: sticky`, so the scene is physically bounded
    // by this section — it cannot appear before the section's top reaches the
    // viewport or after its bottom leaves.
    //
    // Progress is derived every frame from the section's LIVE position
    // (getBoundingClientRect), not from ScrollTrigger start/end. This is
    // immune to layout shifts from the Hero's async pin-spacer, which were
    // mismapping the animation relative to the actual sticky position.
    // gsap.ticker is already synced to Lenis via SmoothScroll.
    let last = -1
    const update = () => {
      const vh = window.innerHeight
      const total = section.offsetHeight - vh        // sticky travel distance
      const p = total > 0 ? clamp(-section.getBoundingClientRect().top / total, 0, 1) : 0
      if (Math.abs(p - last) < 0.0004) return         // skip redundant work
      last = p
      apply(p)
    }

    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [simple])

  /* ════════════════════════════════════════════════════════════════
     SIMPLE FALLBACK (mobile / reduced motion)
     ════════════════════════════════════════════════════════════════ */
  if (simple) {
    return (
      <section id="locations" style={{ background: '#000', position: 'relative', overflow: 'hidden' }}>
        <style>{GLOW_KEYFRAMES}</style>
        <AmbientGlow />
        <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(4rem,9vh,7rem) clamp(1.5rem,5vw,3rem)' }}>
          <Header />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginTop: '2.5rem' }}>
            {locations.map((loc, i) => (
              <a key={loc.id} href={loc.mapUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'grid', gridTemplateColumns: '92px 1fr', gap: '1rem',
                  background: 'rgba(14,5,5,.72)', border: '1px solid rgba(209,38,38,.14)',
                  borderRadius: '14px', padding: '14px', textDecoration: 'none',
                  backdropFilter: 'blur(14px)',
                }}>
                <div style={{ height: '92px', borderRadius: '9px', overflow: 'hidden' }}>
                  <img src={loc.image} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="font-josefin" style={{ fontSize: '.5rem', letterSpacing: '.4em', color: '#D12626', marginBottom: 4 }}>0{i + 1}</span>
                  <h3 className="font-cormorant" style={{ fontSize: '1.3rem', fontWeight: 300, color: 'rgba(255,255,255,.92)' }}>{loc.name}</h3>
                  <span className="font-josefin" style={{ fontSize: '.55rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,.34)', marginTop: 6 }}>Get Directions →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ════════════════════════════════════════════════════════════════
     CINEMATIC 3D EXPERIENCE
     ════════════════════════════════════════════════════════════════ */
  return (
    /*
     * Tall scroll runway (height = 650vh). The inner frame is sticky and
     * 100vh, so the journey plays across ~5.5 viewports of scroll while the
     * frame stays locked INSIDE this section, then releases with it.
     * The section has NO overflow clip (that would break sticky); clipping
     * happens on the sticky frame itself.
     */
    <section id="locations" ref={sectionRef} style={{ background: '#000', position: 'relative', height: '650vh' }}>
      <style>{`
        ${GLOW_KEYFRAMES}
        .loc-dir { transition: background .35s ease, color .35s ease, border-color .35s ease; }
        .loc-dir:hover { background:#D12626 !important; color:#fff !important; border-color:#D12626 !important; }
        .loc-panel { transition: box-shadow .4s ease; }
        .loc-panel:hover { box-shadow: 0 60px 130px rgba(0,0,0,.8), 0 0 90px rgba(209,38,38,.30), inset 0 1px 0 rgba(255,255,255,.10) !important; }
      `}</style>

      {/* Sticky cinematic frame — fully contained within this section */}
      <div ref={frameRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#000' }}>

        <AmbientGlow />

        {/* Vignette for cinematic lighting */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: 'radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,.55) 100%)',
        }} />

        {/* ── 3D STAGE ──────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, perspective: `${PERSPECTIVE}px`, zIndex: 2 }}>
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
            {locations.map((loc, i) => (
              <div
                key={loc.id}
                ref={el => { panelRefs.current[i] = el }}
                className="loc-panel"
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 'clamp(258px, 24vw, 358px)',
                  opacity: 0,
                  willChange: 'transform, opacity, filter',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: 'rgba(14,5,5,.55)',
                  backdropFilter: 'blur(20px) saturate(.9)',
                  border: '1px solid rgba(209,38,38,.20)',
                  boxShadow: '0 45px 100px rgba(0,0,0,.7), 0 0 60px rgba(209,38,38,.16), inset 0 1px 0 rgba(255,255,255,.07)',
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: 'clamp(300px, 30vw, 412px)', overflow: 'hidden' }}>
                  <img src={loc.image} alt={loc.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {/* bottom legibility gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.85) 100%)' }} />
                  {/* glass sheen */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 38%)', pointerEvents: 'none' }} />
                  {/* red corner accents */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '2rem', height: '1px', background: '#D12626', opacity: .6 }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '2rem', background: '#D12626', opacity: .6 }} />
                  {/* index */}
                  <div className="font-cormorant" style={{ position: 'absolute', top: 12, right: 16, fontSize: '2.6rem', fontWeight: 300, color: 'rgba(255,255,255,.14)', lineHeight: 1, userSelect: 'none' }}>0{i + 1}</div>

                  {/* name + address + directions */}
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 22px 20px' }}>
                    <h3 className="font-cormorant" style={{ fontSize: '1.7rem', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: 4 }}>{loc.name}</h3>
                    <p className="font-josefin" style={{ fontSize: '.52rem', letterSpacing: '.34em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 14, lineHeight: 1.6 }}>{loc.address}</p>
                    <a className="loc-dir font-josefin" href={loc.mapUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontSize: '.56rem', letterSpacing: '.34em', textTransform: 'uppercase',
                        color: '#fff', textDecoration: 'none',
                        padding: '9px 16px', borderRadius: 999,
                        border: '1px solid rgba(209,38,38,.55)',
                        background: 'rgba(209,38,38,.10)',
                        backdropFilter: 'blur(6px)',
                      }}>
                      Get Directions
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M1 7L7 1M7 1H2M7 1V6" stroke="currentColor" strokeWidth="1.3" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HUD: title (top-left) ─────────────────────────────────── */}
        <div style={{ position: 'absolute', top: 'clamp(2rem,6vh,5rem)', left: 'clamp(2rem,5vw,5rem)', zIndex: 5, pointerEvents: 'none', maxWidth: '40vw' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem' }}>
            <span style={{ width: '2rem', height: '1px', background: '#D12626', opacity: .65 }} />
            <span className="font-josefin" style={{ fontSize: '.58rem', letterSpacing: '.52em', textTransform: 'uppercase', color: '#D12626' }}>Locations</span>
          </div>
          <h2 className="font-cormorant" style={{ fontSize: 'clamp(1.8rem,3.4vw,3.1rem)', fontWeight: 300, color: 'rgba(255,255,255,.95)', lineHeight: 1.04, letterSpacing: '-.02em' }}>
            Find Your<br /><em style={{ fontStyle: 'italic', color: '#D12626' }}>Nearest Pitfire.</em>
          </h2>
        </div>

        {/* ── HUD: live readout (bottom) ────────────────────────────── */}
        <div style={{ position: 'absolute', left: 'clamp(2rem,5vw,5rem)', right: 'clamp(2rem,5vw,5rem)', bottom: 'clamp(2rem,5vh,4rem)', zIndex: 5, pointerEvents: 'none', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span ref={hudNumRef} className="font-cormorant" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 300, color: 'rgba(255,255,255,.16)', lineHeight: 1 }}>01</span>
            <div>
              <div ref={hudNameRef} className="font-cormorant" style={{ fontSize: 'clamp(1.1rem,1.8vw,1.5rem)', fontWeight: 300, color: 'rgba(255,255,255,.9)', lineHeight: 1.1 }}>{locations[0].name}</div>
              <div ref={hudAddrRef} className="font-josefin" style={{ fontSize: '.5rem', letterSpacing: '.34em', textTransform: 'uppercase', color: 'rgba(255,255,255,.34)', marginTop: 4 }}>{locations[0].address}</div>
            </div>
          </div>

          <div style={{ minWidth: 150 }}>
            <div className="font-josefin" style={{ fontSize: '.5rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 8, textAlign: 'right' }}>
              <span ref={hudCountRef}>01</span> <span style={{ color: 'rgba(255,255,255,.2)' }}>/ 0{N}</span>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,.12)', position: 'relative', overflow: 'hidden' }}>
              <div ref={barRef} style={{ position: 'absolute', inset: 0, background: '#D12626', transformOrigin: 'left', transform: 'scaleX(0)' }} />
            </div>
          </div>
        </div>

        {/* Black curtain — opaque as the section enters/leaves so the scene
            never bleeds into the adjacent sections. Driven from apply(). */}
        <div ref={curtainRef} aria-hidden="true" style={{
          position: 'absolute', inset: 0, background: '#000',
          zIndex: 6, pointerEvents: 'none', opacity: 1,
        }} />

      </div>
    </section>
  )
}

/* ── Shared header (fallback) ───────────────────────────────────────── */
function Header() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem' }}>
        <span style={{ width: '2rem', height: '1px', background: '#D12626', opacity: .65 }} />
        <span className="font-josefin" style={{ fontSize: '.58rem', letterSpacing: '.52em', textTransform: 'uppercase', color: '#D12626' }}>Locations</span>
      </div>
      <h2 className="font-cormorant" style={{ fontSize: 'clamp(2.2rem,8vw,3.4rem)', fontWeight: 300, color: 'rgba(255,255,255,.95)', lineHeight: 1.04, letterSpacing: '-.02em' }}>
        Find Your <em style={{ fontStyle: 'italic', color: '#D12626' }}>Nearest Pitfire.</em>
      </h2>
    </div>
  )
}

/* ── Ambient animated red glow ──────────────────────────────────────── */
const GLOW_KEYFRAMES = `
  @keyframes loc-glow-a { 0%,100%{transform:translate(0,0) scale(1);opacity:.08} 50%{transform:translate(44px,-30px) scale(1.12);opacity:.13} }
  @keyframes loc-glow-b { 0%,100%{transform:translate(0,0) scale(1);opacity:.05} 50%{transform:translate(-34px,26px) scale(1.09);opacity:.08} }
  @keyframes loc-glow-c { 0%,100%{transform:translate(0,0) scale(1);opacity:.03} 50%{transform:translate(20px,38px) scale(1.07);opacity:.06} }
`
function AmbientGlow() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position: 'absolute', top: '-6%', right: '-6%', width: '54%', height: '56%', background: 'radial-gradient(ellipse,#D12626 0%,transparent 68%)', filter: 'blur(135px)', animation: 'loc-glow-a 24s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '6%', left: '-8%', width: '48%', height: '52%', background: 'radial-gradient(ellipse,#D12626 0%,transparent 66%)', filter: 'blur(160px)', animation: 'loc-glow-b 31s ease-in-out infinite', animationDelay: '-14s' }} />
      <div style={{ position: 'absolute', top: '36%', left: '38%', width: '40%', height: '40%', background: 'radial-gradient(ellipse,#D12626 0%,transparent 65%)', filter: 'blur(185px)', animation: 'loc-glow-c 37s ease-in-out infinite', animationDelay: '-20s' }} />
    </div>
  )
}
