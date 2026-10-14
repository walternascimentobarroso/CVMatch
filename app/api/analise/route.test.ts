import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/analise/route";

vi.mock("server-only", () => ({}));

const CV_TEXT = "Engenheira de software fictícia com experiência em Node.js";
const JOB_TEXT = "Vaga fictícia: procuramos experiência em Node.js";

const LLM_ANALYSIS = {
  jobLanguage: "pt",
  requirements: [
    {
      description: "Experiência em Node.js",
      category: "technical_skills",
      importance: "required",
      status: "covered",
    },
    {
      description: "Inglês fluente",
      category: "languages",
      importance: "preferred",
      status: "missing",
    },
    {
      description: "Três anos de experiência",
      category: "experience",
      importance: "required",
      status: "partial",
    },
  ],
  suggestions: [
    { original: "experiência em Node.js", proposed: "prática em Node.js" },
    { original: "trecho que não está no CV", proposed: "inventado" },
  ],
};

function analysisRequest(body: unknown) {
  return new Request("http://localhost/api/analise", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function groqResponding(content: string, status = 200) {
  const groq = vi.fn(async () =>
    Response.json({ choices: [{ message: { content } }] }, { status }),
  );
  vi.stubGlobal("fetch", groq);
  return groq;
}

async function errorOf(response: Response) {
  return { status: response.status, body: await response.text() };
}

beforeEach(() => {
  vi.stubEnv("GROQ_API_KEY", "chave-ficticia");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/analise", () => {
  it("devolve scores, pesos, requisitos separados e sugestões válidas", async () => {
    groqResponding(JSON.stringify(LLM_ANALYSIS));

    const response = await POST(
      analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      language: "pt",
      globalScore: 67,
      categoryScores: {
        technical_skills: 100,
        experience: 50,
        education: null,
        languages: 0,
      },
      categoryWeights: {
        technical_skills: 40,
        experience: 40,
        education: 10,
        languages: 10,
      },
      coveredRequirements: [LLM_ANALYSIS.requirements[0]],
      missingRequirements: [
        LLM_ANALYSIS.requirements[1],
        LLM_ANALYSIS.requirements[2],
      ],
      suggestions: [LLM_ANALYSIS.suggestions[0]],
    });
  });

  it("pede temperatura zero e saída estruturada em modo estrito", async () => {
    const groq = groqResponding(JSON.stringify(LLM_ANALYSIS));

    await POST(analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }));

    const [, init] = groq.mock.calls[0] as unknown as [string, RequestInit];
    const sent = JSON.parse(init.body as string);
    expect(sent.temperature).toBe(0);
    expect(sent.response_format.type).toBe("json_schema");
    expect(sent.response_format.json_schema.strict).toBe(true);
  });

  it.each([
    ["CV vazio", { cvText: "  \n", jobText: JOB_TEXT }],
    ["vaga vazia", { cvText: CV_TEXT, jobText: " " }],
    ["CV ausente", { jobText: JOB_TEXT }],
  ])("recusa %s sem chamar a Groq", async (_case, body) => {
    const groq = groqResponding(JSON.stringify(LLM_ANALYSIS));

    const response = await POST(analysisRequest(body));

    expect(await errorOf(response)).toEqual({
      status: 400,
      body: '{"error":"empty_input"}',
    });
    expect(groq).not.toHaveBeenCalled();
  });

  it("devolve missing_api_key quando a chave não está definida", async () => {
    vi.stubEnv("GROQ_API_KEY", "");
    const groq = groqResponding(JSON.stringify(LLM_ANALYSIS));

    const response = await POST(
      analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }),
    );

    expect(await errorOf(response)).toEqual({
      status: 500,
      body: '{"error":"missing_api_key"}',
    });
    expect(groq).not.toHaveBeenCalled();
  });

  it.each([
    ["não é JSON", "isto não é JSON"],
    ["não cumpre o esquema", JSON.stringify({ jobLanguage: "fr" })],
  ])("devolve invalid_response quando a resposta %s", async (_case, content) => {
    groqResponding(content);

    const response = await POST(
      analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }),
    );

    expect(await errorOf(response)).toEqual({
      status: 502,
      body: '{"error":"invalid_response"}',
    });
  });

  it("devolve rate_limit quando a Groq responde 429", async () => {
    groqResponding("", 429);

    const response = await POST(
      analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }),
    );

    expect(await errorOf(response)).toEqual({
      status: 429,
      body: '{"error":"rate_limit"}',
    });
  });

  it("devolve timeout quando a Groq não responde a tempo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new DOMException("timeout", "TimeoutError");
      }),
    );

    const response = await POST(
      analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }),
    );

    expect(await errorOf(response)).toEqual({
      status: 504,
      body: '{"error":"timeout"}',
    });
  });

  it("devolve no_requirements quando a vaga não tem requisitos", async () => {
    groqResponding(JSON.stringify({ ...LLM_ANALYSIS, requirements: [] }));

    const response = await POST(
      analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }),
    );

    expect(await errorOf(response)).toEqual({
      status: 422,
      body: '{"error":"no_requirements"}',
    });
  });

  it("nunca escreve em logs", async () => {
    const logs = (["log", "info", "warn", "error", "debug"] as const).map(
      (method) => vi.spyOn(console, method),
    );
    groqResponding("isto não é JSON");

    await POST(analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }));
    groqResponding(JSON.stringify(LLM_ANALYSIS));
    await POST(analysisRequest({ cvText: CV_TEXT, jobText: JOB_TEXT }));

    logs.forEach((log) => expect(log).not.toHaveBeenCalled());
  });
});
