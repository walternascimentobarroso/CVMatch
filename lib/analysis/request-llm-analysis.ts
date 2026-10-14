import { z } from "zod";

import { AnalysisError } from "@/lib/analysis/analysis-error";
import {
  llmAnalysisSchema,
  type LlmAnalysis,
} from "@/lib/analysis/llm-analysis-schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/analysis/prompt";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const TIMEOUT_MS = 30_000;

type LlmAnalysisRequest = {
  cvText: string;
  jobText: string;
  apiKey: string;
  model: string;
};

async function fetchCompletion(request: LlmAnalysisRequest): Promise<unknown> {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${request.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt(request.cvText, request.jobText),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cv_analysis",
          strict: true,
          schema: z.toJSONSchema(llmAnalysisSchema),
        },
      },
    }),
  });
  if (response.status === 429) throw new AnalysisError("rate_limit");
  if (!response.ok) throw new AnalysisError("invalid_response");
  return response.json();
}

function isTimeout(error: unknown) {
  return error instanceof Error && error.name === "TimeoutError";
}

function parseCompletion(completion: unknown): LlmAnalysis {
  try {
    const content = (completion as { choices: { message: { content: string } }[] })
      .choices[0].message.content;
    return llmAnalysisSchema.parse(JSON.parse(content));
  } catch {
    throw new AnalysisError("invalid_response");
  }
}

export async function requestLlmAnalysis(
  request: LlmAnalysisRequest,
): Promise<LlmAnalysis> {
  let completion: unknown;
  try {
    completion = await fetchCompletion(request);
  } catch (error) {
    if (isTimeout(error)) throw new AnalysisError("timeout");
    throw error;
  }
  return parseCompletion(completion);
}
