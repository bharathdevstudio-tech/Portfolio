import { useEffect, useState } from 'react'
import { FaHouse } from 'react-icons/fa6'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Floating "Back to Home" control. Appears once the visitor scrolls past the
// first viewport and smooth-scrolls back to the hero (#home).
export default function BackToHome() {
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goHome = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`back-home ${visible ? 'is-visible' : ''}`}
      onClick={goHome}
      aria-label="Back to home"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <FaHouse className="back-home-icon" aria-hidden="true" />
      <span className="back-home-label">Home</span>
    </button>
  )
}
