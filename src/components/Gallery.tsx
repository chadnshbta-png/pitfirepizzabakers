'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, type MotionValue } from 'framer-motion'

const galleryImages = [
  {
    src: '/images/home-banner-02.jpg',
    alt: 'Pitfire Pizza Experience',
    top: '8%',
    left: '5%',
    width: '42%',
    rotateDeg: -3,
    zIndex: 2,
    parallaxFactor: 0.15,
    sign: 1,
  },
  {
    src: '/images/home-banner-04.jpg',
    alt: 'Artisan Pizza Craft',
    top: '4%',
    right: '4%',
    left: undefined,
    width: '38%',
    rotateDeg: 4,
    zIndex: 3,
    parallaxFactor: 0.25,
    sign: -1,
  },
  {
    src: '/images/ourstory.webp',
    alt: 'Our Story',
    top: '40%',
    left: '28%',
    width: '44%',
    rotateDeg: -1.5,
    zIndex: 4,
    parallaxFactor: 0.18,
    sign: 1,
  },
  {
    src: '/images/home-banner-03.jpg',
    alt: 'Premium Ingredients',
    bottom: '6%',
    left: '3%',
    top: undefined,
    width: '36%',
    rotateDeg: 2.5,
    zIndex: 2,
    parallaxFactor: 0.3,
    sign: -1,
  },
  {
    src: '/images/home-banner-06.jpg',
    alt: 'Pitfire Atmosphere',
    bottom: '5%',
    right: '2%',
    left: undefined,
    top: undefined,
    width: '40%',
    rotateDeg: -4,
    zIndex: 3,
    parallaxFactor: 0.2,
    sign: 1,
  },
]

// Deterministic star positions (avoids hydration mismatch)
const stars = Array.from({ length: 60 }, (_, i) => ({
  top: `${((i * 137.508) % 100).toFixed(2)}%`,
  left: `${((i * 97.317) % 100).toFixed(2)}%`,
  opacity: (((i * 0.618033) % 0.5) + 0.05).toFixed(2),
}))

interface GalleryCardProps {
  img: (typeof galleryImages)[0]
  index: number
  scrollYProgress: MotionValue<number>
}

function GalleryCard({ img, index, scrollYProgress }: GalleryCardProps) {
  const { parallaxFactor, sign, rotateDeg } = img

  const yPct = useTransform(
    scrollYProgress,
    [0, 1],
    [`${sign * parallaxFactor * 60}%`, `${-sign * parallaxFactor * 60}%`]
  )

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [rotateDeg, rotateDeg * 0.3, rotateDeg * -0.5]
  )

  return (
    <motion.div
      className="absolute group cursor-pointer"
      style={{
        top: img.top,
        bottom: img.bottom,
        left: img.left,
        right: img.right,
        width: img.width,
        y: yPct,
        rotate,
        zIndex: img.zIndex,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.2, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04, zIndex: 10 }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          boxShadow: '0 30px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Corner accents — visible on hover */}
        <div className="absolute top-0 left-0 w-6 h-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-primary" />
          <div className="absolute top-0 left-0 h-full w-0.5 bg-primary" />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 right-0 w-full h-0.5 bg-primary" />
          <div className="absolute bottom-0 right-0 h-full w-0.5 bg-primary" />
        </div>

        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-105"
          style={{ aspectRatio: '4/3', display: 'block' }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Label */}
        <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="font-josefin text-[8px] tracking-[0.4em] uppercase text-white/70">
            {img.alt}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const outerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start end', 'end start'],
  })

  // Desktop (≥1024) keeps the floating "universe". Phones + tablets get a
  // clean stacked gallery so the images aren't tiny/sparse/scattered.
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const calc = () => setIsDesktop(window.innerWidth >= 1024)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return (
    <section
      id="gallery"
      ref={outerRef}
      className="relative bg-black py-32 md:py-40 overflow-hidden"
      style={isDesktop ? { minHeight: '180vh' } : undefined}
    >
      {/* Deep space atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-primary/3 rounded-full blur-[120px]" />
        {/* Deterministic stars */}
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{ top: star.top, left: star.left, opacity: Number(star.opacity) }}
          />
        ))}
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* Section header */}
        <div ref={titleRef} className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={titleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="section-divider" />
            <span className="font-josefin text-[9px] tracking-[0.5em] uppercase text-primary">
              Gallery
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              animate={titleInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-cormorant font-light text-white leading-none"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
            >
              The Pitfire
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
              Universe
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-josefin text-[10px] tracking-[0.4em] uppercase text-white/30 mt-4"
          >
            A world of craft · floating in space
          </motion.p>
        </div>
      </div>

      {/* Floating image universe — desktop only */}
      {isDesktop ? (
        <div
          className="relative mx-auto"
          style={{ height: '100vh', maxWidth: '1400px' }}
        >
          {galleryImages.map((img, i) => (
            <GalleryCard
              key={img.src}
              img={img}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      ) : (
        /* Mobile / tablet — clean stacked gallery (premium, no overlap) */
        <div className="max-w-screen-md mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-12%' }}
              transition={{ duration: 0.9, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-2xl"
              style={{ boxShadow: '0 30px 70px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.05)' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="block w-full h-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
              <span className="absolute bottom-3 left-4 font-josefin text-[8px] tracking-[0.4em] uppercase text-white/70">
                {img.alt}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom label */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 mt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-6"
        >
          <span className="block w-16 h-px bg-white/10" />
          <span className="font-josefin text-[8px] tracking-[0.5em] uppercase text-white/20">
            Crafted with passion · Every day · Dubai
          </span>
          <span className="block w-16 h-px bg-white/10" />
        </motion.div>
      </div>
    </section>
  )
}
