export function DocsLoading() {
  return (
    <div className="flex min-h-svh bg-background">
      <div className="hidden w-64 shrink-0 border-r border-border/40 p-4 lg:block">
        <div className="mb-6 h-6 w-28 animate-pulse rounded bg-fd-accent/25" />
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-fd-accent/15" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 md:p-10">
        <div className="mb-6 h-9 max-w-md animate-pulse rounded bg-fd-accent/25" />
        <div className="mb-3 h-4 max-w-2xl animate-pulse rounded bg-fd-accent/15" />
        <div className="mb-3 h-4 max-w-xl animate-pulse rounded bg-fd-accent/15" />
        <div className="mt-10 h-64 animate-pulse rounded-lg bg-fd-accent/10" />
      </div>
    </div>
  );
}
