import { FaAward, FaBuilding, FaEye } from 'react-icons/fa6'
import { FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa'
import Reveal from './Reveal'
import Section from './Section'
import { certificates } from '../data/certificates'

export default function Certificates() {
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
        {certificates.map((cert, i) => (
          <Reveal key={cert.id} delay={(i % 3) * 90} className="cert-card card glass">
            <div
              className="cert-preview"
              style={{ background: `linear-gradient(135deg, ${cert.placeholderPalette[0]}, ${cert.placeholderPalette[1]})` }}
            >
              <FaAward size="3rem" aria-hidden="true" />

              {cert.pdfUrl || cert.credentialUrl ? (
                <a
                  href={cert.pdfUrl || cert.credentialUrl}
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

            {cert.pdfUrl || cert.credentialUrl ? (
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
        ))}
      </div>
    </Section>
  )
}