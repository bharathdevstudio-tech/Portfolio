// Futuristic page loading screen with a circular progress bar.
// `loading` controls visibility. The ring counts to 100%, then the screen
// fades out. Honors prefers-reduced-motion (static 100% ring, no counting).
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const RADIUS = 54
const CIRC = 2 * Math.PI * RADIUS
const DURATION = 1600 // ms to count 0 -> 100

export default function PageLoader({ loading }) {
  const reduced = useReducedMotion()
  const [pct, setPct] = useState(reduced ? 100 : 0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (reduced) {
      setPct(100)
      return undefined
    }

    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1)
      // ease-out so the counter relaxes into 100%.
      const eased = 1 - Math.pow(1 - t, 2)
      setPct(Math.round(eased * 100))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced])

  // Snap to 100% the moment loading finishes (before the fade-out completes).
  useEffect(() => {
    if (!loading) setPct(100)
  }, [loading])

  const dashOffset = CIRC * (1 - pct / 100)

  return (
    <div
      className={`page-loader ${loading ? '' : 'done'}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="page-loader-circles" aria-hidden="true">
        <svg className="page-loader-progress" viewBox="0 0 120 120" width="150" height="150">
          <defs>
            <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle className="page-loader-track" cx="60" cy="60" r={RADIUS} />
          <circle
            className="page-loader-fill"
            cx="60"
            cy="60"
            r={RADIUS}
            stroke="url(#loaderGrad)"
            style={{ strokeDasharray: CIRC, strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="page-loader-logo">B</div>
      </div>
      <span className="page-loader-count">{pct}%</span>
      <span className="page-loader-text">Loading experience</span>
    </div>
  )
}