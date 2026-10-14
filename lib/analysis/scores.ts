import {
  CATEGORIES,
  type Category,
  type Requirement,
} from "@/lib/analysis/llm-analysis-schema";

export const CATEGORY_WEIGHTS: Record<Category, number> = {
  technical_skills: 40,
  experience: 40,
  education: 10,
  languages: 10,
};

const IMPORTANCE_WEIGHT: Record<Requirement["importance"], number> = {
  required: 2,
  preferred: 1,
};

const STATUS_CREDIT: Record<Requirement["status"], number> = {
  covered: 1,
  partial: 0.5,
  missing: 0,
};

export type CategoryScores = Record<Category, number | null>;

export function categoryScore(requirements: Requirement[]): number | null {
  if (requirements.length === 0) return null;

  let totalWeight = 0;
  let coveredWeight = 0;
  for (const { importance, status } of requirements) {
    totalWeight += IMPORTANCE_WEIGHT[importance];
    coveredWeight += IMPORTANCE_WEIGHT[importance] * STATUS_CREDIT[status];
  }
  return Math.round((100 * coveredWeight) / totalWeight);
}

export function categoryScores(requirements: Requirement[]): CategoryScores {
  const scores = {} as CategoryScores;
  for (const category of CATEGORIES) {
    scores[category] = categoryScore(
      requirements.filter((requirement) => requirement.category === category),
    );
  }
  return scores;
}

export function globalScore(scores: CategoryScores): number {
  let totalWeight = 0;
  let weightedScore = 0;
  for (const category of CATEGORIES) {
    const score = scores[category];
    if (score === null) continue;
    totalWeight += CATEGORY_WEIGHTS[category];
    weightedScore += CATEGORY_WEIGHTS[category] * score;
  }
  return Math.round(weightedScore / totalWeight);
}
