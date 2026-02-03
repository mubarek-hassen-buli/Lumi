import { rateLimiter } from "hono-rate-limiter";

// General API rate limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
});

// AI generation rate limiter - 5 requests per minute
export const aiLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // 5 AI generations per minute
  keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
});


// Authentication rate limiter - 5 attempts per 15 minutes
export const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5, // 5 login attempts per 15 min
  keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
});
