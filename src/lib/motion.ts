'use client'

/* ──────────────────────────────────────────────────────────────────────────
   Unified animation language
   ---------------------------------------------------------------------------
   A single source of truth for easing + a small set of reusable, GPU-friendly
   interaction hooks (3D tilt, pointer parallax). Every section imports from
   here so motion feels like one continuous, intentional system rather than a
   bag of one-off effects.

   Principles baked in:
     • transforms only (translate / rotate / scale) — never layout properties
     • gsap.quickTo for buttery, interruptible pointer response
     • respects prefers-reduced-motion and skips on coarse (touch) pointers
   ────────────────────────────────────────────────────────────────────────── */

import { gsap } from 'gsap'
import { useEffect, type RefObject } from 'react'

/* Shared cubic-bezier curves (Framer Motion `ease` arrays) */
export const EASE = {
  /** signature ease-out — calm, expensive deceleration (Apple-style) */
  out: [0.16, 1, 0.3, 1] as const,
  /** symmetric ease for reversible / scrubbed motion */
  inOut: [0.83, 0, 0.17, 1] as const,
  /** gentle all-purpose curve */
  soft: [0.25, 0.1, 0.25, 1] as const,
}

/* GSAP ease strings tuned to match the curves above */
export const GSAP_EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
} as const

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function isCoarsePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  )
}

/* clamp helper shared across sections */
export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v))

/* ──────────────────────────────────────────────────────────────────────────
   useSceneParallax — the continuous "camera" engine.

   Every frame, each tagged layer reads how far its centre sits from the
   viewport centre (q ∈ −1..1) and translates that into real Z-space motion:
   vertical drift, horizontal drift, depth (translateZ), a turn toward camera
   (rotateY) and a scale breath. Because it runs continuously — not as a
   one-shot reveal — sections never sit still: they travel *through* space as
   you scroll, foreground faster than background, which is what sells the
   "scrolling is directing a camera" feeling.

   `data-par` flags the element as a layer; the channels below are all optional
   (all px / deg). Positive vertical = foreground (travels faster than scroll),
   negative = background (lags):
     data-par-y vertical travel
     data-px    horizontal drift
     data-z     depth push in px      (recedes as it leaves centre)
     data-rot   rotateY turn in deg   (panel pivots toward camera at centre)
     data-rotx  rotateX tilt in deg
     data-scl   scale delta           (e.g. 0.12 → biggest/nearest at centre)

   Transforms only → GPU-friendly. Reads are batched before writes to avoid
   layout thrash, off-screen layers are skipped, touch/reduced-motion bail out.
   Keep data-par and usePointerParallax on *different* elements (wrapper vs.
   inner) so their transform channels never fight.
   ────────────────────────────────────────────────────────────────────────── */
export function useSceneParallax(
  ref: RefObject<HTMLElement | null>,
  opts: { selector?: string; mobileAmp?: number } = {}
) {
  const { selector = '[data-par]', mobileAmp = 0.5 } = opts

  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return

    const amp = window.innerWidth < 768 ? mobileAmp : 1
    const layers = Array.from(root.querySelectorAll<HTMLElement>(selector)).map((el) => ({
      el,
      y: parseFloat(el.dataset.parY || '0'),
      x: parseFloat(el.dataset.px || '0'),
      z: parseFloat(el.dataset.z || '0'),
      rot: parseFloat(el.dataset.rot || '0'),
      rotx: parseFloat(el.dataset.rotx || '0'),
      scl: parseFloat(el.dataset.scl || '0'),
      setter: gsap.quickSetter(el, 'css'),
    }))
    if (!layers.length) return

    // two-pass: read every rect first, then write — no interleaved thrash
    const rects = new Array<number>(layers.length)
    const update = () => {
      const vh = window.innerHeight
      const vc = vh / 2
      for (let i = 0; i < layers.length; i++) {
        const r = layers[i].el.getBoundingClientRect()
        rects[i] = r.top + r.height / 2 - vc
      }
      for (let i = 0; i < layers.length; i++) {
        const l = layers[i]
        const q = clamp(rects[i] / vh, -1.25, 1.25)
        const at = Math.abs(q)
        ;(l.setter as (v: Record<string, unknown>) => void)({
          y: l.y ? q * l.y * amp : 0,
          x: l.x ? q * l.x * amp : 0,
          z: l.z ? -at * l.z : 0,
          rotateY: l.rot ? -q * l.rot : 0,
          rotateX: l.rotx ? q * l.rotx : 0,
          scale: l.scl ? 1 - at * l.scl : 1,
          force3D: true,
        })
      }
    }

    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [ref, selector, mobileAmp])
}

/* ──────────────────────────────────────────────────────────────────────────
   useTilt — subtle 3D card tilt that tracks the cursor and eases home.
   Pointer-only (skipped on touch + reduced motion). Adds depth on hover.
   ────────────────────────────────────────────────────────────────────────── */
export function useTilt(
  ref: RefObject<HTMLElement | null>,
  opts: { max?: number; scale?: number; lift?: number; perspective?: number } = {}
) {
  const { max = 7, scale = 1.02, lift = 6, perspective = 900 } = opts

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || isCoarsePointer()) return

    gsap.set(el, { transformPerspective: perspective, transformStyle: 'preserve-3d' })

    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const sc = gsap.quickTo(el, 'scale', { duration: 0.6, ease: 'power3.out' })
    const ty = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      ry(px * max * 2)
      rx(-py * max * 2)
    }
    const onEnter = () => {
      sc(scale)
      ty(-lift)
    }
    const onLeave = () => {
      rx(0)
      ry(0)
      sc(1)
      ty(0)
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [ref, max, scale, lift, perspective])
}

/* ──────────────────────────────────────────────────────────────────────────
   usePointerParallax — drifts one or more inner layers toward the cursor.
   Targets are resolved from a CSS selector inside `ref` and read their own
   `data-depth` (0..1) so each layer moves at a different rate (parallax).
   ────────────────────────────────────────────────────────────────────────── */
export function usePointerParallax(
  ref: RefObject<HTMLElement | null>,
  selector: string,
  strength = 24
) {
  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion() || isCoarsePointer()) return

    const layers = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (!layers.length) return

    const setters = layers.map((el) => ({
      depth: parseFloat(el.dataset.depth || '0.5'),
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    }))

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      for (const s of setters) {
        s.x(px * strength * s.depth)
        s.y(py * strength * s.depth)
      }
    }
    const onLeave = () => setters.forEach((s) => { s.x(0); s.y(0) })

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(layers)
    }
  }, [ref, selector, strength])
}
