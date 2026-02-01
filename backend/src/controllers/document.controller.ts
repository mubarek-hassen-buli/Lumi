import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.middleware";
import { generateDocument } from "../services/ai.service";
import { db } from "../db";
import { document, user, session } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const app = new Hono<{
  Variables: {
    user: typeof user.$inferSelect;
    session: typeof session.$inferSelect;
  };
}>();

// Generate Document
app.post("/generate", authMiddleware, async (c) => {
  const { content, type } = await c.req.json();
  const session = c.get("session");
  const user = c.get("user");

  if (!content || !type) {
    return c.json({ error: "Content and type are required" }, 400);
  }

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

    return c.json(newDoc);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to generate document" }, 500);
  }
});

// Get All Documents
app.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const docs = await db.select()
    .from(document)
    .where(eq(document.userId, user.id))
    .orderBy(desc(document.createdAt));

  return c.json(docs);
});

// Get Single Document by ID
app.get("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
  }

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

export default app;
