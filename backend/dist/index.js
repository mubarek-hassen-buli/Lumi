import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { apiLimiter } from './middlewares/rate-limit.middleware';
const app = new Hono();
app.onError((err, c) => {
    console.error('❌ Global Error:', err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});
app.use('*', logger());
app.use('*', cors({
    origin: (origin) => {
        const frontendUrl = process.env.FRONTEND_URL;
        // Allow unrestricted access in development
        if (process.env.NODE_ENV !== 'production') {
            return origin;
        }
        // In production, strictly match the FRONTEND_URL
        if (!frontendUrl) {
            console.error("❌ FRONTEND_URL is not set in environment variables!");
            return origin; // Fallback: allow to prevent crash, but log error
        }
        // Check if origin matches or if it's a Vercel preview deployment
        if (origin === frontendUrl || origin.endsWith('.vercel.app')) {
            return origin;
        }
        console.warn(`⚠️ Blocked CORS request from: ${origin}, expected: ${frontendUrl}`);
        return frontendUrl;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
}));
// Explicit OPTIONS handler for preflight checks
app.options('*', (c) => c.body(null, 204));
// Apply rate limiting to all API routes
app.use('/api/*', apiLimiter);
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
import authController from './controllers/auth.controller';
import documentController from './controllers/document.controller';
app.route('/api/auth', authController); // Correcting path to be more explicit if needed, but keeping consistent with auth controller's internal routing
app.route('/api/documents', documentController);
app.get('/health', (c) => {
    return c.json({ status: 'ok', uptime: process.uptime() });
});
import { handle } from 'hono/vercel';
// ... existing code ...
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
if (!isVercel) {
    const port = Number(process.env.PORT) || 4000;
    console.log(`Server is running on port ${port}`);
    serve({
        fetch: app.fetch,
        port
    });
}
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
export default handle(app);
