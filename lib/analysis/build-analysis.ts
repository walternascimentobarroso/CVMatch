import { AnalysisError } from "@/lib/analysis/analysis-error";
import type { LlmAnalysis } from "@/lib/analysis/llm-analysis-schema";
import {
  CATEGORY_WEIGHTS,
  categoryScores,
  globalScore,
} from "@/lib/analysis/scores";
import { keepSuggestionsFoundInCv } from "@/lib/analysis/suggestions";

export function buildAnalysis(llmAnalysis: LlmAnalysis, cvText: string) {
  const { requirements } = llmAnalysis;
  if (requirements.length === 0) throw new AnalysisError("no_requirements");

  const scores = categoryScores(requirements);
  return {
    language: llmAnalysis.jobLanguage,
    globalScore: globalScore(scores),
    categoryScores: scores,
    categoryWeights: CATEGORY_WEIGHTS,
    coveredRequirements: requirements.filter(
      (requirement) => requirement.status === "covered",
    ),
    missingRequirements: requirements.filter(
      (requirement) => requirement.status !== "covered",
    ),
    suggestions: keepSuggestionsFoundInCv(llmAnalysis.suggestions, cvText),
  };
}
