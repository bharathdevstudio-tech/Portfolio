// SMTP contact endpoint.
//
// Deployed as a serverless function (Vercel: /api/contact). The browser POSTs
// the form here and this function relays the message through your SMTP server
// via Nodemailer. Credentials stay on the server — they are never bundled into
// the client.
//
// Required environment variables (server-side, no VITE_ prefix):
//   SMTP_HOST      e.g. smtp.gmail.com
//   SMTP_PORT      e.g. 587 (STARTTLS) or 465 (SSL)
//   SMTP_USER      login / sender address
//   SMTP_PASS      password / app password
//   SMTP_SECURE    optional "true"/"false" (defaults to true when port is 465)
//   CONTACT_TO     optional recipient (defaults to SMTP_USER)
//   CONTACT_FROM   optional From address (defaults to SMTP_USER)

import nodemailer from 'nodemailer'

const MAX_BODY = 20_000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

// Vercel pre-parses JSON bodies; plain Node (vite dev middleware) does not, so
// fall back to reading the raw stream when req.body is missing.
function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body)
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > MAX_BODY) {
        reject(new Error('Payload too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  let payload
  try {
    payload = await readJsonBody(req)
  } catch {
    return sendJson(res, 400, { error: 'Invalid request body.' })
  }

  const name = String(payload.name || '').trim()
  const email = String(payload.email || '').trim()
  const phone = String(payload.phone || '').trim()
  const subject = String(payload.subject || '').trim()
  const message = String(payload.message || '').trim()

  if (!name || !email || !message) {
    return sendJson(res, 400, { error: 'Name, email and message are required.' })
  }
  if (!EMAIL_RE.test(email)) {
    return sendJson(res, 400, { error: 'Please provide a valid email address.' })
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, CONTACT_TO, CONTACT_FROM } =
    process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return sendJson(res, 500, {
      error: 'Email server is not configured (missing SMTP_HOST / SMTP_USER / SMTP_PASS).',
    })
  }

  const port = Number(SMTP_PORT || 587)
  const secure = SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465
  const to = CONTACT_TO || SMTP_USER
  const from = CONTACT_FROM || SMTP_USER

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    await transporter.sendMail({
      from: `Portfolio Contact <${from}>`,
      to,
      replyTo: `${name} <${email}>`,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Phone:   ${phone || '—'}`,
        `Subject: ${subject || '—'}`,
        '',
        message,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
          <h2 style="margin:0 0 12px">New portfolio message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || '—')}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject || '—')}</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
      `,
    })

    return sendJson(res, 200, { ok: true })
  } catch (err) {
    console.error('[contact] SMTP send failed:', err?.message || err)
    return sendJson(res, 502, { error: 'Message could not be delivered. Please try again later.' })
  }
}
