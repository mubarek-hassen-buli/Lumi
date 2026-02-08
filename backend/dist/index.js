"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = exports.PATCH = exports.DELETE = exports.PUT = exports.POST = exports.GET = void 0;
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const logger_1 = require("hono/logger");
const cors_1 = require("hono/cors");
const rate_limit_middleware_1 = require("./middlewares/rate-limit.middleware");
const app = new hono_1.Hono();
app.onError((err, c) => {
    console.error('❌ Global Error:', err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});
app.use('*', (0, logger_1.logger)());
app.use('*', (0, cors_1.cors)({
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
app.use('/api/*', rate_limit_middleware_1.apiLimiter);
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const document_controller_1 = __importDefault(require("./controllers/document.controller"));
app.route('/api/auth', auth_controller_1.default); // Correcting path to be more explicit if needed, but keeping consistent with auth controller's internal routing
app.route('/api/documents', document_controller_1.default);
app.get('/health', (c) => {
    return c.json({ status: 'ok', uptime: process.uptime() });
});
const vercel_1 = require("hono/vercel");
// ... existing code ...
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
if (!isVercel) {
    const port = Number(process.env.PORT) || 4000;
    console.log(`Server is running on port ${port}`);
    (0, node_server_1.serve)({
        fetch: app.fetch,
        port
    });
}
exports.GET = (0, vercel_1.handle)(app);
exports.POST = (0, vercel_1.handle)(app);
exports.PUT = (0, vercel_1.handle)(app);
exports.DELETE = (0, vercel_1.handle)(app);
exports.PATCH = (0, vercel_1.handle)(app);
exports.OPTIONS = (0, vercel_1.handle)(app);
exports.default = (0, vercel_1.handle)(app);
