import { useState } from 'react'
import { FaAward, FaBuilding, FaEye } from 'react-icons/fa6'
import { FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa'
import Reveal from './Reveal'
import Section from './Section'
import { certificates } from '../data/certificates'

export default function Certificates() {
  const [failedImages, setFailedImages] = useState({})

  return (
    <Section
      id="certificates"
      eyebrow="Certificates"
      title={
        <>
          My certificates of <span className="gradient-text">achievement</span>
        </>
      }
      subtitle="Completed courses and certifications — from AI fundamentals to responsive web design."
    >
      <div className="certs-grid">
        {certificates.map((cert, i) => {
          const showImage = Boolean(cert.image) && !failedImages[cert.id]
          const link = cert.pdfUrl || cert.credentialUrl

          return (
            <Reveal key={cert.id} delay={(i % 3) * 90} className="cert-card card glass">
              <div
                className={`cert-preview ${showImage ? 'has-image' : ''}`}
                style={{ '--c1': cert.placeholderPalette[0], '--c2': cert.placeholderPalette[1] }}
              >
                {showImage ? (
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedImages((prev) => ({ ...prev, [cert.id]: true }))}
                  />
                ) : (
                  <FaAward size="3rem" aria-hidden="true" />
                )}

                {link ? (
                  <a
                    href={link}
                    className="cert-preview-overlay"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open certificate: ${cert.title}`}
                  >
                    <FaEye size="1.1em" aria-hidden="true" />
                    View Certificate
                  </a>
                ) : null}
              </div>

              <div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-org">
                  <FaBuilding size="0.85em" aria-hidden="true" />
                  {cert.organization}
                </p>
                <p className="cert-date">
                  <FaCalendarAlt size="0.8em" aria-hidden="true" />
                  {cert.date}
                </p>
              </div>

              {link ? (
                <a
                  href={cert.credentialUrl || cert.pdfUrl}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: 'auto', fontSize: 'var(--fs-xs)', padding: '0.6rem 1rem' }}
                >
                  {cert.credentialUrl ? 'Verify Credential' : 'View Certificate'}
                  <FaExternalLinkAlt size="0.75em" aria-hidden="true" />
                </a>
              ) : (
                <p className="cert-date" style={{ marginTop: 'auto' }}>
                  Certificate available on request — email me.
                </p>
              )}
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}