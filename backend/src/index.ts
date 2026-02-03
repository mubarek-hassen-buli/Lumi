import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { apiLimiter } from './middlewares/rate-limit.middleware'

const app = new Hono()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL!]
      : ["http://localhost:3000"], // Explicitly allow Frontend
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true, // Required for BetterAuth cookies
  })
)

// Apply rate limiting to all API routes
app.use('/api/*', apiLimiter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

import authController from './controllers/auth.controller'
import documentController from './controllers/document.controller'

app.route('/api/auth', authController) // Correcting path to be more explicit if needed, but keeping consistent with auth controller's internal routing
app.route('/api/documents', documentController)

app.get('/health', (c) => {
  return c.json({ status: 'ok', uptime: process.uptime() })
})

const port = 4000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
