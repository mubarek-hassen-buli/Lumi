import { Hono } from "hono";
import { auth } from "../config/auth";

const app = new Hono();

app.get("/*", (c) => {
  return auth.handler(c.req.raw);
});

app.post("/*", (c) => {
  return auth.handler(c.req.raw);
});

export default app;
