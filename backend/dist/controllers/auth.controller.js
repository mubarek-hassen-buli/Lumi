"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const auth_1 = require("../config/auth");
const app = new hono_1.Hono();
app.get("/*", (c) => {
    return auth_1.auth.handler(c.req.raw);
});
app.post("/*", (c) => {
    return auth_1.auth.handler(c.req.raw);
});
exports.default = app;
