import { z } from 'zod';
// Schema for generating new documents
export const generateDocSchema = z.object({
    content: z.string()
        .min(10, "Content must be at least 10 characters")
        .max(10000, "Content cannot exceed 10,000 characters")
        .trim(),
    type: z.enum(['contract', 'proposal', 'sow'], {
        message: "Type must be contract, proposal, or sow"
    }),
});
// Schema for updating existing documents
export const updateDocSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    generatedContent: z.string().min(1).max(50000).optional(),
    status: z.enum(['draft', 'completed']).optional(),
});
// Schema for validating ID parameters
export const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});
