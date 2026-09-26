import { useState } from 'react'
import {
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaCircleInfo,
  FaTriangleExclamation,
  FaSpinner,
} from 'react-icons/fa6'
import { FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa'
import Section from './Section'
import Reveal from './Reveal'
import { profile } from '../data/profile'
import { sendContactMessage, isContactConfigured } from '../lib/contact'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // { type: 'success'|'error'|'info', text }
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = (values) => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) next.email = 'Please enter your email address.'
    else if (!EMAIL_RE.test(values.email.trim())) next.email = 'That email doesn\u2019t look valid.'
    if (!values.message.trim()) next.message = 'A message helps me reply better.'
    else if (values.message.trim().length < 10) next.message = 'Give me a little more detail (10+ chars).'
    return next
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending || submitted) return // prevent duplicate submissions

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus(null)
      return
    }

    setSending(true)
    setStatus(null)
    try {
      const text = await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      setStatus({ type: 'success', text })
      setSubmitted(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({
        type: 'error',
        text:
          err.message ||
          'Something went wrong \u2014 please email me at ' + profile.email + '.',
      })
    } finally {
      setSending(false)
    }
  }

  const infoCards = [
    { icon: <FaEnvelope />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: <FaPhone />, label: 'Phone', value: profile.phone, href: profile.phoneHref },
    { icon: <FaMapMarkerAlt />, label: 'Location', value: profile.location, href: null },
  ]

  return (
    <Section
      id="contact"
      eyebrow="Get In Touch"
      title={
        <>
          Let&apos;s build something{' '}
          <span className="gradient-text">amazing together</span>
        </>
      }
      subtitle="I'm always excited to hear about new ideas. Drop me a message and let's create something great."
    >
      <div className="contact-grid">
        <Reveal className="contact-info">
          {infoCards.map((card) =>
            card.href ? (
              <a key={card.label} href={card.href} className="contact-info-card glass">
                <span className="contact-info-icon" aria-hidden="true">{card.icon}</span>
                <span>
                  <span className="contact-info-label">{card.label}</span>
                  <span className="contact-info-value" style={{ display: 'block' }}>{card.value}</span>
                </span>
              </a>
            ) : (
              <div key={card.label} className="contact-info-card glass">
                <span className="contact-info-icon" aria-hidden="true">{card.icon}</span>
                <span>
                  <span className="contact-info-label">{card.label}</span>
                  <span className="contact-info-value" style={{ display: 'block' }}>{card.value}</span>
                </span>
              </div>
            )
          )}

        </Reveal>

        <Reveal delay={120}>
          <form className="contact-form glass-strong" onSubmit={onSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label className="field-label" htmlFor="contact-name">
                  Name <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className={`field-input ${errors.name ? 'invalid' : ''}`}
                  placeholder="Your name"
                  autoComplete="name"
                  value={form.name}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  required
                />
                {errors.name && (
                  <span id="error-name" className="field-error" role="alert">
                    <FaTriangleExclamation size="0.9em" aria-hidden="true" />
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field-label" htmlFor="contact-email">
                  Email <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className={`field-input ${errors.email ? 'invalid' : ''}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  required
                />
                {errors.email && (
                  <span id="error-email" className="field-error" role="alert">
                    <FaTriangleExclamation size="0.9em" aria-hidden="true" />
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="field full">
                <label className="field-label" htmlFor="contact-message">
                  Message <span className="req" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className={`field-textarea ${errors.message ? 'invalid' : ''}`}
                  placeholder="Tell me about your project or opportunity..."
                  value={form.message}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  required
                />
                {errors.message && (
                  <span id="error-message" className="field-error" role="alert">
                    <FaTriangleExclamation size="0.9em" aria-hidden="true" />
                    {errors.message}
                  </span>
                )}
              </div>
            </div>

            {status && (
              <div className={`form-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>
                {status.type === 'success' && <FaCheckCircle aria-hidden="true" />}
                {status.type === 'error' && <FaTriangleExclamation aria-hidden="true" />}
                {status.type === 'info' && <FaCircleInfo aria-hidden="true" />}
                {status.text}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={sending || submitted}
            >
              {sending ? (
                <>
                  <FaSpinner className="spin" size="0.9em" aria-hidden="true" />
                  Sending...
                </>
              ) : submitted ? (
                <>
                  <FaCheckCircle size="0.9em" aria-hidden="true" />
                  Message Sent
                </>
              ) : (
                <>
                  <FaPaperPlane size="0.85em" aria-hidden="true" />
                  Send Message
                </>
              )}
            </button>

            <p className="form-note">
              {isContactConfigured()
                ? 'Messages are delivered via your configured provider (EmailJS).'
                : 'Not connected yet \u2014 add EmailJS env vars (VITE_EMAILJS_SERVICE_ID / _TEMPLATE_ID / _PUBLIC_KEY) to .env or your Vercel project. See .env.example.'}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}

export default Contact