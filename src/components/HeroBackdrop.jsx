// Futuristic AI-engineer hero backdrop. Pure CSS animation + tiny JS only for
// generating randomly-placed decorations and easing the mouse-parallax (rAF).
// No images, no canvas, no 3D — stays lightweight and honors reduced motion.
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const GRADIENT = ['#7c3aed', '#4f46e5', '#0ea5e9', '#06b6d4']

const CODE_FRAGMENTS = ['</>', '{ }', 'const', '=>', 'AI', 'API', 'React', 'Python', '0x1F', 'useState', 'npm run', '<Dev/>']

const SHAPES = [
  { kind: 'square' },
  { kind: 'ring' },
  { kind: 'triangle' },
  { kind: 'diamond' },
  { kind: 'hex' },
]

function rand(min, max) {
  return Math.random() * (max - min) + min
}

export default function HeroBackdrop() {
  const reduced = useReducedMotion()
  const layerRef = useRef(null)
  const [particles, setParticles] = useState([])
  const [shapes, setShapes] = useState([])
  const [codes, setCodes] = useState([])

  // Build decorations after mount; fewer particles and no floating
  // geometry / code fragments on small screens.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const build = () => {
      const count = mq.matches ? 26 : 12
      setParticles(
        Array.from({ length: count }, (_, i) => ({
          id: i,
          left: rand(2, 98),
          top: rand(4, 94),
          size: rand(1.5, 3.2),
          delay: rand(0, 6),
          dur: rand(5, 11),
          color: GRADIENT[i % GRADIENT.length],
        }))
      )
      setShapes(
        mq.matches
          ? SHAPES.map((s, i) => ({
              id: i,
              kind: s.kind,
              left: rand(5, 88),
              top: rand(8, 86),
              size: rand(36, 78),
              delay: rand(0, 8),
              dur: rand(16, 26),
            }))
          : []
      )
      setCodes(
        mq.matches
          ? CODE_FRAGMENTS.map((text, i) => ({
              id: i,
              text,
              left: rand(2, 94),
              top: rand(6, 90),
              size: rand(0.8, 1.6),
              delay: rand(0, 10),
              dur: rand(24, 40),
            }))
          : []
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

  // Smooth mouse parallax: one mousemove listener, rAF-throttled, writes CSS
  // custom props the layers read. Fully skipped for reduced motion.
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

  return (
    <div className="hero-bg" ref={layerRef} aria-hidden="true">
      {/* Layer 2 — subtle grid */}
      <div className="hero-grid" />

      {/* Layers 3–5 — orbs, geo shapes, code, particles (with parallax) */}
      <div className="hero-parallax">
        <span className="hero-orb-wrap hero-orb-a">
          <span className="hero-orb" />
        </span>
        <span className="hero-orb-wrap hero-orb-b">
          <span className="hero-orb" />
        </span>
        <span className="hero-orb-wrap hero-orb-c">
          <span className="hero-orb" />
        </span>

        {shapes.map((s) => (
          <span
            key={s.id}
            className={`hero-shape hero-shape-${s.kind}`}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}

        {codes.map((c) => (
          <span
            key={c.id}
            className="hero-code"
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              fontSize: `${c.size}rem`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.dur}s`,
            }}
          >
            {c.text}
          </span>
        ))}

        {particles.map((p) => (
          <span
            key={p.id}
            className="hero-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Soft radial glow behind the main content */}
      <div className="hero-glow" />

      {/* Layer 6 — vignette around page edges */}
      <div className="hero-vignette" />
    </div>
  )
}