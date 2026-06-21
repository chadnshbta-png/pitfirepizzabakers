'use client'

/* ──────────────────────────────────────────────────────────────────────────
   SectionAmbient — a per-scene set of slow, decorative ambient elements.

   Drop one into any section from Our Story down to the Footer to give that
   scene its own quiet life: soft light glows, minimal geometric rings, faintly
   drifting ingredient icons and light motes — layered across depth.

   Design rules baked in:
     • Self-clipping layer (`absolute inset-0 overflow-hidden`) at zIndex:-1 so
       it sits ABOVE the section background but BELOW all content. The host only
       needs `isolate` (a stacking context) — content needs no changes.
     • Adds zero layout height (absolute) and never blocks input (pointer-events-none).
     • Motion is GPU-only (transform/opacity via CSS keyframes) and pauses under
       prefers-reduced-motion (handled by the .animate-* guard in globals.css).
     • Each decoration is OUTER `data-par` (scroll-camera parallax where a
       useSceneParallax runs) wrapping an INNER animated node — the two never
       share a transform channel.
     • Heavier / foreground pieces are desktop-only to protect mobile perf.
   ────────────────────────────────────────────────────────────────────────── */

import type { CSSProperties } from 'react'
import { Tomato, Basil, Olive, Cheese, Pepperoni } from './ingredients'

type IngComp = React.ComponentType<{ size?: number; style?: CSSProperties }>

type Deco = {
  type: 'glow' | 'ring' | 'mote' | 'icon'
  pos: string                 // position classes for the OUTER wrapper
  size: number | string       // inner dimensions
  color?: string              // glow / ring / mote
  Comp?: IngComp              // icon
  anim?: string               // animation class on the inner node
  par?: number                // data-par-y (parallax in scene-engine sections)
  px?: number                 // data-px
  delay?: number
  dur?: number
  opacity?: number
  desktopOnly?: boolean
}

const len = (v: number | string) => (typeof v === 'number' ? `${v}px` : v)

