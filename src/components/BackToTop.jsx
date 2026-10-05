import { FaHouse } from 'react-icons/fa6'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useScrollProgress } from '../hooks/useScrollProgress'

export default function BackToTop() {
  const progress = useScrollProgress()
  const reduced = useReducedMotion()

  const visible = progress > 0.08

  const goTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <div className={`back-to-top-wrap ${visible ? 'is-visible' : ''}`}>
      <span className="back-to-top-halo" aria-hidden="true" />
      <span className="back-to-top-tip" aria-hidden="true">Back to top</span>
      <button
        type="button"
        className="back-to-top"
        onClick={goTop}
        aria-label="Back to top"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
      >
        <FaHouse className="back-to-top-icon" aria-hidden="true" />
      </button>
    </div>
  )
}
