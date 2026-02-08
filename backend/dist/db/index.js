import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';
dotenv.config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("❌ DATABASE_URL is not defined");
}
const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });
