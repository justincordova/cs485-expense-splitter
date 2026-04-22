import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <p className="mb-1 text-xs text-text-muted">404</p>
      <h2 className="mb-6 text-lg font-medium text-text-primary">Page not found</h2>
      <Link
        href="/"
        className="rounded-xl border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
      >
        Return home
      </Link>
    </main>
  );
}
