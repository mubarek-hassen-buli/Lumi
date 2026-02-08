"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const factory_1 = require("hono/factory");
const auth_1 = require("../config/auth");
exports.authMiddleware = (0, factory_1.createMiddleware)(async (c, next) => {
    const session = await auth_1.auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    c.set("user", session.user);
    c.set("session", session.session);
    await next();
});
