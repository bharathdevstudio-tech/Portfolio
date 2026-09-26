// 3D tilt-on-hover wrapper with a cursor-tracked glare. Honors reduced motion
// (glare stays, but the card does not physically tilt).
import { useCallback, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const MAX_TILT = 9

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const handleMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.width === 0) return
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
      if (reduced) return
      const rx = (py - 0.5) * -2 * MAX_TILT
      const ry = (px - 0.5) * 2 * MAX_TILT
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px) scale(1.02)`
    },
    [reduced]
  )

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
  }, [])

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}