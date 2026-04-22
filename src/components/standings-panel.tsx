"use client";

import { useState } from "react";
import type { Balance, Expense, Member } from "@/types";
import { formatCents } from "@/utils/format";
import { canRemoveMember } from "@/utils/guards";

const AVATAR_COLORS = [
  "bg-neon-cyan",
  "bg-neon-green",
  "bg-neon-pink",
  "bg-neon-yellow",
  "bg-purple-500",
  "bg-orange-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface StandingsPanelProps {
  members: Member[];
  balances: Balance[];
  expenses: Expense[];
  onAddMember: (name: string) => void;
  onRemoveMember: (memberId: string) => void;
}

export function StandingsPanel({
  balances,
  expenses,
  onAddMember,
  onRemoveMember,
}: StandingsPanelProps) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");

  const sorted = [...balances].sort((a, b) => b.netBalance - a.netBalance);
  const totalSpent = balances.reduce((sum, b) => sum + b.totalPaid, 0);
  const topCreditor = sorted.length > 0 && sorted[0].netBalance > 0 ? sorted[0].memberId : null;

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddMember(trimmed);
    setName("");
    setShowInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="text-xs text-text-muted uppercase tracking-wider">Total Spent</p>
        <p className="mt-1 text-2xl font-bold text-text-primary">{formatCents(totalSpent)}</p>
      </div>

      <div className="space-y-2">
        {sorted.map((b, i) => {
          const removable = canRemoveMember(b.memberId, expenses);
          return (
            <div
              key={b.memberId}
              className={`group relative rounded-2xl border bg-surface p-3 transition-all ${
                b.memberId === topCreditor ? "border-success/40 glow-green" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                >
                  {getInitials(b.memberName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{b.memberName}</p>
                  <p className="text-xs text-text-muted">{formatCents(b.totalPaid)} paid</p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    b.netBalance > 0
                      ? "text-success"
                      : b.netBalance < 0
                        ? "text-danger"
                        : "text-text-muted"
                  }`}
                >
                  {b.netBalance > 0 ? "+" : ""}
                  {formatCents(b.netBalance)}
                </span>
              </div>
              {removable && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove ${b.memberName}?`)) onRemoveMember(b.memberId);
                  }}
                  className="absolute right-2 top-2 rounded p-0.5 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger"
                  aria-label={`Remove ${b.memberName}`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Name"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowInput(true)}
          className="w-full rounded-xl border border-dashed border-border py-2 text-sm text-text-muted transition-colors hover:border-accent hover:text-accent"
        >
          + Add Member
        </button>
      )}
    </div>
  );
}
