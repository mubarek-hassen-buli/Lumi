"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.document = exports.verification = exports.account = exports.session = exports.user = void 0;
// Core schema definition
const pg_core_1 = require("drizzle-orm/pg-core");
exports.user = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    emailVerified: (0, pg_core_1.boolean)("email_verified").notNull(),
    image: (0, pg_core_1.text)("image"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull(),
});
exports.session = (0, pg_core_1.pgTable)("session", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    token: (0, pg_core_1.text)("token").notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull(),
    ipAddress: (0, pg_core_1.text)("ip_address"),
    userAgent: (0, pg_core_1.text)("user_agent"),
    userId: (0, pg_core_1.text)("user_id").notNull().references(() => exports.user.id),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)("session_user_id_idx").on(table.userId),
    tokenIdx: (0, pg_core_1.index)("session_token_idx").on(table.token),
}));
exports.account = (0, pg_core_1.pgTable)("account", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    accountId: (0, pg_core_1.text)("account_id").notNull(),
    providerId: (0, pg_core_1.text)("provider_id").notNull(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(() => exports.user.id),
    accessToken: (0, pg_core_1.text)("access_token"),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    idToken: (0, pg_core_1.text)("id_token"),
    accessTokenExpiresAt: (0, pg_core_1.timestamp)("access_token_expires_at"),
    refreshTokenExpiresAt: (0, pg_core_1.timestamp)("refresh_token_expires_at"),
    scope: (0, pg_core_1.text)("scope"),
    password: (0, pg_core_1.text)("password"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull(),
});
exports.verification = (0, pg_core_1.pgTable)("verification", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    identifier: (0, pg_core_1.text)("identifier").notNull(),
    value: (0, pg_core_1.text)("value").notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
exports.document = (0, pg_core_1.pgTable)("document", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().references(() => exports.user.id),
    title: (0, pg_core_1.text)("title").notNull().default("Untitled Document"),
    originalContent: (0, pg_core_1.text)("original_content").notNull(),
    generatedContent: (0, pg_core_1.text)("generated_content"),
    type: (0, pg_core_1.text)("type").notNull(), // 'contract', 'proposal', 'sow'
    status: (0, pg_core_1.text)("status").notNull().default("draft"), // 'draft', 'completed'
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)("document_user_id_idx").on(table.userId),
    createdAtIdx: (0, pg_core_1.index)("document_created_at_idx").on(table.createdAt),
    userIdCreatedAtIdx: (0, pg_core_1.index)("document_user_created_idx").on(table.userId, table.createdAt),
}));