const SETS: Record<string, Deco[]> = {
  story: [
    { type: 'glow', pos: 'left-[6%] top-[16%]',  size: '34vw', color: 'rgba(255,76,0,0.06)',  par: -40, anim: 'animate-drift' },
    { type: 'glow', pos: 'right-[4%] bottom-[12%]', size: '30vw', color: 'rgba(229,101,101,0.06)', par: -28, anim: 'animate-light-shift', desktopOnly: true },
    { type: 'ring', pos: 'right-[14%] top-[22%]', size: 150, color: 'rgba(255,76,0,0.10)', par: 26, anim: 'animate-halo', desktopOnly: true },
    { type: 'icon', pos: 'left-[12%] bottom-[24%]', size: 40, Comp: Basil, par: 70, opacity: 0.1, delay: 0.5, desktopOnly: true },
    { type: 'icon', pos: 'right-[20%] top-[60%]', size: 34, Comp: Tomato, par: 96, opacity: 0.1, delay: 2, desktopOnly: true },
    { type: 'mote', pos: 'left-[40%] top-[30%]', size: 7, color: 'rgba(255,76,0,0.5)', par: 120, delay: 1 },
  ],
  ingredients: [
    { type: 'ring', pos: 'left-[10%] top-[18%]', size: 180, color: 'rgba(38,38,38,0.05)', par: -22, anim: 'animate-halo', desktopOnly: true },
    { type: 'mote', pos: 'right-[16%] top-[26%]', size: 6, color: 'rgba(255,76,0,0.45)', par: 110, delay: 0.6 },
    { type: 'mote', pos: 'left-[24%] bottom-[20%]', size: 5, color: 'rgba(229,101,101,0.5)', par: 140, delay: 2.2, desktopOnly: true },
  ],
  menu: [
    { type: 'glow', pos: 'left-[2%] bottom-[8%]', size: '32vw', color: 'rgba(255,76,0,0.05)', par: -30, anim: 'animate-drift' },
    { type: 'ring', pos: 'left-[8%] top-[24%]', size: 200, color: 'rgba(38,38,38,0.05)', par: 22, anim: 'animate-halo', desktopOnly: true },
    { type: 'icon', pos: 'left-[16%] bottom-[18%]', size: 38, Comp: Cheese, par: 64, opacity: 0.09, delay: 1.2, desktopOnly: true },
    { type: 'mote', pos: 'right-[10%] top-[20%]', size: 6, color: 'rgba(255,76,0,0.45)', par: 120, delay: 0.4, desktopOnly: true },
  ],
  signature: [
    { type: 'ring', pos: 'left-[12%] top-[20%]', size: 160, color: 'rgba(255,76,0,0.08)', par: 18, anim: 'animate-halo', desktopOnly: true },
    { type: 'mote', pos: 'right-[14%] top-[26%]', size: 6, color: 'rgba(255,76,0,0.5)', par: 100, delay: 0.8 },
    { type: 'mote', pos: 'left-[18%] bottom-[24%]', size: 5, color: 'rgba(229,101,101,0.5)', par: 130, delay: 2.4, desktopOnly: true },
  ],
  why: [
    { type: 'glow', pos: 'right-[6%] top-[14%]', size: '30vw', color: 'rgba(229,101,101,0.05)', par: -30, anim: 'animate-light-shift' },
    { type: 'ring', pos: 'left-[10%] bottom-[16%]', size: 170, color: 'rgba(255,76,0,0.09)', par: 24, anim: 'animate-halo', desktopOnly: true },
    { type: 'icon', pos: 'right-[18%] bottom-[22%]', size: 36, Comp: Pepperoni, par: 72, opacity: 0.1, delay: 1.6, desktopOnly: true },
    { type: 'mote', pos: 'left-[36%] top-[24%]', size: 6, color: 'rgba(255,76,0,0.45)', par: 116, delay: 0.5 },
  ],
  ending: [
    { type: 'mote', pos: 'left-[30%] bottom-[18%]', size: 6, color: 'rgba(255,76,0,0.5)', par: 90, delay: 0.4 },
    { type: 'mote', pos: 'right-[28%] bottom-[26%]', size: 5, color: 'rgba(229,101,101,0.5)', par: 120, delay: 1.8, desktopOnly: true },
    { type: 'icon', pos: 'left-[18%] top-[30%]', size: 34, Comp: Olive, par: 60, opacity: 0.08, delay: 1, desktopOnly: true },
  ],
  footer: [
    { type: 'glow', pos: 'left-1/2 -translate-x-1/2 bottom-[2%]', size: '40vw', color: 'rgba(255,76,0,0.05)', anim: 'animate-light-shift' },
    { type: 'mote', pos: 'left-[22%] top-[30%]', size: 5, color: 'rgba(255,76,0,0.4)', delay: 0.6, desktopOnly: true },
    { type: 'mote', pos: 'right-[24%] top-[40%]', size: 5, color: 'rgba(229,101,101,0.4)', delay: 1.6, desktopOnly: true },
  ],
}

function Inner({ d }: { d: Deco }) {
  const s = len(d.size)
  const style: CSSProperties = {
    width: s,
    height: s,
    animationDelay: d.delay ? `${d.delay}s` : undefined,
    animationDuration: d.dur ? `${d.dur}s` : undefined,
  }

  if (d.type === 'glow') {
    return <div className={`rounded-full ${d.anim ?? 'animate-drift'}`} style={{ ...style, background: `radial-gradient(circle, ${d.color} 0%, transparent 70%)`, filter: 'blur(40px)' }} />
  }
  if (d.type === 'ring') {
    return <div className={`rounded-full ${d.anim ?? 'animate-halo'}`} style={{ ...style, border: `1px solid ${d.color}` }} />
  }
  if (d.type === 'mote') {
    return <div className={d.anim ?? 'animate-float-slow'} style={{ ...style, borderRadius: '999px', background: `radial-gradient(circle, ${d.color} 0%, transparent 70%)` }} />
  }
  // icon
  const Comp = d.Comp!
  return (
    <div className={d.anim ?? 'animate-orbit'} style={{ opacity: d.opacity ?? 0.1, animationDelay: d.delay ? `${d.delay}s` : undefined }}>
      <Comp size={typeof d.size === 'number' ? d.size : 40} />
    </div>
  )
}

export default function SectionAmbient({ variant }: { variant: keyof typeof SETS }) {
  const set = SETS[variant] ?? []
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {set.map((d, i) => (
        <div
          key={i}
          data-par
          data-par-y={d.par ?? 0}
          data-px={d.px ?? 0}
          className={`absolute will-change-transform ${d.pos} ${d.desktopOnly ? 'hidden md:block' : ''}`}
        >
          <Inner d={d} />
        </div>
      ))}
    </div>
  )
}
