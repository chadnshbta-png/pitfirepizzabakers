'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { heroPizza } from '@/data/menuItems'
import SectionAmbient from './SectionAmbient'

export default function CinematicEnding() {
  const ref = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const inView = useInView(textRef, { once: true, margin: '-20%' })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const pizzaY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const pizzaScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.04, 0.98])

  return (
    <section ref={ref} className="relative isolate bg-background h-[110vh] overflow-hidden flex items-center justify-center">
      <SectionAmbient variant="ending" />
      {/* warm light from above — drifts + breathes so the scene feels alive */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 -top-[20vh] w-[120vw] h-[120vh] rounded-full animate-light-shift"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,76,0,0.12) 0%, rgba(229,101,101,0.06) 35%, rgba(249,249,249,0) 60%)' }} />
        <div className="absolute inset-0 animate-drift" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(255,150,80,0.07), transparent 45%)' }} />
      </div>

      {/* steam plumes — faint warm vapour over the light stage */}
      <div className="absolute left-1/2 top-[28%] -translate-x-1/2 pointer-events-none z-10">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="steam-plume absolute bottom-0 rounded-full"
            style={{
              left: `${(i - 1.5) * 46}px`,
              width: `${28 + i * 6}px`,
              height: `${90 + i * 20}px`,
              background: 'rgba(38,38,38,0.07)',
              animationDelay: `${i * 1.1}s`,
            }}
          />
        ))}
      </div>

      {/* slowly turning pizza */}
      <motion.div
        style={{ y: pizzaY, scale: pizzaScale }}
        className="relative z-20 flex items-center justify-center"
      >
        {/* idle vertical float wraps the whole product group */}
        <div className="relative flex items-center justify-center animate-float-slow">
          <div className="absolute rounded-full animate-breathe"
            style={{ width: 'min(80vw,640px)', height: 'min(80vw,640px)', background: 'radial-gradient(circle, rgba(255,76,0,0.18), transparent 60%)' }} />
          <img
            src={heroPizza}
            alt="Pizza Hut — made to be shared"
            className="relative w-[78vw] max-w-[520px] product-shadow animate-spin-slow"
            style={{ animationDuration: '85s' }}
          />
        </div>
      </motion.div>

      {/* headline */}
      <div ref={textRef} className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-josefin text-[10px] tracking-[0.55em] uppercase text-primary mb-7"
        >
          The Last Slice
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-cormorant font-semibold text-ink leading-[0.92] tracking-tight"
          style={{ fontSize: 'clamp(3rem,11vw,9rem)', textShadow: '0 20px 60px rgba(38,38,38,0.12)' }}
        >
          Made To<br />Be <em className="italic font-light text-primary">Shared</em>
        </motion.h2>
      </div>

      {/* floor fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-40" />
    </section>
  )
}
