"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { AnalysisResult } from "@/components/analysis-result";
import { CvBlock, useStoredCv } from "@/components/cv-block";
import { ScoreRing } from "@/components/score-ring";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AnalysisErrorCode } from "@/lib/analysis/analysis-error";
import type { Analysis } from "@/lib/analysis/build-analysis";

const ERROR_MESSAGES: Record<AnalysisErrorCode, string> = {
  empty_input: "Falta o CV ou a descrição da vaga.",
  missing_api_key: "A GROQ_API_KEY não está configurada no .env.",
  rate_limit: "O limite da API foi atingido. Tenta daqui a pouco.",
  timeout: "A análise demorou demasiado.",
  invalid_response: "O modelo devolveu uma resposta inválida.",
  no_requirements: "Não foi possível identificar requisitos na vaga.",
};

const GENERIC_ERROR_MESSAGE =
  "Não foi possível concluir a análise. Verifica a ligação e tenta de novo.";

function errorMessage(code: unknown) {
  return ERROR_MESSAGES[code as AnalysisErrorCode] ?? GENERIC_ERROR_MESSAGE;
}

type AnalysisOutcome = { analysis: Analysis } | { error: string };

async function requestAnalysis(
  cvText: string,
  jobText: string,
): Promise<AnalysisOutcome> {
  try {
    const response = await fetch("/api/analise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText, jobText }),
    });
    const body = await response.json();
    if (!response.ok) return { error: errorMessage(body?.error) };
    return { analysis: body };
  } catch {
    return { error: GENERIC_ERROR_MESSAGE };
  }
}

function missingInputHint(hasCv: boolean, hasJob: boolean) {
  if (!hasCv && !hasJob) return "Falta carregar o CV e colar a vaga.";
  if (!hasCv) return "Falta carregar o CV.";
  if (!hasJob) return "Falta colar a vaga.";
  return null;
}

export function AnalysisPanel() {
  const cv = useStoredCv();
  const [jobText, setJobText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hint = missingInputHint(Boolean(cv), jobText.trim() !== "");

  async function analyze() {
    if (!cv) return;
    setAnalysis(null);
    setError(null);
    setIsAnalyzing(true);
    const outcome = await requestAnalysis(cv.text, jobText);
    setIsAnalyzing(false);
    if ("error" in outcome) {
      setError(outcome.error);
      return;
    }
    setAnalysis(outcome.analysis);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <CvBlock disabled={isAnalyzing} />

        <ScoreRing
          score={analysis?.globalScore ?? null}
          missingCount={analysis?.missingRequirements.length ?? 0}
        />

        <Card className="h-full shadow-lg">
          <CardHeader>
            <CardTitle>
              <label
                htmlFor="job-text"
                className="text-sm font-bold tracking-widest text-muted-foreground"
              >
                DESCRIÇÃO DA VAGA
              </label>
            </CardTitle>
            {jobText.trim() !== "" && (
              <CardAction>
                <StatusBadge>COLADO ✓</StatusBadge>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            <textarea
              id="job-text"
              rows={10}
              value={jobText}
              disabled={isAnalyzing}
              onChange={(event) => setJobText(event.target.value)}
              placeholder="Cola aqui o texto da vaga…"
              className="w-full rounded-lg border border-input bg-transparent p-3 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          className="h-14 rounded-xl px-10 text-lg shadow-lg"
          disabled={hint !== null || isAnalyzing}
          onClick={analyze}
        >
          {isAnalyzing && <Loader2 className="animate-spin" aria-hidden />}
          {isAnalyzing ? "A analisar…" : "Analisar"}
        </Button>
        {hint && <p className="text-muted-foreground">{hint}</p>}
        {isAnalyzing && (
          <span role="status" className="sr-only">
            A analisar…
          </span>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <p className="text-destructive">{error}</p>
          <Button variant="outline" disabled={hint !== null} onClick={analyze}>
            Tentar de novo
          </Button>
        </div>
      )}

      {analysis && <AnalysisResult analysis={analysis} />}
    </div>
  );
}
