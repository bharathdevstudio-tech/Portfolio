import { useEffect, useRef, useState } from 'react'

// Reveal-on-scroll hook. Returns [ref, revealed].
// Uses IntersectionObserver and honors prefers-reduced-motion (reveals instantly).
export function useReveal(options = {}) {
  const { threshold = 0.15, once = true } = options
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const el = ref.current
    if (!el) return undefined

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once) {
            setRevealed(true)
            observer.unobserve(entry.target)
          } else {
            setRevealed(true)
          }
        } else if (!once) {
          setRevealed(false)
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return [ref, revealed]
}