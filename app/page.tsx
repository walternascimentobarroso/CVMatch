import { AnalysisPanel } from "@/components/analysis-panel";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className="text-sm font-semibold tracking-[0.25em] text-accent-foreground">
          CORRESPONDÊNCIA CV ↔ VAGA
        </p>
        <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-6xl">
          Descobre a tua{" "}
          <span className="font-bold text-primary">compatibilidade</span> antes
          de te candidatares.
        </h1>
        <p className="text-lg text-pretty text-muted-foreground">
          Carrega o CV e cola a descrição da vaga para veres o score, os
          requisitos em falta e sugestões de melhoria.
        </p>
      </header>

      <div className="w-full max-w-7xl">
        <AnalysisPanel />
      </div>
    </main>
  );
}
