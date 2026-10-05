import { useState } from 'react'
import {
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaCircleInfo,
  FaTriangleExclamation,
  FaSpinner,
  FaWhatsapp,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaLock,
  FaArrowRight,
  FaBriefcase,
  FaHandshake,
  FaBuilding,
  FaUser,
  FaAt,
  FaTag,
  FaCommentDots,
} from 'react-icons/fa6'
import { FaCheckCircle } from 'react-icons/fa'
import Section from './Section'
import Reveal from './Reveal'
import { profile } from '../data/profile'
import { sendContactMessage, isContactConfigured } from '../lib/contact'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' }

const FIELD_META = [
  { name: 'name', label: 'Your Name', icon: <FaUser />, type: 'text', placeholder: 'Your name', autoComplete: 'name' },
  { name: 'email', label: 'Your Email', icon: <FaAt />, type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  { name: 'phone', label: 'Your Phone', icon: <FaPhone />, type: 'tel', placeholder: '+91 00000 00000', autoComplete: 'tel', optional: true },
  { name: 'subject', label: 'Subject', icon: <FaTag />, type: 'text', placeholder: 'What is this about?', optional: true },
]

const HIGHLIGHTS = [
  { icon: <FaBriefcase />, title: 'Freelance Projects', text: 'Web, Mobile & Desktop Apps' },
  { icon: <FaHandshake />, title: 'Collaboration', text: 'Open for remote work' },
  { icon: <FaBuilding />, title: 'Business Enquiries', text: 'Let\u2019s create something great' },
]

function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
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
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      })
      setStatus({ type: 'success', text })
      setSubmitted(true)
      setForm(EMPTY_FORM)
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

  const contactActions = [
    {
      icon: <FaWhatsapp />,
      title: 'Let’s Build Something Great',
      description: 'Chat on WhatsApp about your next project',
      action: 'Start a conversation',
      href: profile.socials.whatsapp,
      variant: 'is-whatsapp',
      external: true,
    },
    {
      icon: <FaPhone />,
      title: 'Let’s Talk Ideas',
      description: profile.phone,
      action: 'Call me',
      href: profile.phoneHref,
      variant: 'is-phone',
    },
    {
      icon: <FaEnvelope />,
      title: 'Drop Me a Message',
      description: profile.email,
      action: 'Send an email',
      href: `mailto:${profile.email}`,
      variant: 'is-email',
    },
  ].filter((item) => item.href)

  const socialLinks = [
    { icon: <FaLinkedinIn />, label: 'LinkedIn', href: profile.socials.linkedin },
    { icon: <FaGithub />, label: 'GitHub', href: profile.socials.github },
    { icon: <FaInstagram />, label: 'Instagram', href: profile.socials.instagram },
    { icon: <FaYoutube />, label: 'YouTube', href: profile.socials.youtube },
    { icon: <FaXTwitter />, label: 'X', href: profile.socials.x },
  ].filter((item) => item.href)

  return (
    <Section id="contact" bare labelledBy="contact-heading">
      <div className="contact-bg" aria-hidden="true">
        <span className="contact-blob contact-blob-1" />
        <span className="contact-blob contact-blob-2" />
        <span className="contact-blob contact-blob-3" />
        <span className="contact-grid-lines" />
        <span className="contact-dot contact-dot-1" />
        <span className="contact-dot contact-dot-2" />
        <span className="contact-dot contact-dot-3" />
        <span className="contact-shape contact-shape-1" />
        <span className="contact-shape contact-shape-2" />
        <FaPaperPlane className="contact-plane" />
      </div>

      <div className="container contact-split">
        <Reveal className="contact-left">
          <p className="contact-eyebrow">Contact</p>
          <h2 className="contact-heading" id="contact-heading">
            Let&rsquo;s Work <span className="gradient-text">Together</span>
          </h2>
          <p className="contact-lede">
            Have a project in mind, need a developer, or want to discuss an opportunity? I&rsquo;d love
            to hear from you. Let&rsquo;s turn your ideas into reality.
          </p>

          <div className="contact-cards">
            {contactActions.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className={`contact-card ${item.variant}`}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                <span className="contact-card-aura" aria-hidden="true" />
                <span className="contact-card-sweep" aria-hidden="true" />
                <span className="contact-card-particles" aria-hidden="true">
                  <span className="cp cp-1" />
                  <span className="cp cp-2" />
                  <span className="cp cp-3" />
                  <span className="cp cp-4" />
                  <span className="cp cp-5" />
                </span>

                <span className="contact-card-icon" aria-hidden="true">{item.icon}</span>

                <span className="contact-card-body">
                  <span className="contact-card-title">{item.title}</span>
                  <span className="contact-card-desc">{item.description}</span>
                </span>

                <span className="contact-card-actions">
                  <span className="contact-card-btn">{item.action}</span>
                  <span className="contact-card-cta" aria-hidden="true">
                    <FaArrowRight className="contact-card-arrow" />
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="contact-follow">
            <p className="contact-follow-label">Follow Me</p>
            <div className="contact-socials">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="contact-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} profile`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="contact-right">
          <form className="contact-form glass-strong" onSubmit={onSubmit} noValidate>
            <div className="contact-form-head">
              <p className="contact-form-eyebrow">Send A Message</p>
              <div className="contact-form-title-row">
                <h3 className="contact-form-title">Get In Touch</h3>
                <FaPaperPlane className="contact-form-plane" aria-hidden="true" />
              </div>
            </div>

            <div className="form-grid">
              {FIELD_META.map((field) => (
                <div className="field" key={field.name}>
                  <label className="field-label" htmlFor={`contact-${field.name}`}>
                    {field.label}{' '}
                    {field.optional ? (
                      <span className="opt" aria-hidden="true">(optional)</span>
                    ) : (
                      <span className="req" aria-hidden="true">*</span>
                    )}
                  </label>
                  <div className="field-wrap">
                    <span className="field-icon" aria-hidden="true">{field.icon}</span>
                    <input
                      id={`contact-${field.name}`}
                      name={field.name}
                      type={field.type}
                      className={`field-input ${errors[field.name] ? 'invalid' : ''}`}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      value={form[field.name]}
                      onChange={onChange}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={errors[field.name] ? `error-${field.name}` : undefined}
                    />
                  </div>
                  {errors[field.name] && (
                    <span id={`error-${field.name}`} className="field-error" role="alert">
                      <FaTriangleExclamation size="0.9em" aria-hidden="true" />
                      {errors[field.name]}
                    </span>
                  )}
                </div>
              ))}

              <div className="field full">
                <label className="field-label" htmlFor="contact-message">
                  Your Message <span className="req" aria-hidden="true">*</span>
                </label>
                <div className="field-wrap">
                  <span className="field-icon" aria-hidden="true"><FaCommentDots /></span>
                  <textarea
                    id="contact-message"
                    name="message"
                    className={`field-textarea ${errors.message ? 'invalid' : ''}`}
                    placeholder="Tell me about your project or opportunity..."
                    value={form.message}
                    onChange={onChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'error-message' : undefined}
                  />
                </div>
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
              className="btn btn-primary btn-block contact-submit"
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
                  <FaPaperPlane size="0.9em" aria-hidden="true" />
                  Send Message
                </>
              )}
            </button>

            <p className="contact-safe">
              <FaLock size="0.85em" aria-hidden="true" />
              Your information is safe with me. I never share your details.
            </p>

            {!isContactConfigured() && (
              <p className="form-note">
                Not connected yet \u2014 add EmailJS env vars (VITE_EMAILJS_SERVICE_ID / _TEMPLATE_ID /
                _PUBLIC_KEY) to .env or your Vercel project. See .env.example.
              </p>
            )}

            <div className="contact-highlights">
              {HIGHLIGHTS.map((item) => (
                <div className="contact-highlight" key={item.title}>
                  <span className="contact-highlight-icon" aria-hidden="true">{item.icon}</span>
                  <span>
                    <span className="contact-highlight-title">{item.title}</span>
                    <span className="contact-highlight-text">{item.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}

export default Contact
