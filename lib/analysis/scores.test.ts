import { describe, expect, it } from "vitest";

import type { Requirement } from "@/lib/analysis/llm-analysis-schema";
import {
  categoryScore,
  categoryScores,
  globalScore,
} from "@/lib/analysis/scores";

function requirement(
  importance: Requirement["importance"],
  status: Requirement["status"],
  category: Requirement["category"] = "technical_skills",
): Requirement {
  return { description: "requisito fictício", category, importance, status };
}

describe("categoryScore", () => {
  it("dá 100 quando todos os requisitos estão cobertos", () => {
    expect(
      categoryScore([
        requirement("required", "covered"),
        requirement("preferred", "covered"),
      ]),
    ).toBe(100);
  });

  it("dá 0 quando todos os requisitos estão em falta", () => {
    expect(categoryScore([requirement("required", "missing")])).toBe(0);
  });

  it("pesa um obrigatório o dobro de um desejável", () => {
    expect(
      categoryScore([
        requirement("required", "covered"),
        requirement("preferred", "missing"),
      ]),
    ).toBe(67);
    expect(
      categoryScore([
        requirement("required", "missing"),
        requirement("preferred", "covered"),
      ]),
    ).toBe(33);
  });

  it("conta um parcial como metade de um coberto", () => {
    expect(categoryScore([requirement("required", "partial")])).toBe(50);
    expect(
      categoryScore([
        requirement("required", "partial"),
        requirement("preferred", "covered"),
      ]),
    ).toBe(67);
  });

  it("devolve null para uma categoria sem requisitos", () => {
    expect(categoryScore([])).toBeNull();
  });
});

describe("categoryScores", () => {
  it("marca como não aplicável a categoria que a vaga não menciona", () => {
    expect(
      categoryScores([
        requirement("required", "covered", "technical_skills"),
        requirement("required", "missing", "experience"),
      ]),
    ).toEqual({
      technical_skills: 100,
      experience: 0,
      education: null,
      languages: null,
    });
  });
});

describe("globalScore", () => {
  it("usa os pesos 40, 40, 10 e 10 quando todas as categorias se aplicam", () => {
    expect(
      globalScore({
        technical_skills: 100,
        experience: 50,
        education: 0,
        languages: 100,
      }),
    ).toBe(70);
  });

  it("renormaliza os pesos sobre as categorias aplicáveis", () => {
    expect(
      globalScore({
        technical_skills: 100,
        experience: null,
        education: 0,
        languages: null,
      }),
    ).toBe(80);
    expect(
      globalScore({
        technical_skills: 80,
        experience: 40,
        education: null,
        languages: null,
      }),
    ).toBe(60);
  });

  it("arredonda a inteiro", () => {
    expect(
      globalScore({
        technical_skills: 67,
        experience: 33,
        education: 50,
        languages: null,
      }),
    ).toBe(50);
  });
});
