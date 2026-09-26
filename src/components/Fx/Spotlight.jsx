// Purple spotlight that follows the pointer (pf-spot toggle, off by default).
// Fine pointers only; skipped entirely for touch/reduced users.
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EFFECTS, useEffectToggle } from '../../lib/effects'

export default function Spotlight() {
  const enabled = useEffectToggle(EFFECTS.spotlight)
  const reduced = useReducedMotion()
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled || reduced) return undefined

    const media = window.matchMedia('(pointer: fine)')
    const el = ref.current
    if (!el || !media.matches) return undefined

    let raf = null
    const onMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        el.style.setProperty('--spot-x', `${e.clientX}px`)
        el.style.setProperty('--spot-y', `${e.clientY}px`)
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled, reduced])

  if (!enabled || reduced) return null
  return <div ref={ref} className="spotlight" aria-hidden="true" />
}