// Cloudflare Pages Function for POST /api/contact.
//
// Cloudflare runs on the Workers runtime, which has no Node net/tls modules, so
// Nodemailer (see api/contact.js) cannot run here. There are two ways to deliver
// mail from the Cloudflare deployment:
//
//   1) Set CONTACT_RELAY_URL (Cloudflare Pages -> Settings -> Environment
//      variables) to your Vercel deployment's /api/contact URL. This function
//      then forwards the request there, so SMTP keeps working while Cloudflare
//      serves the site.
//   2) Leave CONTACT_RELAY_URL unset. This endpoint answers with JSON, so the
//      browser falls back to EmailJS (which is independent of Vercel).
//
// Either way this route always replies with JSON, so the client never mistakes a
// static HTML fallback page for a delivered message.

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' }

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS })
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed.' })
  }

  const relay = env.CONTACT_RELAY_URL
  if (!relay) {
    return json(501, {
      ok: false,
      error:
        'SMTP relay not configured on Cloudflare. Set CONTACT_RELAY_URL to your Vercel /api/contact URL, or rely on the EmailJS fallback.',
    })
  }

  const body = await request.text()

  try {
    const upstream = await fetch(relay, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body,
    })
    const text = await upstream.text()
    return new Response(text || JSON.stringify({ ok: false, error: 'Empty relay response.' }), {
      status: upstream.status,
      headers: JSON_HEADERS,
    })
  } catch (err) {
    return json(502, { ok: false, error: err?.message || 'SMTP relay failed.' })
  }
}
