import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateDocument = async (content: string, type: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are a professional legal document draper.
    Convert the following unstructured text into a professional ${type}.
    
    Rules:
    - Use Markdown formatting.
    - Be professional and formal.
    - Include appropriate legal clauses based on the context.
    - Return ONLY the document content in Markdown.

    Unstructured Text:
    "${content}"
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
