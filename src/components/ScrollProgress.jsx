import { useReducedMotion } from '../hooks/useReducedMotion'
import { useScrollProgress } from '../hooks/useScrollProgress'

const SIZE = 58
const RADIUS = 25
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ScrollProgress() {
  const progress = useScrollProgress()
  const reduced = useReducedMotion()

  const visible = progress > 0.15
  const offset = CIRCUMFERENCE * (1 - progress)

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <div
      className="scroll-progress-wrap"
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 100,
      }}
    >
      <button
        type="button"
        className="scroll-progress-btn"
        onClick={scrollTop}
        aria-label={`Scroll to top (${Math.round(progress * 100)}%)`}
        tabIndex={visible ? 0 : -1}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateY(0)'
            : 'translateY(14px)',
          pointerEvents: visible ? 'auto' : 'none',
          transition: reduced
            ? 'none'
            : 'opacity 700ms ease, transform 700ms ease',
        }}
      >
        <svg
          className="scroll-progress-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="scrollProgressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          <circle
            className="scroll-progress-bg"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
          />

          <circle
            className="scroll-progress-fg"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>

        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            zIndex: 1,
            position: 'relative',
          }}
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}