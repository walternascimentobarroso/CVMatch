import type { Suggestion } from "@/lib/analysis/llm-analysis-schema";

function collapseWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function keepSuggestionsFoundInCv(
  suggestions: Suggestion[],
  cvText: string,
): Suggestion[] {
  const cv = collapseWhitespace(cvText);
  return suggestions.filter(({ original }) => {
    const excerpt = collapseWhitespace(original);
    return excerpt !== "" && cv.includes(excerpt);
  });
}
