'use client'

import { useEffect, ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    // ── CRITICAL: keep downstream pins positioned correctly ──────────────
    // The Hero builds its pinned ScrollTrigger only AFTER its 240 frames finish
    // loading, which inserts a ~6000px pin-spacer and shifts every section below
    // it. If we don't recompute after that, downstream pinned sections (Menu,
    // Signature) keep their stale start/end — computed while the Hero was still
    // 100vh — and activate *inside* the Hero's range, overlapping it.
    //
    // A ResizeObserver fires the instant that height change lands (whenever the
    // frames happen to finish), which is far more reliable than fixed timers.
    let lastHeight = 0
    let rafId = 0
    const scheduleRefresh = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const h = document.body.scrollHeight
        if (Math.abs(h - lastHeight) < 8) return // ignore noise → avoids refresh loop
        lastHeight = h
        ScrollTrigger.refresh()
      })
    }
    const ro = new ResizeObserver(scheduleRefresh)
    ro.observe(document.body)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    // belt-and-suspenders fallbacks across the typical frame-load window
    const timers = [800, 2500, 5000].map((ms) => window.setTimeout(() => ScrollTrigger.refresh(), ms))

    return () => {
      window.removeEventListener('load', onLoad)
      timers.forEach(clearTimeout)
      cancelAnimationFrame(rafId)
      ro.disconnect()
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
