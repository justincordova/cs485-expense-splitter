"use client";

import type { Settlement } from "@/types";
import { formatCents } from "@/utils/format";

interface SettlementPanelProps {
  settlements: Settlement[];
}

export function SettlementPanel({ settlements }: SettlementPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Endgame
        </h2>
        {settlements.length > 0 && (
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
            Optimized path
          </span>
        )}
      </div>

      {settlements.length === 0 ? (
        <div className="rounded-2xl border border-success/30 bg-surface p-6 text-center">
          <div className="mb-2 text-2xl">&#10003;</div>
          <p className="text-sm font-medium text-success">All square</p>
          <p className="text-xs text-text-muted">Everyone is settled up</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-text-muted">
            {settlements.length} transaction{settlements.length !== 1 ? "s" : ""} to settle
          </p>
          {settlements.map((s) => (
            <div
              key={`${s.fromMemberId}-${s.toMemberId}-${s.amount}`}
              className="rounded-2xl border border-border bg-surface p-3"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-danger">{s.fromMemberName}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-muted shrink-0"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span className="font-medium text-success">{s.toMemberName}</span>
                <span className="ml-auto text-sm font-semibold text-text-primary">
                  {formatCents(s.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
