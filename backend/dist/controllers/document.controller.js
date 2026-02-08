"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rate_limit_middleware_1 = require("../middlewares/rate-limit.middleware");
const ai_service_1 = require("../services/ai.service");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const document_validator_1 = require("../validators/document.validator");
const logger_1 = __importDefault(require("../utils/logger"));
const app = new hono_1.Hono();
// Generate Document
app.post("/generate", rate_limit_middleware_1.aiLimiter, auth_middleware_1.authMiddleware, async (c) => {
    const body = await c.req.json();
    const user = c.get("user");
    // Validate input
    const validated = document_validator_1.generateDocSchema.safeParse(body);
    if (!validated.success) {
        return c.json({
            error: "Validation failed",
            details: validated.error.issues
        }, 400);
    }
    const { content, type } = validated.data;
    try {
        // 1. Call AI
        const generated = await (0, ai_service_1.generateDocument)(content, type);
        // 2. Save to DB
        const [newDoc] = await db_1.db.insert(schema_1.document).values({
            userId: user.id,
            title: `${type.toUpperCase()} - ${new Date().toLocaleDateString()}`,
            originalContent: content,
            generatedContent: generated,
            type: type,
            status: "draft",
        }).returning();
        logger_1.default.info({ userId: user.id, docId: newDoc.id, type }, 'Document generated');
        return c.json(newDoc);
    }
    catch (error) {
        logger_1.default.error({ error, userId: user.id, type }, 'Failed to generate document');
        return c.json({ error: "Failed to generate document" }, 500);
    }
});
// Get All Documents (with pagination)
app.get("/", auth_middleware_1.authMiddleware, async (c) => {
    const user = c.get("user");
    const cursor = Number(c.req.query('cursor')) || 0;
    const limit = 20;
    // Fetch limit + 1 to check if there are more results
    const docs = await db_1.db.select()
        .from(schema_1.document)
        .where((0, drizzle_orm_1.eq)(schema_1.document.userId, user.id))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.document.createdAt))
        .limit(limit + 1)
        .offset(cursor);
    // Check if there are more results
    const hasMore = docs.length > limit;
    const items = hasMore ? docs.slice(0, -1) : docs;
    return c.json({
        items,
        nextCursor: hasMore ? cursor + limit : null,
        hasMore,
    });
});
// Get Single Document by ID
app.get("/:id", auth_middleware_1.authMiddleware, async (c) => {
    const user = c.get("user");
    // Validate ID parameter
    const paramValidation = document_validator_1.idParamSchema.safeParse({ id: c.req.param("id") });
    if (!paramValidation.success) {
        return c.json({ error: "Invalid ID format" }, 400);
    }
    const id = paramValidation.data.id;
    const [doc] = await db_1.db.select()
        .from(schema_1.document)
        .where((0, drizzle_orm_1.eq)(schema_1.document.id, id));
    if (!doc) {
        return c.json({ error: "Document not found" }, 404);
    }
    if (doc.userId !== user.id) {
        return c.json({ error: "Unauthorized" }, 403);
    }
    return c.json(doc);
});
// Delete Document
app.delete("/:id", auth_middleware_1.authMiddleware, async (c) => {
    const user = c.get("user");
    // Validate ID parameter
    const paramValidation = document_validator_1.idParamSchema.safeParse({ id: c.req.param("id") });
    if (!paramValidation.success) {
        return c.json({ error: "Invalid ID format" }, 400);
    }
    const id = paramValidation.data.id;
    // Check ownership
    const [doc] = await db_1.db.select()
        .from(schema_1.document)
        .where((0, drizzle_orm_1.eq)(schema_1.document.id, id));
    if (!doc) {
        return c.json({ error: "Document not found" }, 404);
    }
    if (doc.userId !== user.id) {
        return c.json({ error: "Unauthorized" }, 403);
    }
    await db_1.db.delete(schema_1.document)
        .where((0, drizzle_orm_1.eq)(schema_1.document.id, id));
    return c.json({ success: true });
});
// Update Document
app.patch("/:id", auth_middleware_1.authMiddleware, async (c) => {
    const user = c.get("user");
    // Validate ID parameter
    const paramValidation = document_validator_1.idParamSchema.safeParse({ id: c.req.param("id") });
    if (!paramValidation.success) {
        logger_1.default.warn({ id: c.req.param("id"), errors: paramValidation.error.issues }, 'Invalid ID format for update');
        return c.json({ error: "Invalid ID format" }, 400);
    }
    const id = paramValidation.data.id;
    try {
        // Validate request body
        const body = await c.req.json();
        const validated = document_validator_1.updateDocSchema.safeParse(body);
        if (!validated.success) {
            logger_1.default.warn({
                id,
                errors: validated.error.issues,
                body
            }, 'Document update validation failed');
            return c.json({
                error: "Validation failed",
                details: validated.error.issues
            }, 400);
        }
        // Check ownership
        const [doc] = await db_1.db.select()
            .from(schema_1.document)
            .where((0, drizzle_orm_1.eq)(schema_1.document.id, id));
        if (!doc) {
            return c.json({ error: "Document not found" }, 404);
        }
        if (doc.userId !== user.id) {
            return c.json({ error: "Unauthorized" }, 403);
        }
        // Update document
        const [updated] = await db_1.db.update(schema_1.document)
            .set({
            ...validated.data,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.document.id, id))
            .returning();
        return c.json(updated);
    }
    catch (error) {
        logger_1.default.error({ error, docId: id }, 'Failed to parse JSON or update document');
        return c.json({ error: "Invalid JSON body or update failed" }, 400);
    }
});
exports.default = app;
