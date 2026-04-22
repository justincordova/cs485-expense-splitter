"use client";

import { useEffect } from "react";

// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js requires this export name
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <p className="mb-1 text-xs text-text-muted">500</p>
      <h2 className="mb-6 text-lg font-medium text-text-primary">Something went wrong</h2>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
      >
        Try again
      </button>
    </main>
  );
}
