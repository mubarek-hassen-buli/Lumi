import { Hono } from "hono";
import { auth } from "../config/auth";
const app = new Hono();
// Handle OPTIONS preflight requests
app.options("/*", (c) => c.body(null, 204));
app.get("/*", (c) => {
    return auth.handler(c.req.raw);
});
app.post("/*", (c) => {
    return auth.handler(c.req.raw);
});
export default app;
