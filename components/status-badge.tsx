export function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-accent px-2 py-1 text-xs font-bold tracking-wider text-accent-foreground">
      {children}
    </span>
  );
}
