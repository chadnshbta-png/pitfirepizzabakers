'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

type Chapter = {
  year: string
  kicker: string
  title: string
  body: string
  image: string
}

const CHAPTERS: Chapter[] = [
  {
    year: '1958',
    kicker: 'The Origin',
    title: 'Two Brothers, One Oven',
    body: 'It began in May 1958, when Dan and Frank Carney opened a 550-square-foot restaurant in Wichita, Kansas. They made every pizza by hand — Frank rolling the dough, Dan filling the crust with sauce — while a captivated crowd watched the dough fly overhead.',
    image: '/images/our_story_1.png',
  },
  {
    year: '1959',
    kicker: 'The Craft',
    title: 'A Place for Great Ideas',
    body: 'Pizza Hut was always entrepreneurial and fast-thinking — a place where everyone shared the learning. As Frank Carney put it, the brand’s greatest strength was “an awful lot of people who came up with great ideas.” By 1963 there were forty-two restaurants.',
    image: '/images/our_story_2.jpg',
  },
  {
    year: '1980',
    kicker: 'The Quality',
    title: 'The Birth of Pan Pizza',
    body: 'In 1980 we introduced Pan Pizza across the network — a thicker crust baked in deep pans that quickly became iconic. The recipe evolved, but the philosophy never did: use real ingredients, and make every pie worth the wait.',
    image: '/images/our_story_3.jpg',
  },
  {
    year: 'Today',
    kicker: 'The Promise',
    title: 'More Than Just the Pizza',
    body: 'The philosophy was, and still is, “take care of the customer.” Generosity, hard work, friendship, innovation and fun — that experience lives in every box we hand over. It was, and always will be, more than just the pizza.',
    image: '/images/ourstory.webp',
  },
]

export default function AboutExperience() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    const mAmp = mobile ? 0.45 : 1

    const pfx = gsap.utils.toArray<HTMLElement>('[data-pfx]', root).map((el) => ({
      el,
      speed: parseFloat(el.dataset.speed || '0'),
      img: el.dataset.img === '1',
      fade: el.dataset.fade === '1',
    }))

    if (reduce) {
      pfx.forEach((p) => { if (p.fade) p.el.style.opacity = '1' })
      return
    }

    const update = () => {
      const h = window.innerHeight
      const vc = h / 2
      for (const it of pfx) {
        const r = it.el.getBoundingClientRect()
        if (r.bottom < -300 || r.top > h + 300) continue
        const q = clamp((r.top + r.height / 2 - vc) / h, -1.1, 1.1)
        if (it.img) {
          gsap.set(it.el, { yPercent: q * it.speed * mAmp, force3D: true })
        } else {
          gsap.set(it.el, { y: q * it.speed * mAmp, force3D: true })
          if (it.fade) it.el.style.opacity = String(clamp((0.85 - q) / 0.45, 0, 1))
        }
      }
    }

    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative bg-black overflow-x-clip pt-[16vh] pb-[14vh]"
    >
      {/* clean top edge — establishes a clear break from the Hero */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Section intro */}
      <div className="text-center px-6 mb-[11vh] md:mb-[13vh]">
        <div data-pfx data-speed="-26" data-fade="1" className="flex items-center justify-center gap-4 mb-7" style={{ opacity: 0 }}>
          <span className="block w-10 h-px bg-primary/60" />
          <span className="font-josefin text-[10px] tracking-[0.5em] uppercase text-primary">Our Story</span>
          <span className="block w-10 h-px bg-primary/60" />
        </div>
        <h2 data-pfx data-speed="-16" data-fade="1" className="font-cormorant font-light text-white leading-[0.98]" style={{ fontSize: 'clamp(2.6rem,7vw,6rem)', opacity: 0 }}>
          The Pizza Hut Story
        </h2>
        <p data-pfx data-speed="-12" data-fade="1" className="font-cormorant italic text-white/40 mt-5 mx-auto max-w-xl" style={{ fontSize: 'clamp(1rem,1.6vw,1.3rem)', opacity: 0 }}>
          Sixty-five years of dough, ideas, and a single promise.
        </p>
      </div>

      {/* Chapters */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex flex-col gap-[12vh] md:gap-[16vh]">
        {CHAPTERS.map((c, i) => {
          const flip = i % 2 === 1
          return (
            <div
              key={c.year}
              className={`grid md:grid-cols-2 gap-9 md:gap-16 items-center ${flip ? 'md:[direction:rtl]' : ''}`}
            >
              {/* Image */}
              <div className="[direction:ltr]">
                <div
                  data-pfx data-speed={flip ? '-28' : '28'} data-fade="1"
                  className="relative rounded-2xl overflow-hidden will-change-transform"
                  style={{
                    aspectRatio: '4 / 5',
                    border: '1px solid rgba(200,16,46,0.16)',
                    boxShadow: '0 40px 90px rgba(0,0,0,0.6)',
                    opacity: 0,
                  }}
                >
                  <img
                    data-pfx data-img="1" data-speed="10"
                    src={c.image}
                    alt={c.title}
                    className="absolute inset-0 w-full h-[118%] -top-[9%] object-cover will-change-transform"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 45%)' }} />
                  <span className="absolute -bottom-2 left-3 font-cormorant font-light text-white/10 leading-none select-none pointer-events-none" style={{ fontSize: 'clamp(4rem,9vw,8rem)' }}>
                    {c.year}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="[direction:ltr]">
                <div data-pfx data-speed={flip ? '-14' : '14'} data-fade="1" style={{ opacity: 0 }}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="block w-7 h-px bg-primary" />
                    <span className="font-josefin text-[10px] tracking-[0.45em] uppercase text-white/40">
                      {c.kicker} · {c.year}
                    </span>
                  </div>
                  <h3 className="font-cormorant font-light text-white leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.1rem,4.2vw,3.4rem)' }}>
                    {c.title}
                  </h3>
                  <p className="font-cormorant text-white/55 leading-[1.85]" style={{ fontSize: 'clamp(1.02rem,1.5vw,1.25rem)', fontWeight: 300 }}>
                    {c.body}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
