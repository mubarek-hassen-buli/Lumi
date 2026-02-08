"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.aiLimiter = exports.apiLimiter = void 0;
const hono_rate_limiter_1 = require("hono-rate-limiter");
// General API rate limiter - 100 requests per 15 minutes
exports.apiLimiter = (0, hono_rate_limiter_1.rateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: "draft-6",
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
});
// AI generation rate limiter - 5 requests per minute
exports.aiLimiter = (0, hono_rate_limiter_1.rateLimiter)({
    windowMs: 60 * 1000, // 1 minute
    limit: 5, // 5 AI generations per minute
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
});
// Authentication rate limiter - 5 attempts per 15 minutes
exports.authLimiter = (0, hono_rate_limiter_1.rateLimiter)({
    windowMs: 15 * 60 * 1000,
    limit: 5, // 5 login attempts per 15 min
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
});
