// Contact form integration adapter.
//
// Providers are tried in order; the first success wins. This lets you run your
// own SMTP server (primary) with EmailJS as an automatic fallback.
//
//   1) Formspree      VITE_FORMSPREE_ENDPOINT="https://formspree.io/f/yourid"
//   2) SMTP backend   VITE_CONTACT_API="/api/contact"  (see api/contact.js)
//   3) EmailJS        VITE_EMAILJS_SERVICE_ID + VITE_EMAILJS_TEMPLATE_ID + VITE_EMAILJS_PUBLIC_KEY
//
// SMTP credentials (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS …) live only on
// the server — they are read inside api/contact.js and never reach the browser.
//
// If nothing is configured, submit shows a clear "not connected" notice — it
// never pretends a message was sent.

const SUCCESS = 'Message sent successfully — I will get back to you soon.'
const FAILURE = 'Message could not be delivered. Please try again later.'

function env() {
  return import.meta.env ?? {}
}

export function isContactConfigured() {
  const e = env()
  return Boolean(
    e.VITE_FORMSPREE_ENDPOINT || e.VITE_CONTACT_API || e.VITE_EMAILJS_SERVICE_ID
  )
}

async function sendViaFormspree(endpoint, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(FAILURE)
  return SUCCESS
}

// Our own /api/contact serverless route (SMTP via Nodemailer).
async function sendViaBackend(endpoint, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(FAILURE)
  return SUCCESS
}

// EmailJS public REST API (no extra package required).
async function sendViaEmailJs(e, payload) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: e.VITE_EMAILJS_SERVICE_ID,
      template_id: e.VITE_EMAILJS_TEMPLATE_ID,
      user_id: e.VITE_EMAILJS_PUBLIC_KEY,
      template_params: payload,
    }),
  })
  if (!res.ok) throw new Error('Email service is not configured correctly. Please try again later.')
  return SUCCESS
}

export async function sendContactMessage({ name, email, phone, subject, message }) {
  const e = env()
  const payload = { name, email, phone: phone || '', subject: subject || '', message }

  const providers = []
  if (e.VITE_FORMSPREE_ENDPOINT) {
    providers.push(() => sendViaFormspree(e.VITE_FORMSPREE_ENDPOINT, payload))
  }
  if (e.VITE_CONTACT_API) {
    providers.push(() => sendViaBackend(e.VITE_CONTACT_API, payload))
  }
  if (e.VITE_EMAILJS_SERVICE_ID) {
    providers.push(() => sendViaEmailJs(e, payload))
  }

  if (providers.length === 0) {
    throw new Error(
      'Contact form is not connected yet. Configure a provider in .env — see .env.example.'
    )
  }

  let lastError
  for (const provider of providers) {
    try {
      return await provider()
    } catch (err) {
      lastError = err
    }
  }

  throw lastError ?? new Error(FAILURE)
}
