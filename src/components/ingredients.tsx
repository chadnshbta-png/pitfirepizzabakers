/* ──────────────────────────────────────────────────────────────────────
   Hand-drawn SVG ingredient set — crisp at any scale, no asset loading.
   Shared by the Story Transition and the Ingredient Showcase.
   ────────────────────────────────────────────────────────────────────── */
import type { CSSProperties } from 'react'

type Props = { size?: number; className?: string; style?: CSSProperties }

const base = (size: number): CSSProperties => ({
  display: 'block',
  width: size,
  height: size,
  filter: 'drop-shadow(0 14px 18px rgba(0,0,0,.55))',
})

export function Pepperoni({ size = 64, className, style }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ ...base(size), ...style }} aria-hidden>
      <circle cx="50" cy="50" r="46" fill="#B01124" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#7d0c19" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" fill="#D6263C" />
      {[[34,38,5],[64,34,4],[58,60,6],[36,62,4],[50,46,3.5],[70,54,3],[28,48,3.5],[46,68,3]].map(([x,y,r],i)=>(
        <circle key={i} cx={x} cy={y} r={r} fill="#8c0f1f" />
      ))}
      <ellipse cx="40" cy="36" rx="10" ry="6" fill="#e8536a" opacity="0.5" />
    </svg>
  )
}

export function Basil({ size = 64, className, style }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ ...base(size), ...style }} aria-hidden>
      <path d="M50 6 C20 22 14 60 30 90 C58 78 86 50 78 14 C70 22 60 28 50 30 Z" fill="#2f7d2f" />
      <path d="M50 6 C26 22 18 56 32 86 C40 60 44 36 50 30 Z" fill="#3f9c3f" />
      <path d="M48 16 C42 38 38 60 33 84" stroke="#1f5e1f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {[[44,32],[40,46],[37,60],[34,72]].map(([x,y],i)=>(
        <path key={i} d={`M${x} ${y} q9 -4 16 -10`} stroke="#1f5e1f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      ))}
    </svg>
  )
}

export function Tomato({ size = 64, className, style }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ ...base(size), ...style }} aria-hidden>
      <circle cx="50" cy="55" r="40" fill="#c81f1f" />
      <circle cx="50" cy="55" r="40" fill="none" stroke="#9c1414" strokeWidth="3" />
      <ellipse cx="38" cy="42" rx="12" ry="8" fill="#ff6b5b" opacity="0.6" />
      <g fill="#3f9c3f">
        <path d="M50 22 l7 -12 2 13 z" />
        <path d="M50 22 l-7 -12 -2 13 z" />
        <path d="M50 22 l13 -3 -6 11 z" />
        <path d="M50 22 l-13 -3 6 11 z" />
        <circle cx="50" cy="24" r="5" />
      </g>
    </svg>
  )
}

export function Olive({ size = 64, className, style }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ ...base(size), ...style }} aria-hidden>
      <ellipse cx="50" cy="50" rx="40" ry="40" fill="#1c1320" />
      <ellipse cx="50" cy="50" rx="40" ry="40" fill="none" stroke="#0c080e" strokeWidth="3" />
      <circle cx="50" cy="50" r="16" fill="#0a060c" />
      <circle cx="50" cy="50" r="16" fill="#7a1f2a" opacity="0.55" />
      <ellipse cx="40" cy="36" rx="11" ry="7" fill="#5a4a5e" opacity="0.5" />
    </svg>
  )
}

export function Cheese({ size = 64, className, style }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ ...base(size), ...style }} aria-hidden>
      <path d="M8 78 L70 18 Q78 14 84 22 L92 78 Z" fill="#f2c14e" />
      <path d="M8 78 L70 18 Q78 14 84 22 L86 40 L8 78 Z" fill="#f8d978" opacity="0.7" />
      <path d="M8 78 L92 78 L92 86 L8 86 Z" fill="#d6a02f" />
      <g fill="#d6a02f">
        <circle cx="40" cy="58" r="6" />
        <circle cx="62" cy="50" r="4.5" />
        <circle cx="54" cy="68" r="3.5" />
        <circle cx="74" cy="64" r="3" />
      </g>
    </svg>
  )
}

export type IngredientKey = 'pepperoni' | 'basil' | 'tomato' | 'olive' | 'cheese'

export const Ingredient: Record<IngredientKey, (p: Props) => React.JSX.Element> = {
  pepperoni: Pepperoni,
  basil: Basil,
  tomato: Tomato,
  olive: Olive,
  cheese: Cheese,
}
