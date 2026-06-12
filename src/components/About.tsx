'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '72',    label: 'Hour Process' },
  { value: '40',    label: 'Years of Passion' },
  { value: '100%',  label: 'House-Made Daily' },
  { value: 'Small', label: 'Batch Crafted' },
  { value: 'Local', label: 'Fresh Mozzarella' },
]

export default function About() {
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef  = useRef<HTMLDivElement>(null)

  const headerInView = useInView(headerRef, { once: true, margin: '-10% 0px' })
  const statsInView  = useInView(statsRef,  { once: true, margin: '-10% 0px' })

  return (
    <section
      id="about"
      className="relative bg-black py-36 md:py-48 overflow-hidden"
    >
      {/* Ambient glow — barely visible, just enough to lift the black */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-primary/[0.04] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">

        {/* Section label */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 14 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-24 md:mb-32"
        >
          <span className="block w-8 h-px bg-primary/50" />
          <span className="font-josefin text-[9px] tracking-[0.55em] uppercase text-white/30">
            Our Craft
          </span>
        </motion.div>

        {/* Stats — horizontal on desktop, 2-col on tablet, stacked on mobile */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.95,
                delay: i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={[
                'flex flex-col gap-4 py-10 lg:py-0',
                // Left padding — none on first item, consistent on rest
                i === 0 ? 'pr-8 lg:pr-10' : 'px-8 lg:px-10',
                // Vertical separators on desktop only
                i > 0 ? 'lg:border-l lg:border-white/[0.07]' : '',
                // Horizontal separators on mobile grid
                i >= 2 ? 'border-t border-white/[0.06] lg:border-t-0' : '',
              ].join(' ')}
            >
              <span
                className="font-cormorant font-light text-primary leading-none"
                style={{ fontSize: 'clamp(3rem, 5.5vw, 5rem)' }}
              >
                {stat.value}
              </span>
              <span className="font-josefin text-[8px] tracking-[0.45em] uppercase text-white/35 leading-relaxed">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
