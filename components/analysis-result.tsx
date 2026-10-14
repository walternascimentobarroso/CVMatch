import { ArrowRight, Lightbulb } from "lucide-react";

import {
  CATEGORIES,
  type Category,
  type Requirement,
} from "@/lib/analysis/llm-analysis-schema";
import type { Analysis } from "@/lib/analysis/build-analysis";

const CATEGORY_LABELS: Record<Category, string> = {
  technical_skills: "Competências técnicas",
  experience: "Experiência",
  education: "Formação",
  languages: "Idiomas",
};

const IMPORTANCE_LABELS: Record<Requirement["importance"], string> = {
  required: "Obrigatório",
  preferred: "Desejável",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>;
}

function RequirementList({
  requirements,
  mark,
  emptyMessage,
}: {
  requirements: Requirement[];
  mark: "✓" | "+";
  emptyMessage: string;
}) {
  if (requirements.length === 0)
    return <EmptyMessage>{emptyMessage}</EmptyMessage>;

  const tone =
    mark === "✓"
      ? "border-primary/30 bg-accent text-accent-foreground"
      : "bg-card text-foreground";

  return (
    <ul className="flex flex-wrap gap-2">
      {requirements.map((requirement, index) => (
        <li
          key={index}
          className={`flex max-w-full items-start gap-2 rounded-lg border px-3 py-2 shadow-sm ${tone}`}
        >
          <span aria-hidden className="font-bold">
            {mark}
          </span>
          <div className="min-w-0">
            <p className="font-semibold break-words">
              {requirement.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {CATEGORY_LABELS[requirement.category]} ·{" "}
              {IMPORTANCE_LABELS[requirement.importance]}
              {requirement.status === "partial" && " · Parcial"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AnalysisResult({ analysis }: { analysis: Analysis }) {
  return (
    <div className="flex flex-col gap-10 border-t pt-10">
      <Section title="Por categoria">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const score = analysis.categoryScores[category];
            return (
              <li key={category} className="rounded-xl bg-card p-4 shadow-md">
                <p className="text-sm text-muted-foreground">
                  {CATEGORY_LABELS[category]} · peso{" "}
                  {analysis.categoryWeights[category]}
                </p>
                <p className="font-mono text-2xl tabular-nums">
                  {score === null ? (
                    <span className="font-sans text-lg">Não aplicável</span>
                  ) : (
                    `${score}/100`
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Requisitos cobertos">
        <RequirementList
          requirements={analysis.coveredRequirements}
          mark="✓"
          emptyMessage="Nenhum requisito coberto."
        />
      </Section>

      <Section title="Requisitos em falta">
        <RequirementList
          requirements={analysis.missingRequirements}
          mark="+"
          emptyMessage="Nenhum requisito em falta."
        />
      </Section>

      <Section title="Sugestões de reescrita">
        <p className="text-muted-foreground">
          São propostas: revê cada uma antes de a usar no CV.
        </p>
        {analysis.suggestions.length === 0 ? (
          <EmptyMessage>Nenhuma sugestão.</EmptyMessage>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex min-w-0 gap-3 rounded-xl bg-card p-4 shadow-md"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Lightbulb aria-hidden className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Original</p>
                    <p className="break-words whitespace-pre-wrap">
                      {suggestion.original}
                    </p>
                  </div>
                  <ArrowRight aria-hidden className="size-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Proposta</p>
                    <p className="font-semibold break-words whitespace-pre-wrap">
                      {suggestion.proposed}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
