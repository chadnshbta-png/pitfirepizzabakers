'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { heroPizza } from '@/data/menuItems'
import SectionAmbient from './SectionAmbient'

export default function CinematicEnding() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const pizzaY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const pizzaScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 0.98])

  // ── scroll-driven headline — line-by-line clip-rise, depth settle, parallax ──
  const headY = useTransform(scrollYProgress, [0, 1], [44, -44])         // gentle parallax
  const settleO = useTransform(scrollYProgress, [0.84, 1], [1, 0.5])     // depth fade as it leaves
  const settleS = useTransform(scrollYProgress, [0.84, 1], [1, 0.965])
  const ebO = useTransform(scrollYProgress, [0.08, 0.2], [0, 1])
  const ebY = useTransform(scrollYProgress, [0.08, 0.2], [20, 0])
  const l1Y = useTransform(scrollYProgress, [0.14, 0.36], ['115%', '0%'])
  const l1O = useTransform(scrollYProgress, [0.14, 0.36], [0, 1])
  const l2Y = useTransform(scrollYProgress, [0.22, 0.46], ['115%', '0%'])
  const l2O = useTransform(scrollYProgress, [0.22, 0.46], [0, 1])
  const tailO = useTransform(scrollYProgress, [0.36, 0.58], [0, 1])
  const tailY = useTransform(scrollYProgress, [0.36, 0.58], [28, 0])

  return (
    <section ref={ref} className="relative isolate bg-background min-h-[110vh] overflow-hidden flex items-center">
      <SectionAmbient variant="ending" />
      {/* warm light from above — drifts + breathes so the scene feels alive */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 -top-[20vh] w-[120vw] h-[120vh] rounded-full animate-light-shift"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,76,0,0.12) 0%, rgba(229,101,101,0.06) 35%, rgba(249,249,249,0) 60%)' }} />
        <div className="absolute inset-0 animate-drift" style={{ background: 'radial-gradient(circle at 65% 46%, rgba(255,150,80,0.07), transparent 45%)' }} />
      </div>

      {/* ── editorial split composition — copy and product hold their own space ── */}
      <div className="relative z-20 w-full max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20
                      grid grid-cols-1 md:grid-cols-12 items-center gap-10 md:gap-8">

        {/* copy — left on desktop, below the pizza on mobile.
            The headline reveals line-by-line as you scroll, settles into depth as
            the section leaves, and drifts with a slow parallax — alive, not static. */}
        <motion.div
          style={reduce ? undefined : { y: headY, opacity: settleO, scale: settleS }}
          className="order-2 md:order-1 md:col-span-6 lg:col-span-5 text-center md:text-left"
        >
          <motion.span
            style={reduce ? undefined : { opacity: ebO, y: ebY }}
            className="block font-josefin text-[10px] tracking-[0.55em] uppercase text-primary mb-6"
          >
            The Last Slice
          </motion.span>
          <h2 className="font-cormorant font-semibold text-ink leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(3rem,7vw,6.8rem)', textShadow: '0 20px 60px rgba(38,38,38,0.10)' }}>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span style={reduce ? undefined : { y: l1Y, opacity: l1O }} className="block will-change-transform">
                Made to be
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] pr-[0.12em]">
              <motion.span style={reduce ? undefined : { y: l2Y, opacity: l2O }} className="block italic font-light text-primary will-change-transform">
                Shared.
              </motion.span>
            </span>
          </h2>
          <motion.div style={reduce ? undefined : { opacity: tailO, y: tailY }}>
            <p className="italic text-ink/55 leading-relaxed mt-7 mb-9 mx-auto md:mx-0 max-w-md"
              style={{ fontSize: 'clamp(1.05rem,1.4vw,1.3rem)' }}>
              Hand-stretched, fire-baked and meant for the middle of the table. Since 1958 — more than just the pizza.
            </p>
            <a
              href="#menu"
              onClick={(e) => { e.preventDefault(); document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="btn-depth btn-primary inline-flex items-center gap-3 px-9 py-4 font-josefin text-[10px] tracking-[0.4em] uppercase"
            >
              Explore the Menu
              <span className="w-5 h-px bg-white/60" />
            </a>
          </motion.div>
        </motion.div>

        {/* product — right on desktop, top on mobile */}
        <div className="order-1 md:order-2 md:col-span-6 lg:col-start-7 lg:col-span-6 relative flex justify-center md:justify-end">
          <motion.div style={{ y: pizzaY, scale: pizzaScale }} className="relative flex items-center justify-center">
            <div className="relative flex items-center justify-center animate-float-slow">
              {/* steam plumes rising off the product */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[14%] pointer-events-none z-10">
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
              <div className="absolute rounded-full animate-breathe"
                style={{ width: 'min(74vw,560px)', height: 'min(74vw,560px)', background: 'radial-gradient(circle, rgba(255,76,0,0.18), transparent 60%)' }} />
              <img
                src={heroPizza}
                alt="Pizza Hut — made to be shared"
                draggable={false}
                className="relative w-[72vw] md:w-[42vw] max-w-[480px] object-contain product-shadow animate-spin-slow"
                style={{ animationDuration: '85s' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* floor fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-30" />
    </section>
  )
}
