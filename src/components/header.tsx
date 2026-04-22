"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="h-0.5 bg-gradient-to-r from-accent via-warning to-success" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          SplitFair
          <span className="inline-block size-2 animate-pulse rounded-full bg-accent" />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
