export default function LoadingSpinner() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="inline-block h-5 w-5 rounded-full border-2 border-border border-t-primary animate-spin" />
        <span className="text-sm">Loading apartments…</span>
      </div>
    </div>
  );
}
