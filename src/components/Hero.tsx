'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imagesRef    = useRef<HTMLImageElement[]>([])
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
          img.decoding = 'async'
          // Filenames contain spaces / parentheses ("frame (1).webp") — encode
          // each segment so the request URL stays valid and never 404s.
          img.src = `/frame/${encodeURIComponent(file)}`
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

    const frameObj = { frame: 0 }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        // ~25px of scroll per frame keeps the full sequence smooth without rushing
        end: `+=${totalFrames * 25}`,
        pin: true,
        scrub: true,      // direct 1:1 scroll → frame (Apple-style)
        anticipatePin: 1, // smooths pin entry with Lenis
        onUpdate(self) {
          // Vignette only — lightens → darkens across the sequence (no text)
          if (vignetteRef.current) {
            vignetteRef.current.style.opacity = String(0.1 + self.progress * 0.45)
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

      {/* Minimal preloader — a single thin progress line, no copy */}
      {!loaded && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
          <div className="w-52 h-px bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-150"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* GSAP pins this div for the full frame sequence — pure cinematic visual */}
      <div className="h-screen w-full overflow-hidden relative">

        <canvas
          ref={canvasRef}
          className="absolute inset-0 block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Scroll-driven vignette (visual only) */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0.1 }}
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/60" />

      </div>
    </section>
  )
}
