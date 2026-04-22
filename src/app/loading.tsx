export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div
        role="status"
        aria-label="Loading"
        className="size-5 animate-spin rounded-full border-2 border-border border-t-accent"
      />
    </main>
  );
}
