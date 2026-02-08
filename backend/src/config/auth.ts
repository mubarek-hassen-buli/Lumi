import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";

const trustedOrigins = ["http://localhost:3000"];
if (process.env.FRONTEND_URL) {
  trustedOrigins.push(process.env.FRONTEND_URL);
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", 
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  trustedOrigins,
});
