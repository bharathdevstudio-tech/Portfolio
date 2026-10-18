// Trailing cursor ring for fine-pointer devices. The native cursor stays
// visible and operable; this is purely decorative (aria-hidden), disabled for
// touch and users who prefer reduced motion.
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function CustomCursor() {
  const reduced = useReducedMotion()
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined

    const media = window.matchMedia('(pointer: fine)')
    if (!media.matches) return undefined

    // The dot/ring are always rendered so their refs exist on mount; visibility
    // is gated by the `has-custom-cursor` class on <html>.
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined

    document.documentElement.classList.add('has-custom-cursor')

    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let raf = null

    const lerp = (a, b, t) => a + (b - a) * t

    // Only run the rAF loop while the ring is catching up to the pointer, then
    // stop. An idle page costs nothing; the loop restarts on the next move.
    const loop = () => {
      rx = lerp(rx, mx, 0.16)
      ry = lerp(ry, my, 0.16)
      dot.style.setProperty('--cursor-x', `${mx}px`)
      dot.style.setProperty('--cursor-y', `${my}px`)
      ring.style.setProperty('--cursor-x', `${rx}px`)
      ring.style.setProperty('--cursor-y', `${ry}px`)
      const settled = Math.abs(rx - mx) < 0.15 && Math.abs(ry - my) < 0.15
      raf = settled ? null : requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const onOver = (e) => {
      const interactive = e.target.closest('a, button, [role="button"], input, textarea, select, [tabindex]')
      ring.classList.toggle('cursor-hover', Boolean(interactive))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      if (raf) cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [reduced])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}