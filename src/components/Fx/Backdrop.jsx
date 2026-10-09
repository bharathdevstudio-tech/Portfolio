// Global deep-space nebula backdrop.
//
// Fixed, viewport-sized, and continuous behind every section so the whole site
// reads as one space scene. Pure CSS + inline SVG (feTurbulence) for the
// gaseous clouds, a generated vector star field for the dense star layer, and a
// small JS set of twinkling stars / drifting dust motes. No raster images, so
// it stays razor sharp at 4K. Honors prefers-reduced-motion.
//
// Composition: the brightest formations sit upper-right / center-right; the
// left-center stays calm. The hero adds its own reading scrim on top.
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const STAR_TINTS = ['#ffffff', '#e0ecff', '#ede9fe', '#d8fbff', '#fff2d6']

function rand(min, max) {
  return Math.random() * (max - min) + min
}

// Builds an SVG star field as a data URI. Stars are biased toward the right
// side so the left half stays calm. Vector output = crisp at 4K.
function starFieldUri(count, { maxR, minOpacity, maxOpacity }) {
  let circles = ''
  for (let i = 0; i < count; i += 1) {
    const radius = rand(0.3, maxR).toFixed(2)
    // ~70% of stars land in the right 68% of the frame.
    const x = (Math.random() < 0.7 ? rand(0.32, 1) : rand(0, 0.34)) * 1600
    const y = rand(0, 900)
    const opacity = rand(minOpacity, maxOpacity).toFixed(2)
    circles += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius}" fill="#fff" opacity="${opacity}"/>`
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${circles}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// Built once at module load (not per render).
const FAR_STARS = starFieldUri(1300, { maxR: 0.85, minOpacity: 0.16, maxOpacity: 0.7 })
const NEAR_STARS = starFieldUri(170, { maxR: 1.5, minOpacity: 0.35, maxOpacity: 0.95 })

export default function Backdrop() {
  const reduced = useReducedMotion()
  const layerRef = useRef(null)
  const [stars, setStars] = useState([])
  const [motes, setMotes] = useState([])

  // Brighter twinkling stars + drifting dust. Fewer on small screens.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const build = () => {
      const wide = mq.matches
      setStars(
        Array.from({ length: wide ? 90 : 34 }, (_, i) => {
          const left = Math.random() < 0.72 ? rand(34, 100) : rand(0, 34)
          return {
            id: i,
            left,
            top: rand(0, 100),
            size: rand(1, 2.6),
            delay: rand(0, 7),
            dur: rand(4, 9),
            tint: STAR_TINTS[i % STAR_TINTS.length],
          }
        })
      )
      setMotes(
        Array.from({ length: wide ? 18 : 8 }, (_, i) => ({
          id: i,
          left: rand(18, 100),
          top: rand(10, 96),
          size: rand(1.5, 3.4),
          delay: rand(0, 12),
          dur: rand(16, 28),
          drift: rand(-34, 34),
        }))
      )
    }
    build()
    if (mq.addEventListener) mq.addEventListener('change', build)
    else mq.addListener(build)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', build)
      else mq.removeListener(build)
    }
  }, [])

  // Mouse parallax: one listener, rAF-throttled, writes CSS custom props the
  // layers read. Skipped entirely for reduced motion.
  useEffect(() => {
    if (reduced) return undefined
    let raf = null
    let latest = null
    const onRaf = () => {
      raf = null
      if (!latest || !layerRef.current) return
      layerRef.current.style.setProperty('--par-x', latest.x.toFixed(3))
      layerRef.current.style.setProperty('--par-y', latest.y.toFixed(3))
    }
    const onMove = (e) => {
      latest = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
      if (!raf) raf = requestAnimationFrame(onRaf)
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Freeze every animation while the tab is backgrounded so a hidden tab costs
  // no CPU/GPU or battery. Purely a class toggle; nothing is unloaded.
  useEffect(() => {
    const sync = () => {
      document.documentElement.classList.toggle('is-tab-hidden', document.hidden)
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  return (
    <div className="backdrop" ref={layerRef} aria-hidden="true">
      {/* --- Volumetric gas clouds (SVG turbulence, additive) --- */}
      <svg
        className="nebula-cloud nebula-cloud-a"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="nbGradA" cx="76%" cy="24%" r="62%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.92" />
            <stop offset="34%" stopColor="#6d28d9" stopOpacity="0.62" />
            <stop offset="66%" stopColor="#3b1d8f" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#0b1030" stopOpacity="0" />
          </radialGradient>
          <filter
            id="nbFilterA"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0034 0.0052"
              numOctaves="6"
              seed="11"
              result="t"
            />
            <feColorMatrix
              in="t"
              type="matrix"
              result="m"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.95 0.25 0.2 0 -0.42"
            />
            <feGaussianBlur in="m" stdDeviation="5" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="in" />
          </filter>
        </defs>
        <rect width="1600" height="900" fill="url(#nbGradA)" filter="url(#nbFilterA)" />
      </svg>

      <svg
        className="nebula-cloud nebula-cloud-b"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="nbGradB" cx="90%" cy="60%" r="58%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.82" />
            <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.5" />
            <stop offset="72%" stopColor="#1e3a8a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0b1030" stopOpacity="0" />
          </radialGradient>
          <filter
            id="nbFilterB"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0042 0.0064"
              numOctaves="5"
              seed="29"
              result="t"
            />
            <feColorMatrix
              in="t"
              type="matrix"
              result="m"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0.3 0.15 0 -0.4"
            />
            <feGaussianBlur in="m" stdDeviation="6" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="in" />
          </filter>
        </defs>
        <rect width="1600" height="900" fill="url(#nbGradB)" filter="url(#nbFilterB)" />
      </svg>

      <svg
        className="nebula-cloud nebula-cloud-c"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="nbGradC" cx="64%" cy="10%" r="46%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.6" />
            <stop offset="44%" stopColor="#a855f7" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#0b1030" stopOpacity="0" />
          </radialGradient>
          <filter
            id="nbFilterC"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.0072"
              numOctaves="5"
              seed="43"
              result="t"
            />
            <feColorMatrix
              in="t"
              type="matrix"
              result="m"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0.2 0.2 0 -0.45"
            />
            <feGaussianBlur in="m" stdDeviation="4" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="in" />
          </filter>
        </defs>
        <rect width="1600" height="900" fill="url(#nbGradC)" filter="url(#nbFilterC)" />
      </svg>

      {/* --- Soft volumetric light + faint light shafts --- */}
      <div className="nebula-veil" />
      <div className="nebula-rays" />

      {/* --- Star fields (vector, generated) --- */}
      <div className="hero-stars hero-stars-far" style={{ backgroundImage: FAR_STARS }} />
      <div className="hero-stars hero-stars-near" style={{ backgroundImage: NEAR_STARS }} />

      {/* --- Twinkling stars --- */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="hero-star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.tint,
            boxShadow: `0 0 ${s.size * 4}px ${s.tint}`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}

      {/* --- Drifting cosmic dust --- */}
      {motes.map((m) => (
        <span
          key={m.id}
          className="hero-mote"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.dur}s`,
            '--mote-x': `${m.drift}px`,
          }}
        />
      ))}

      {/* --- Cinematic vignette + fine film grain --- */}
      <div className="space-vignette" />
      <div className="grain" />
    </div>
  )
}
