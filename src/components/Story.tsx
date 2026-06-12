'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TYPEWRITER = 'PIZZA IS A SIMPLE FOOD.\nDOUGH, TOMATOES, CHEESE, TOPPINGS.'

export default function Story() {
  // ── Per-block element refs ──
  const block1 = useRef<HTMLDivElement>(null)
  const text1  = useRef<HTMLDivElement>(null)
  const vid1   = useRef<HTMLDivElement>(null)

  const block2 = useRef<HTMLDivElement>(null)
  const text2  = useRef<HTMLDivElement>(null)
  const vid2   = useRef<HTMLDivElement>(null)

  const block3 = useRef<HTMLDivElement>(null)
  const text3  = useRef<HTMLDivElement>(null)
  const vid3   = useRef<HTMLDivElement>(null)

  const bodyRef = useRef<HTMLParagraphElement>(null)

  // ── Typewriter state ──
  const [typeOutput, setTypeOutput] = useState('')
  const [typeComplete, setTypeComplete] = useState(false)

  // Start typewriter when block 1 enters viewport
  useEffect(() => {
    if (!block1.current) return
    const el = block1.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        let i = 0
        const id = setInterval(() => {
          i++
          setTypeOutput(TYPEWRITER.slice(0, i))
          if (i >= TYPEWRITER.length) {
            clearInterval(id)
            setTypeComplete(true)
          }
        }, 38)
      },
      { rootMargin: '-6% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Fade in body paragraph once typewriter finishes
  useEffect(() => {
    if (!typeComplete || !bodyRef.current) return
    const el = bodyRef.current
    el.style.transition = 'opacity 1.1s ease 0.1s, transform 1.1s ease 0.1s'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0px)'
  }, [typeComplete])

  // ── GSAP ScrollTrigger — scrubbed parallax for all 3 blocks ──
  useEffect(() => {
    // Apply initial hidden states before any scroll fires
    ;[text1, text2, text3].forEach(r => {
      if (!r.current) return
      gsap.set(r.current, { opacity: 0, y: 40 })
    })
    ;[vid1, vid2, vid3].forEach(r => {
      if (!r.current) return
      gsap.set(r.current, { y: 80 })
    })

    const sts: ReturnType<typeof ScrollTrigger.create>[] = []

    const blocks = [
      { trigger: block1, text: text1, vid: vid1 },
      { trigger: block2, text: text2, vid: vid2 },
      { trigger: block3, text: text3, vid: vid3 },
    ]

    blocks.forEach(({ trigger, text, vid }) => {
      if (!trigger.current || !text.current || !vid.current) return
      const t = text.current
      const v = vid.current

      sts.push(
        ScrollTrigger.create({
          trigger: trigger.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
          onUpdate(self) {
            const p = self.progress
            // Text: fade up — opacity 0→1, translateY 40→0
            gsap.set(t, { opacity: p, y: 40 - p * 40 })
            // Video: slower parallax — translateY 80→20 (moves less distance than text)
            gsap.set(v, { y: 80 - p * 60 })
          },
        })
      )
    })

    return () => sts.forEach(st => st.kill())
  }, [])

  const typeLines = typeOutput.split('\n')
  const textPad   = 'flex flex-col justify-center px-10 md:px-16 lg:px-20 xl:px-24 py-28 lg:py-0'
  const vidHeight = 'min-h-[56vw] md:min-h-[44vw] lg:min-h-0'

  return (
    <section id="story" className="relative bg-black overflow-hidden">

      {/* ── BLOCK 1 — Text LEFT · Video RIGHT ── */}
      <div ref={block1} className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* Text column */}
        <div className={textPad}>
          {/* Inner wrapper gets GSAP transform */}
          <div ref={text1} style={{ willChange: 'transform, opacity' }}>

            {/* Typewriter headline */}
            <div className="mb-10 min-h-[3.6em]">
              {typeLines.map((line, i) => (
                <p
                  key={i}
                  className="font-josefin text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white/70 leading-loose"
                >
                  {line}
                  {/* Blinking cursor — only on the last typed line while incomplete */}
                  {i === typeLines.length - 1 && !typeComplete && (
                    <span className="text-primary">|</span>
                  )}
                </p>
              ))}
            </div>

            {/* Body — starts hidden, fades in when typewriter finishes */}
            <p
              ref={bodyRef}
              className="font-cormorant text-2xl md:text-3xl font-light text-white/62 leading-relaxed max-w-[520px]"
              style={{ opacity: 0, transform: 'translateY(16px)', willChange: 'transform, opacity' }}
            >
              But in the forty years we've been passionate about pizza the one
              thing we've learned is that the perfect pizza is not just a recipe
              — it's an ever-evolving quest for perfection.
            </p>
          </div>
        </div>

        {/* Video column */}
        <div className={`relative overflow-hidden ${vidHeight}`}>
          {/* Extended wrapper — protrudes top/bottom so translateY never shows gaps */}
          <div
            ref={vid1}
            className="absolute left-0 right-0"
            style={{ top: '-15%', bottom: '-15%', willChange: 'transform' }}
          >
            <video
              src="/video/Pressing-Dough.mp4"
              autoPlay muted loop playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/22 pointer-events-none" />
        </div>
      </div>

      {/* ── BLOCK 2 — Video LEFT · Text RIGHT ── */}
      <div ref={block2} className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* Video — shown below text on mobile for reading order */}
        <div className={`relative overflow-hidden order-last lg:order-first ${vidHeight}`}>
          <div
            ref={vid2}
            className="absolute left-0 right-0"
            style={{ top: '-15%', bottom: '-15%', willChange: 'transform' }}
          >
            <video
              src="/video/Italian-Tomatoes.mp4"
              autoPlay muted loop playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/28 pointer-events-none" />
        </div>

        {/* Text column */}
        <div className={textPad}>
          <div ref={text2} style={{ willChange: 'transform, opacity' }}>
            <p className="font-josefin text-[9px] tracking-[0.55em] uppercase text-primary mb-7">
              Our Style
            </p>
            <p className="font-cormorant text-2xl md:text-3xl font-light text-white/80 leading-relaxed max-w-[520px] mb-7">
              Our pizza style is not quite Neapolitan, not quite New York — but
              somewhere perfectly in between.
            </p>
            <p className="font-cormorant text-xl md:text-2xl font-light text-white/45 leading-relaxed max-w-[520px]">
              Our 72 Hour artisan doughmaking process takes place daily in small
              batches. This long ferment produces wonderful crust aroma, texture
              and mouth feel — and makes every bite highly digestible.
            </p>
          </div>
        </div>
      </div>

      {/* ── BLOCK 3 — Text LEFT · Video RIGHT ── */}
      <div ref={block3} className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* Text column */}
        <div className={textPad}>
          <div ref={text3} style={{ willChange: 'transform, opacity' }}>
            <p className="font-josefin text-[9px] tracking-[0.55em] uppercase text-primary mb-7">
              The Promise
            </p>
            <p className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-light text-white/88 leading-[1.15] max-w-[520px] mb-8">
              You'll never feel sick, tired and too full after eating a Pitfire Pizza.
            </p>
            <p className="font-cormorant text-xl md:text-2xl font-light text-white/45 leading-relaxed max-w-[480px]">
              We go to great lengths to ensure that every experience delivers
              freshness, value, and craft.
            </p>
          </div>
        </div>

        {/* Video column */}
        <div className={`relative overflow-hidden ${vidHeight}`}>
          <div
            ref={vid3}
            className="absolute left-0 right-0"
            style={{ top: '-15%', bottom: '-15%', willChange: 'transform' }}
          >
            <video
              src="/video/Pressing-Dough.mp4"
              autoPlay muted loop playsInline
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.72) saturate(0.78)' }}
            />
          </div>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>
      </div>

    </section>
  )
}
