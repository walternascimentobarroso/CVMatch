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
    <section className="flex flex-col gap-2">
      <h3 className="font-medium">{title}</h3>
      {children}
    </section>
  );
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>;
}

function RequirementList({
  requirements,
  emptyMessage,
}: {
  requirements: Requirement[];
  emptyMessage: string;
}) {
  if (requirements.length === 0)
    return <EmptyMessage>{emptyMessage}</EmptyMessage>;

  return (
    <ul className="flex flex-col gap-2">
      {requirements.map((requirement, index) => (
        <li key={index} className="rounded-lg border p-3">
          <p>{requirement.description}</p>
          <p className="text-muted-foreground">
            {CATEGORY_LABELS[requirement.category]} ·{" "}
            {IMPORTANCE_LABELS[requirement.importance]}
            {requirement.status === "partial" && " · Parcial"}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function AnalysisResult({ analysis }: { analysis: Analysis }) {
  return (
    <div className="flex flex-col gap-6 border-t pt-6">
      <section className="flex flex-col gap-1">
        <h2 className="font-medium">Score global</h2>
        <p className="text-4xl font-semibold tabular-nums">
          {analysis.globalScore}
          <span className="text-base font-normal text-muted-foreground">
            /100
          </span>
        </p>
      </section>

      <Section title="Por categoria">
        <ul className="grid gap-2 sm:grid-cols-2">
          {CATEGORIES.map((category) => {
            const score = analysis.categoryScores[category];
            return (
              <li key={category} className="rounded-lg border p-3">
                <p className="text-muted-foreground">
                  {CATEGORY_LABELS[category]} · peso{" "}
                  {analysis.categoryWeights[category]}
                </p>
                <p className="text-lg font-medium tabular-nums">
                  {score === null ? "Não aplicável" : `${score}/100`}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Requisitos cobertos">
        <RequirementList
          requirements={analysis.coveredRequirements}
          emptyMessage="Nenhum requisito coberto."
        />
      </Section>

      <Section title="Requisitos em falta">
        <RequirementList
          requirements={analysis.missingRequirements}
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
          <ul className="flex flex-col gap-3">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2"
              >
                <div className="min-w-0">
                  <p className="text-muted-foreground">Original</p>
                  <p className="break-words whitespace-pre-wrap">
                    {suggestion.original}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground">Proposta</p>
                  <p className="break-words whitespace-pre-wrap">
                    {suggestion.proposed}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
