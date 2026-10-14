import { z } from "zod";

export const CATEGORIES = [
  "technical_skills",
  "experience",
  "education",
  "languages",
] as const;

const requirementSchema = z.object({
  description: z.string(),
  category: z.enum(CATEGORIES),
  importance: z.enum(["required", "preferred"]),
  status: z.enum(["covered", "partial", "missing"]),
});

const suggestionSchema = z.object({
  original: z.string(),
  proposed: z.string(),
});

export const llmAnalysisSchema = z.object({
  jobLanguage: z.enum(["pt", "en"]),
  requirements: z.array(requirementSchema),
  suggestions: z.array(suggestionSchema),
});

export type Category = (typeof CATEGORIES)[number];
export type Requirement = z.infer<typeof requirementSchema>;
export type Suggestion = z.infer<typeof suggestionSchema>;
export type LlmAnalysis = z.infer<typeof llmAnalysisSchema>;
