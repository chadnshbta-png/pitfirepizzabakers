'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { menuItems, categories, type MenuCategory } from '@/data/menuItems'

function MenuCard({ item, index }: { item: (typeof menuItems)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8%' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: (index % 4) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative menu-card-glow cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: '800px' }}
    >
      <motion.div
        animate={
          hovered
            ? { rotateX: -4, rotateY: 4, scale: 1.02, y: -8 }
            : { rotateX: 0, rotateY: 0, scale: 1, y: 0 }
        }
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden bg-zinc-950 border border-white/5"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
          <motion.img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover block"
            animate={hovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

          {/* Hover red glow */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none"
          />

          {/* Tag badge */}
          {item.tag && (
            <div className="absolute top-3 left-3 z-10">
              <span className="font-josefin text-[7px] tracking-[0.4em] uppercase px-2.5 py-1 bg-primary/90 text-white">
                {item.tag}
              </span>
            </div>
          )}

          {/* Corner accents on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
          >
            <div className="absolute top-0 right-0 w-full h-0.5 bg-white/30" />
            <div className="absolute top-0 right-0 h-full w-0.5 bg-white/30" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-cormorant text-lg text-white font-light leading-tight group-hover:text-white transition-colors">
                {item.name}
              </h3>
              <p className="font-josefin text-[8px] tracking-[0.3em] uppercase text-white/30 mt-1">
                {item.category}
              </p>
            </div>
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 4 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 w-6 h-6 flex items-center justify-center border border-white/10 mt-0.5"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 7L7 1M7 1H2M7 1V6" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
              </svg>
            </motion.div>
          </div>

          <motion.p
            animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-sm text-white/40 italic overflow-hidden mt-2"
          >
            {item.description}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All')
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  const filtered =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  return (
    <section id="menu" className="relative bg-black py-32 md:py-40 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[120px]" />
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
              The Menu
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
                  Crafted with
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
                  Obsession.
                </motion.h2>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-cormorant text-lg text-white/40 italic max-w-xs"
            >
              Every item house-made. Every day. No exceptions.
            </motion.p>
          </div>
        </div>

        {/* ── Category Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-1 mb-12 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative font-josefin text-[9px] tracking-[0.35em] uppercase px-5 py-2.5 whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-white bg-primary'
                  : 'text-white/40 border border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── Items Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filtered.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 pt-16 border-t border-white/5 text-center"
        >
          <p className="font-cormorant text-2xl text-white/40 italic mb-6">
            Sweet Italian fennel sausage, all desserts, dressings and most toppings
            <br />are house-made daily.
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="block w-8 h-px bg-primary/50" />
            <span className="font-josefin text-[9px] tracking-[0.5em] uppercase text-white/20">
              Made fresh · Every day
            </span>
            <span className="block w-8 h-px bg-primary/50" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
