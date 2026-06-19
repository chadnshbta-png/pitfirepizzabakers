'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Card = { num: string; title: string; line: string; icon: React.JSX.Element }

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const CARDS: Card[] = [
  {
    num: '01',
    title: 'Fresh Daily',
    line: 'Dough proofed and stretched by hand every single morning.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" {...stroke}>
        <path d="M24 6c3 6-2 8-2 12a6 6 0 0012 0c0-2-1-4-2-5 4 2 8 7 8 14a16 16 0 01-32 0c0-9 8-13 16-21z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Fast Delivery',
    line: 'Hot, boxed and at your door before the cheese settles.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" {...stroke}>
        <circle cx="14" cy="34" r="5" />
        <circle cx="35" cy="34" r="5" />
        <path d="M19 34h11M6 16h9l5 13M30 20h7l5 8v6h-3" />
        <path d="M15 16l2 6" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Premium Ingredients',
    line: 'Real cheese, vine tomatoes and toppings worth the wait.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" {...stroke}>
        <path d="M24 8C16 8 8 14 8 22c0 10 10 18 16 18s16-8 16-18c0-8-8-14-16-14z" />
        <path d="M24 8c0 6 6 8 12 10M24 40c0-8-6-12-14-14" />
        <circle cx="20" cy="22" r="1.6" />
        <circle cx="29" cy="26" r="1.6" />
        <circle cx="25" cy="18" r="1.6" />
      </svg>
    ),
  },
]

export default function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section className="relative bg-black py-[16vh] overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[420px] bg-primary/[0.05] rounded-full blur-[170px] pointer-events-none" />

      <div ref={ref} className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 md:mb-28"
        >
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">Why Pizza Hut</span>
          <h2 className="font-cormorant font-light text-white leading-[0.98] mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)' }}>
            Made the <em className="italic text-primary">Right</em> Way
          </h2>
        </motion.div>

        {/* cards — emerge from Z depth */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8" style={{ perspective: '1600px' }}>
          {CARDS.map((c, i) => (
            <motion.div
              key={c.num}
              initial={{ opacity: 0, z: -260, rotateX: 12, y: 56 }}
              animate={inView ? { opacity: 1, z: 0, rotateX: 0, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.4 } }}
              className="glass-strong rounded-3xl p-9 md:p-11 relative overflow-hidden group preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* corner number */}
              <span className="absolute top-6 right-7 font-cormorant font-light text-white/10 leading-none" style={{ fontSize: 'clamp(3rem,5vw,4.5rem)' }}>
                {c.num}
              </span>
              {/* top accent line grows on hover */}
              <span className="absolute top-0 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-700" />

              <div className="text-primary mb-8">{c.icon}</div>
              <h3 className="font-cormorant font-light text-white mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                {c.title}
              </h3>
              <p className="font-cormorant text-white/50 leading-[1.7]" style={{ fontSize: 'clamp(1rem,1.4vw,1.15rem)', fontWeight: 300 }}>
                {c.line}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
