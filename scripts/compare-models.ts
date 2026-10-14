import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

import { AnalysisError } from "@/lib/analysis/analysis-error";
import { buildAnalysis } from "@/lib/analysis/build-analysis";
import { requestLlmAnalysis } from "@/lib/analysis/request-llm-analysis";

const MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
const JOB_COUNT = 5;
const RUNS_PER_JOB = 3;
// A Groq limita cada modelo a 8000 tokens por minuto e uma análise gasta até cerca de 4000.
const PAUSE_BETWEEN_ROUNDS_MS = 40_000;
const FIXTURES_DIR = "fixtures";
const OUTPUT_DIR = `${FIXTURES_DIR}/comparison`;

type Run = {
  model: string;
  job: number;
  run: number;
  seconds: number;
  error?: string;
  globalScore?: number;
  language?: string;
  suggestionsKept?: number;
  suggestionsDiscarded?: number;
};

function readFixture(name: string) {
  return readFileSync(`${FIXTURES_DIR}/${name}`, "utf8").trim();
}

async function runAnalysis(
  model: string,
  job: number,
  run: number,
  cvText: string,
  apiKey: string,
): Promise<Run> {
  const startedAt = performance.now();
  const elapsedSeconds = () =>
    Math.round((performance.now() - startedAt) / 100) / 10;
  try {
    const llmAnalysis = await requestLlmAnalysis({
      cvText,
      jobText: readFixture(`vaga-${job}.txt`),
      apiKey,
      model,
    });
    const seconds = elapsedSeconds();
    const analysis = buildAnalysis(llmAnalysis, cvText);
    writeFileSync(
      `${OUTPUT_DIR}/${model.replace("/", "_")}-vaga-${job}-run-${run}.json`,
      JSON.stringify(analysis, null, 2),
    );
    return {
      model,
      job,
      run,
      seconds,
      globalScore: analysis.globalScore,
      language: analysis.language,
      suggestionsKept: analysis.suggestions.length,
      suggestionsDiscarded:
        llmAnalysis.suggestions.length - analysis.suggestions.length,
    };
  } catch (error) {
    if (!(error instanceof AnalysisError)) throw error;
    return { model, job, run, seconds: elapsedSeconds(), error: error.code };
  }
}

function summarize(runs: Run[]) {
  return MODELS.flatMap((model) =>
    Array.from({ length: JOB_COUNT }, (_, index) => {
      const jobRuns = runs.filter(
        (run) => run.model === model && run.job === index + 1,
      );
      const scores = jobRuns.flatMap((run) => run.globalScore ?? []);
      return {
        model,
        job: index + 1,
        scores: scores.join(" / "),
        spread: scores.length ? Math.max(...scores) - Math.min(...scores) : "-",
        errors: jobRuns.filter((run) => run.error).length,
        maxSeconds: Math.max(...jobRuns.map((run) => run.seconds)),
        discarded: jobRuns.reduce(
          (total, run) => total + (run.suggestionsDiscarded ?? 0),
          0,
        ),
      };
    }),
  );
}

async function main() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY não está definida no .env");

  const cvText = readFixture("cv.txt");
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const runs: Run[] = [];
  for (let job = 1; job <= JOB_COUNT; job++) {
    for (let run = 1; run <= RUNS_PER_JOB; run++) {
      for (const model of MODELS) {
        runs.push(await runAnalysis(model, job, run, cvText, apiKey));
      }
      await new Promise((resolve) =>
        setTimeout(resolve, PAUSE_BETWEEN_ROUNDS_MS),
      );
    }
  }
  console.table(runs);
  console.table(summarize(runs));
}

main();
