import { useEffect, useRef, useState } from 'react'
import { FaAward, FaXmark, FaDownload } from 'react-icons/fa6'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useReducedMotion } from '../hooks/useReducedMotion'

// In-page certificate viewer. Opens as a modal so "View Certificate" no longer
// navigates to a separate page/tab. Shows the rendered preview image by default
// and can swap to an embedded PDF, still inside the same page.
export default function CertificateViewer({ cert, onClose }) {
  const reduced = useReducedMotion()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const lastFocused = useRef(null)
  const [imageFailed, setImageFailed] = useState(false)
  const [showPdf, setShowPdf] = useState(false)

  useEffect(() => {
    if (!cert) return undefined

    lastFocused.current = document.activeElement
    setImageFailed(false)
    setShowPdf(false)

    const timer = setTimeout(() => closeRef.current?.focus(), reduced ? 0 : 20)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll('button, a[href]')
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (lastFocused.current && typeof lastFocused.current.focus === 'function') {
        lastFocused.current.focus()
      }
    }
  }, [cert, onClose, reduced])

  if (!cert) return null

  const { title, organization, date, pdfUrl, credentialUrl } = cert
  const showImage = Boolean(cert.image) && !imageFailed

  return (
    <div className="cert-viewer-overlay" onMouseDown={onClose}>
      <div
        className="cert-viewer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} certificate`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cert-viewer-head">
          <div className="cert-viewer-meta">
            <h3 className="cert-viewer-title">{title}</h3>
            <p className="cert-viewer-sub">
              {organization} · {date}
            </p>
          </div>
          <button
            type="button"
            ref={closeRef}
            className="cert-viewer-close"
            onClick={onClose}
            aria-label="Close certificate viewer"
          >
            <FaXmark aria-hidden="true" />
          </button>
        </div>

        <div className="cert-viewer-body">
          {showPdf && pdfUrl ? (
            <iframe src={pdfUrl} title={`${title} (PDF)`} className="cert-viewer-frame" />
          ) : showImage ? (
            <img
              src={cert.image}
              alt={`${title} certificate`}
              className="cert-viewer-img"
              onError={() => setImageFailed(true)}
            />
          ) : pdfUrl ? (
            <iframe src={pdfUrl} title={`${title} (PDF)`} className="cert-viewer-frame" />
          ) : (
            <div className="cert-viewer-empty">
              <FaAward size="3rem" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="cert-viewer-foot">
          {pdfUrl && showImage && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowPdf((v) => !v)}
            >
              {showPdf ? 'Show image' : 'Open PDF'}
            </button>
          )}
          {pdfUrl && (
            <a className="btn btn-secondary" href={pdfUrl} download>
              <FaDownload size="0.85em" aria-hidden="true" />
              Download
            </a>
          )}
          {credentialUrl && (
            <a
              className="btn btn-secondary"
              href={credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt size="0.75em" aria-hidden="true" />
              Verify credential
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
