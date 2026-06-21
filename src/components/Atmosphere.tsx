'use client'

/* ──────────────────────────────────────────────────────────────────────────
   Atmosphere — one persistent, page-wide field of floating embers + dust.

   This is the connective tissue that turns seven separate sections into a
   single continuous environment. It lives in a fixed full-viewport canvas
   *behind* every section's content, so as you scroll the same living
   particle field shows through every scene — nothing ever feels truly static.

   It also listens to scroll velocity: flick down fast and the embers streak
   and surge upward (you're "moving through" the field), then settle when you
   stop. That coupling is what makes scrolling read as camera movement rather
   than a list of reveals.

   Performance: a single rAF, additive blending for cheap glow, DPR capped at
   1.5, particle count scaled to viewport area, paused when the tab is hidden,
   and fully disabled under prefers-reduced-motion.
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react'

type P = {
  x: number; y: number
  r: number          // radius
  z: number          // depth 0..1 (near = bigger, faster, brighter)
  vy: number         // base upward drift
  drift: number      // horizontal sway amplitude
  phase: number      // sway phase
  tw: number         // twinkle phase
  hue: 0 | 1 | 2     // ember-red / warm-amber / ash-white
}

const TINTS = [
  [255, 76, 0],     // brand orange
  [229, 101, 101],  // coral secondary
  [255, 150, 80],   // warm amber
] as const

export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    if (!canvas || reduce) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0, h = 0
    let particles: P[] = []

    // The Hero is a pure cinematic visual — the ambient field must never appear
    // over it. We fade the canvas out (and skip its draw loop) whenever the Hero
    // owns the viewport, then fade back in for the light content scenes below.
    let over = true
    canvas.style.transition = 'opacity 0.7s ease'
    canvas.style.opacity = '0'
    const hero = document.getElementById('home')
    const heroIO = hero
      ? new IntersectionObserver(
          (entries) => {
            over = entries[0].isIntersecting
            canvas.style.opacity = over ? '0' : '1'
          },
          { threshold: 0 }
        )
      : null
    if (hero && heroIO) heroIO.observe(hero)
    else { over = false; canvas.style.opacity = '1' } // fallback: always on

    const build = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // density scales with area but stays bounded for perf
      const count = Math.round(Math.min(80, Math.max(34, (w * h) / 26000)))
      particles = Array.from({ length: count }, () => spawn(true))
    }

    function spawn(anywhere: boolean): P {
      const z = Math.random()
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + Math.random() * 40,
        r: 0.6 + z * 2.4,
        z,
        vy: 0.06 + z * 0.22,
        drift: 6 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
        tw: Math.random() * Math.PI * 2,
        hue: (Math.random() < 0.55 ? 0 : Math.random() < 0.6 ? 1 : 2) as 0 | 1 | 2,
      }
    }

    // ── scroll velocity → upward surge ────────────────────────────────────
    let lastScroll = window.scrollY
    let surge = 0
    const onScroll = () => {
      const y = window.scrollY
      const dv = y - lastScroll
      lastScroll = y
      // accumulate signed velocity, clamped; downward scroll pushes embers up
      surge = clamp(surge + dv * 0.06, -22, 22)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    let raf = 0
    let t = 0
    let running = true

    const tick = () => {
      if (!running) return
      // Hero owns the screen — keep the field invisible and skip all drawing.
      if (over) { raf = requestAnimationFrame(tick); return }
      t += 0.016
      surge *= 0.9 // ease the surge back to rest

      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        // base upward drift + scroll-velocity parallax (near layers react most):
        // scrolling down (surge>0) streaks embers up faster; scrolling up reverses.
        p.y -= p.vy + surge * 0.17 * p.z
        p.x += Math.sin(t * 0.4 + p.phase) * 0.12 * p.z

        if (p.y < -10) Object.assign(p, spawn(false))
        else if (p.y > h + 10) p.y = -8

        const twinkle = 0.5 + 0.5 * Math.sin(t * 1.6 + p.tw)
        // tuned for a near-white canvas: warm motes read as soft floating dust
        const a = (0.05 + p.z * 0.13) * (0.55 + twinkle * 0.45)
        const [rr, gg, bb] = TINTS[p.hue]

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        grd.addColorStop(0, `rgba(${rr},${gg},${bb},${a})`)
        grd.addColorStop(1, `rgba(${rr},${gg},${bb},0)`)
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    let resizeRaf = 0
    const onResize = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(build)
    }
    window.addEventListener('resize', onResize)

    build()
    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeRaf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      heroIO?.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[38]"
    />
  )
}

/* local clamp (kept self-contained so Atmosphere has no import surface) */
function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}
