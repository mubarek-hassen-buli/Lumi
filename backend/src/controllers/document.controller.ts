import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aiLimiter } from "../middlewares/rate-limit.middleware";
import { generateDocument } from "../services/ai.service";
import { db } from "../db";
import { document, user, session } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { generateDocSchema, updateDocSchema, idParamSchema } from "../validators/document.validator";
import logger from "../utils/logger";

const app = new Hono<{
  Variables: {
    user: typeof user.$inferSelect;
    session: typeof session.$inferSelect;
  };
}>();

// Generate Document
app.post("/generate", aiLimiter, authMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get("user");

  // Validate input
  const validated = generateDocSchema.safeParse(body);
  
  if (!validated.success) {
    return c.json({ 
      error: "Validation failed", 
      details: validated.error.issues 
    }, 400);
  }

  const { content, type } = validated.data;

  try {
    // 1. Call AI
    const generated = await generateDocument(content, type);

    // 2. Save to DB
    const [newDoc] = await db.insert(document).values({
      userId: user.id,
      title: `${type.toUpperCase()} - ${new Date().toLocaleDateString()}`,
      originalContent: content,
      generatedContent: generated,
      type: type,
      status: "draft",
    }).returning();

    logger.info({ userId: user.id, docId: newDoc.id, type }, 'Document generated');
    return c.json(newDoc);
  } catch (error) {
    logger.error({ error, userId: user.id, type }, 'Failed to generate document');
    return c.json({ error: "Failed to generate document" }, 500);
  }
});

// Get All Documents (with pagination)
app.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const cursor = Number(c.req.query('cursor')) || 0;
  const limit = 20;
  
  // Fetch limit + 1 to check if there are more results
  const docs = await db.select()
    .from(document)
    .where(eq(document.userId, user.id))
    .orderBy(desc(document.createdAt))
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
app.get("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  
  // Validate ID parameter
  const paramValidation = idParamSchema.safeParse({ id: c.req.param("id") });
  
  if (!paramValidation.success) {
    return c.json({ error: "Invalid ID format" }, 400);
  }
  
  const id = paramValidation.data.id;

  const [doc] = await db.select()
    .from(document)
    .where(eq(document.id, id));

  if (!doc) {
    return c.json({ error: "Document not found" }, 404);
  }

  if (doc.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  return c.json(doc);
});

// Delete Document
app.delete("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  
  // Validate ID parameter
  const paramValidation = idParamSchema.safeParse({ id: c.req.param("id") });
  
  if (!paramValidation.success) {
    return c.json({ error: "Invalid ID format" }, 400);
  }
  
  const id = paramValidation.data.id;

  // Check ownership
  const [doc] = await db.select()
    .from(document)
    .where(eq(document.id, id));

  if (!doc) {
    return c.json({ error: "Document not found" }, 404);
  }

  if (doc.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  await db.delete(document)
    .where(eq(document.id, id));

  return c.json({ success: true });
});

// Update Document
app.patch("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  
  // Validate ID parameter
  const paramValidation = idParamSchema.safeParse({ id: c.req.param("id") });
  
  if (!paramValidation.success) {
    return c.json({ error: "Invalid ID format" }, 400);
  }
  
  const id = paramValidation.data.id;
  
  // Validate request body
  const body = await c.req.json();
  const validated = updateDocSchema.safeParse(body);
  
  if (!validated.success) {
    return c.json({ 
      error: "Validation failed", 
      details: validated.error.issues 
    }, 400);
  }
  
  // Check ownership
  const [doc] = await db.select()
    .from(document)
    .where(eq(document.id, id));
  
  if (!doc) {
    return c.json({ error: "Document not found" }, 404);
  }
  
  if (doc.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  // Update document
  const [updated] = await db.update(document)
    .set({
      ...validated.data,
      updatedAt: new Date(),
    })
    .where(eq(document.id, id))
    .returning();
  
  return c.json(updated);
});

export default app;
