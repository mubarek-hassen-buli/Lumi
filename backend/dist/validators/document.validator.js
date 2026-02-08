"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.updateDocSchema = exports.generateDocSchema = void 0;
const zod_1 = require("zod");
// Schema for generating new documents
exports.generateDocSchema = zod_1.z.object({
    content: zod_1.z.string()
        .min(10, "Content must be at least 10 characters")
        .max(10000, "Content cannot exceed 10,000 characters")
        .trim(),
    type: zod_1.z.enum(['contract', 'proposal', 'sow'], {
        message: "Type must be contract, proposal, or sow"
    }),
});
// Schema for updating existing documents
exports.updateDocSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    generatedContent: zod_1.z.string().min(1).max(50000).optional(),
    status: zod_1.z.enum(['draft', 'completed']).optional(),
});
// Schema for validating ID parameters
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});
