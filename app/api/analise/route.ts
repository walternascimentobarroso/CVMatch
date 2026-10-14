import {
  AnalysisError,
  type AnalysisErrorCode,
} from "@/lib/analysis/analysis-error";
import { buildAnalysis } from "@/lib/analysis/build-analysis";
import { requestLlmAnalysis } from "@/lib/analysis/request-llm-analysis";
import { getGroqApiKey } from "@/lib/groq-api-key";

const GROQ_MODEL = "qwen/qwen3.8-27b";

const HTTP_STATUS: Record<AnalysisErrorCode, number> = {
  empty_input: 400,
  missing_api_key: 500,
  rate_limit: 429,
  timeout: 504,
  invalid_response: 502,
  no_requirements: 422,
};

function trimmedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function readTexts(request: Request) {
  const body = await request.json().catch(() => null);
  const cvText = trimmedText(body?.cvText);
  const jobText = trimmedText(body?.jobText);
  if (!cvText || !jobText) throw new AnalysisError("empty_input");
  return { cvText, jobText };
}

function readGroqApiKey() {
  try {
    return getGroqApiKey();
  } catch {
    throw new AnalysisError("missing_api_key");
  }
}

export async function POST(request: Request) {
  try {
    const { cvText, jobText } = await readTexts(request);
    const llmAnalysis = await requestLlmAnalysis({
      cvText,
      jobText,
      apiKey: readGroqApiKey(),
      model: GROQ_MODEL,
    });
    return Response.json(buildAnalysis(llmAnalysis, cvText));
  } catch (error) {
    if (!(error instanceof AnalysisError)) throw error;
    return Response.json(
      { error: error.code },
      { status: HTTP_STATUS[error.code] },
    );
  }
}
