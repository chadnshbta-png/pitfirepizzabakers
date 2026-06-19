'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Tomato, Cheese, Basil, Pepperoni } from './ingredients'

type Ing = {
  Comp: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  name: string
  note: string
  tint: string
}
const INGS: Ing[] = [
  { Comp: Tomato,    name: 'Vine Tomatoes', note: 'Sun-ripened and crushed for our signature sauce.', tint: 'rgba(200,16,46,0.18)' },
  { Comp: Cheese,    name: 'Mozzarella',    note: 'Stretched fresh, melted to a golden, endless pull.', tint: 'rgba(242,193,78,0.16)' },
  { Comp: Basil,     name: 'Garden Basil',  note: 'Hand-picked leaves, torn over the heat of the oven.', tint: 'rgba(63,156,63,0.16)' },
  { Comp: Pepperoni, name: 'Pepperoni',     note: 'Cured slow, sliced thin, curled crisp in the bake.',  tint: 'rgba(176,17,36,0.18)' },
]

const ease = [0.16, 1, 0.3, 1] as const

export default function IngredientShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const headInView = useInView(ref, { once: true, margin: '-12%' })
  const gridRef = useRef<HTMLDivElement>(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-12%' })

  return (
    <section id="ingredients" className="relative bg-black overflow-x-clip py-[14vh]">
      {/* clean top edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* single soft ambient pool */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[440px] bg-primary/[0.05] rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 relative">
        {/* intro */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">The Source</span>
          <h2 className="font-cormorant font-light text-white leading-[1] mt-4" style={{ fontSize: 'clamp(2.2rem,6vw,5rem)' }}>
            Only Premium <em className="italic text-primary">Ingredients</em>
          </h2>
          <p className="font-cormorant italic text-white/40 mt-5 mx-auto max-w-xl" style={{ fontSize: 'clamp(1rem,1.6vw,1.25rem)' }}>
            Four things we refuse to compromise on.
          </p>
        </motion.div>

        {/* grid — each ingredient reveals individually */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7">
          {INGS.map((ing, i) => (
            <motion.article
              key={ing.name}
              initial={{ opacity: 0, y: 40 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
              whileHover={{ y: -6 }}
              className="glass-strong rounded-3xl p-7 md:p-9 flex items-center gap-6 md:gap-8 relative overflow-hidden group"
            >
              <span className="absolute top-5 right-7 font-cormorant font-light text-white/[0.06] leading-none" style={{ fontSize: 'clamp(2.6rem,5vw,4rem)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="absolute top-0 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-700" />

              {/* visual */}
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: 'clamp(90px,16vw,140px)', height: 'clamp(90px,16vw,140px)' }}>
                <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${ing.tint} 0%, transparent 68%)` }} />
                <ing.Comp size={120} style={{ width: '78%', height: 'auto' }} />
              </div>

              {/* meta */}
              <div className="min-w-0">
                <h3 className="font-cormorant font-light text-white leading-tight" style={{ fontSize: 'clamp(1.5rem,2.6vw,2.2rem)' }}>
                  {ing.name}
                </h3>
                <div className="my-3 h-px w-10 bg-primary/70" />
                <p className="font-cormorant italic text-white/45 leading-snug" style={{ fontSize: 'clamp(.95rem,1.4vw,1.15rem)' }}>
                  {ing.note}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
