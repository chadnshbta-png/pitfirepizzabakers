'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imagesRef    = useRef<HTMLImageElement[]>([])
  const titleRef     = useRef<HTMLDivElement>(null)
  const subtitleRef  = useRef<HTMLDivElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const hintRef      = useRef<HTMLDivElement>(null)
  const vignetteRef  = useRef<HTMLDivElement>(null)

  const [loadProgress, setLoadProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // ── Load all frames from API ──
  useEffect(() => {
    fetch('/api/frames')
      .then(r => r.json())
      .then(({ files }: { files: string[] }) => {
        const total = files.length
        const imgs: HTMLImageElement[] = new Array(total)
        let done = 0
        files.forEach((file, i) => {
          const img = new Image()
          img.src = `/frame/${file}`
          img.onload = img.onerror = () => {
            done++
            setLoadProgress(Math.round((done / total) * 100))
            if (done === total) setLoaded(true)
          }
          imgs[i] = img
        })
        imagesRef.current = imgs
      })
  }, [])

  // ── GSAP ScrollTrigger pin + scrub ──
  useEffect(() => {
    if (!loaded) return

    const canvas      = canvasRef.current!
    const section     = sectionRef.current!
    const images      = imagesRef.current
    const totalFrames = images.length
    if (!canvas || !section || !totalFrames) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function draw(i: number) {
      const img = images[Math.max(0, Math.min(totalFrames - 1, Math.round(i)))]
      if (!img?.complete || !img.naturalWidth) return
      const cw = canvas.width, ch = canvas.height
      ctx!.clearRect(0, 0, cw, ch)
      // Landscape viewports (desktop / tablet-landscape) — unchanged stretch-fill.
      // Portrait viewports (phones / tablets held upright) — cover-crop instead,
      // so landscape frames aren't squished into an oval. Desktop is unaffected.
      if (cw >= ch) {
        ctx!.drawImage(img, 0, 0, cw, ch)
      } else {
        const ir = img.naturalWidth / img.naturalHeight
        const cr = cw / ch
        let dw: number, dh: number, dx: number, dy: number
        if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0 }
        else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2 }
        ctx!.drawImage(img, dx, dy, dw, dh)
      }
    }

    draw(0)

    // Linearly map p from [p0,p1] to [v0,v1], clamped
    function remap(p: number, p0: number, p1: number, v0: number, v1: number) {
      if (p <= p0) return v0
      if (p >= p1) return v1
      return v0 + (v1 - v0) * (p - p0) / (p1 - p0)
    }

    const frameObj = { frame: 0 }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        // 25px per frame keeps the full 240-frame sequence without rushing
        end: `+=${totalFrames * 25}`,
        pin: true,
        scrub: true,      // direct 1:1 scroll → frame (Apple-style)
        anticipatePin: 1, // smooths pin entry with Lenis
        onUpdate(self) {
          const p = self.progress

          // Title: fade in 0–4%, hold to 22%, fade out by 30%
          if (titleRef.current) {
            titleRef.current.style.opacity = String(
              p < 0.04 ? remap(p, 0, 0.04, 0, 1)
              : p < 0.22 ? 1
              : p < 0.30 ? remap(p, 0.22, 0.30, 1, 0)
              : 0
            )
          }

          // Subtitle: fade in 32–40%, hold to 56%, fade out by 65%
          if (subtitleRef.current) {
            subtitleRef.current.style.opacity = String(
              p < 0.32 ? 0
              : p < 0.40 ? remap(p, 0.32, 0.40, 0, 1)
              : p < 0.56 ? 1
              : p < 0.65 ? remap(p, 0.56, 0.65, 1, 0)
              : 0
            )
          }

          // CTA: fade in 70–78%, hold to 94%, fade out by 99%
          if (ctaRef.current) {
            const op = p < 0.70 ? 0
              : p < 0.78 ? remap(p, 0.70, 0.78, 0, 1)
              : p < 0.94 ? 1
              : p < 0.99 ? remap(p, 0.94, 0.99, 1, 0)
              : 0
            ctaRef.current.style.opacity = String(op)
            ctaRef.current.style.pointerEvents = op > 0.5 ? 'auto' : 'none'
          }

          // Scroll hint: fades out over first 6%
          if (hintRef.current) {
            hintRef.current.style.opacity = String(remap(p, 0, 0.06, 1, 0))
          }

          // Vignette: lightens → darkens across the sequence
          if (vignetteRef.current) {
            vignetteRef.current.style.opacity = String(0.1 + p * 0.45)
          }
        },
      },
    })

    tl.to(frameObj, {
      frame: totalFrames - 1,
      ease: 'none',
      onUpdate() { draw(frameObj.frame) },
    })

    const onResize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      draw(frameObj.frame)
    }
    window.addEventListener('resize', onResize)

    return () => {
      tl.kill()   // also kills the embedded ScrollTrigger
      window.removeEventListener('resize', onResize)
    }
  }, [loaded])

  return (
    <section ref={sectionRef} id="home" className="relative">

      {/* Loading overlay */}
      {!loaded && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
          <div className="text-center space-y-5">
            <p className="font-josefin text-[9px] tracking-[0.5em] uppercase text-white/30">
              Loading Experience
            </p>
            <div className="w-52 h-px bg-white/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-all duration-150"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="font-josefin text-xs text-white/20">{loadProgress}%</p>
          </div>
        </div>
      )}

      {/* GSAP pins this div for the full frame sequence */}
      <div className="h-screen w-full overflow-hidden relative">

        <canvas
          ref={canvasRef}
          className="absolute inset-0 block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Scroll-driven vignette */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0.1 }}
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/60" />

        {/* Title */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="text-center px-6 select-none">
            <h1
              className="font-cormorant font-light text-white leading-none tracking-[0.08em]"
              style={{ fontSize: 'clamp(2.8rem, 8.5vw, 7.5rem)' }}
            >
              CRAFTED TO INSPIRE
            </h1>
            <div className="mt-5 flex items-center justify-center gap-4">
              <span className="block w-10 h-px bg-primary" />
              <span className="font-josefin text-[9px] tracking-[0.5em] uppercase text-white/40">
                Pitfire Pizza Bakers
              </span>
              <span className="block w-10 h-px bg-primary" />
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="text-center px-6 max-w-md select-none">
            <p className="font-josefin text-[10px] tracking-[0.45em] uppercase text-primary mb-5">
              The Pitfire Promise
            </p>
            <p className="font-cormorant text-3xl md:text-4xl font-light text-white/90 leading-snug">
              72 Hour Artisan Dough.
            </p>
            <p className="font-cormorant text-3xl md:text-4xl font-light text-white/65 leading-snug mt-1">
              Premium Ingredients.
            </p>
            <p className="font-cormorant text-3xl md:text-4xl font-light text-white/40 leading-snug mt-1">
              Unforgettable Flavor.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="absolute inset-0 flex items-end justify-center pb-20"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="text-center select-none">
            <p className="font-josefin text-[9px] tracking-[0.45em] uppercase text-white/25 mb-7">
              The Experience Awaits
            </p>
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group inline-flex items-center gap-4 px-10 py-4 border border-white/20 font-josefin text-[10px] tracking-[0.4em] uppercase text-white/80 hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-500"
            >
              Explore Menu
              <span className="w-5 h-px bg-white/40 group-hover:w-8 group-hover:bg-primary transition-all duration-400" />
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none"
          style={{ opacity: 1 }}
        >
          <span className="font-josefin text-[8px] tracking-[0.5em] uppercase text-white/30">
            Scroll
          </span>
          <div className="w-px h-10 bg-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 animate-scroll-line" />
          </div>
        </div>

      </div>
    </section>
  )
}
