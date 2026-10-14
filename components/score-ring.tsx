const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function missingLabel(count: number) {
  return count === 1 ? "1 requisito em falta" : `${count} requisitos em falta`;
}

export function ScoreRing({
  score,
  missingCount,
}: {
  score: number | null;
  missingCount: number;
}) {
  const filled = ((score ?? 0) / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative size-52 rounded-full bg-card p-3 shadow-[0_0_0_8px_oklch(0.95_0.04_190/60%),0_10px_30px_oklch(0.6_0.1_200/20%)]">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />
          {score !== null && (
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
              className="stroke-primary"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-5xl font-light tabular-nums">
            {score ?? "—"}
            {score !== null && (
              <span className="text-xl text-muted-foreground">/100</span>
            )}
          </p>
          {score !== null && (
            <p className="text-xs font-bold tracking-[0.2em] text-accent-foreground">
              SCORE
            </p>
          )}
        </div>
      </div>
      {score === null ? (
        <p className="text-center text-muted-foreground">
          Carrega o CV e cola a vaga
        </p>
      ) : (
        <p className="rounded-full border bg-card px-3 py-1 text-sm font-semibold text-accent-foreground shadow-sm">
          {missingLabel(missingCount)}
        </p>
      )}
    </div>
  );
}
