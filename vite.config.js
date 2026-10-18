import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Server-only SMTP settings consumed by the contact API route (api/contact.js).
// Vite only exposes VITE_-prefixed vars to the browser, so these stay on the server.
const SERVER_ENV_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_SECURE',
  'CONTACT_TO',
  'CONTACT_FROM',
]

// Serves api/contact.js during `npm run dev`, so the SMTP backend can be tested
// locally exactly the way it runs on Vercel. In production Vercel hosts this
// route automatically from the /api directory.
function contactApiPlugin() {
  return {
    name: 'contact-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/contact')) return next()
        try {
          const mod = await server.ssrLoadModule('/api/contact.js')
          await mod.default(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: err?.message || 'Contact API error.' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Copy server-only SMTP variables onto process.env for the dev middleware.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of SERVER_ENV_KEYS) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }

  return {
    plugins: [react(), contactApiPlugin()],
    build: {
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 1100,
      rollupOptions: {
        output: {
          manualChunks: {
            icons: ['react-icons'],
          },
        },
      },
    },
    server: {
      port: 5173,
      open: false,
    },
  }
})
