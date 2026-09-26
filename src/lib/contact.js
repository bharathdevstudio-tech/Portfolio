// Contact form integration adapter.
//
// Mark a provider to route real messages. Never commit secret keys to the repo —
// use environment variables (create a .env file from .env.example).
//
//  1) Formspree:            VITE_FORMSPREE_ENDPOINT="https://formspree.io/f/yourid"
//  2) EmailJS:              VITE_EMAILJS_SERVICE_ID + VITE_EMAILJS_TEMPLATE_ID + VITE_EMAILJS_PUBLIC_KEY
//  3) Custom backend API:   VITE_CONTACT_API="https://your-api.example.com/contact"
//
// If none are configured, submit shows a clear "not connected" notice — it never
// pretends a message was sent.

export function isContactConfigured() {
  const env = import.meta.env ?? {}
  return Boolean(
    env.VITE_FORMSPREE_ENDPOINT || env.VITE_CONTACT_API || env.VITE_EMAILJS_SERVICE_ID
  )
}

export async function sendContactMessage({ name, email, message }) {
  const env = import.meta.env ?? {}
  const payload = { name, email, message }

  // 1) Formspree — plain JSON POST.
  if (env.VITE_FORMSPREE_ENDPOINT) {
    const res = await fetch(env.VITE_FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Message could not be delivered. Please try again later.')
    return 'Message sent successfully — I will get back to you soon.'
  }

  // 2) Custom backend API.
  if (env.VITE_CONTACT_API) {
    const res = await fetch(env.VITE_CONTACT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Message could not be delivered. Please try again later.')
    return 'Message sent successfully — I will get back to you soon.'
  }

  // 3) EmailJS — uses the public REST API (no extra package required).
  //    Keys come from your EmailJS dashboard.
  if (env.VITE_EMAILJS_SERVICE_ID) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: env.VITE_EMAILJS_SERVICE_ID,
          template_id: env.VITE_EMAILJS_TEMPLATE_ID,
          user_id: env.VITE_EMAILJS_PUBLIC_KEY,
          template_params: payload,
        }),
      })
      if (!res.ok) throw new Error('bad response')
      return 'Message sent successfully — I will get back to you soon.'
    } catch {
      throw new Error('Email service is not configured correctly. Please try again later.')
    }
  }

  throw new Error(
    'Contact form is not connected yet. Configure a provider via VITE_FORMSPREE_ENDPOINT, VITE_CONTACT_API, or EmailJS variables — see src/lib/contact.js.'
  )
}