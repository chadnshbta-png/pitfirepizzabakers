'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { locations } from '@/data/locations'

function LocationCard({
  loc,
  index,
}: {
  loc: (typeof locations)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8%' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -1 : 1 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{
        duration: 1,
        delay: (index % 3) * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{
          boxShadow: hovered
            ? '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(209,38,38,0.2)'
            : '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <motion.img
            src={loc.image}
            alt={loc.name}
            className="w-full h-full object-cover block"
            animate={hovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          {/* Location number */}
          <div className="absolute top-4 right-4 font-cormorant text-5xl text-white/10 font-light leading-none select-none">
            0{index + 1}
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            {/* Name */}
            <div className="overflow-hidden">
              <motion.h3
                animate={hovered ? { y: -4 } : { y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-cormorant text-3xl text-white font-light leading-none"
              >
                {loc.name}
              </motion.h3>
            </div>

            {/* Address */}
            <motion.p
              animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? -2 : 0 }}
              transition={{ duration: 0.4 }}
              className="font-josefin text-[9px] tracking-[0.3em] uppercase text-white/50 mt-2"
            >
              {loc.address}
            </motion.p>

            {/* CTA button — reveals on hover */}
            <motion.div
              animate={{
                opacity: hovered ? 1 : 0,
                y: hovered ? 0 : 12,
                height: hovered ? 'auto' : 0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mt-4"
            >
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-3 font-josefin text-[9px] tracking-[0.4em] uppercase px-5 py-3 bg-primary text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                View Location
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 7L7 1M7 1H2M7 1V6" stroke="currentColor" strokeWidth="1" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* Red corner accent on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 w-10 h-10 pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-full h-0.5 bg-primary" />
            <div className="absolute top-0 left-0 h-full w-0.5 bg-primary" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Locations() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  return (
    <section id="locations" className="relative bg-black py-32 md:py-40 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/3 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div ref={titleRef} className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={titleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="section-divider" />
            <span className="font-josefin text-[9px] tracking-[0.5em] uppercase text-primary">
              Locations
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: '100%' }}
                  animate={titleInView ? { y: 0 } : {}}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-cormorant font-light text-white leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
                >
                  Find Your
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: '100%' }}
                  animate={titleInView ? { y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-cormorant italic text-primary leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
                >
                  Nearest Pitfire.
                </motion.h2>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={titleInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="font-josefin text-[9px] tracking-[0.35em] uppercase text-white/30">
                {locations.length} Locations
              </span>
              <span className="block w-8 h-px bg-white/10" />
              <span className="font-josefin text-[9px] tracking-[0.35em] uppercase text-white/30">
                UAE
              </span>
            </motion.div>
          </div>
        </div>

        {/* ── Location Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {locations.map((loc, i) => (
            <LocationCard key={loc.id} loc={loc} index={i} />
          ))}
        </div>

        {/* ── Bottom note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-16 pt-12 border-t border-white/5 flex items-center justify-between"
        >
          <div>
            <p className="font-josefin text-[9px] tracking-[0.4em] uppercase text-white/20 mb-1">
              Open Daily
            </p>
            <p className="font-cormorant text-lg text-white/40 italic">
              Lunch & Dinner · All locations
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="font-josefin text-[9px] tracking-[0.35em] uppercase text-white/20">
              More locations coming soon
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
