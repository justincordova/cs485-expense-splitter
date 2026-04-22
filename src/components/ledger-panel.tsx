"use client";

import type { Expense, Member } from "@/types";
import { detectCategory, getCategoryStyle } from "@/utils/categories";
import { formatCents, formatRelativeTime } from "@/utils/format";

interface LedgerPanelProps {
  expenses: Expense[];
  members: Member[];
  onDelete: (expenseId: string) => void;
  onOpenForm: () => void;
}

export function LedgerPanel({ expenses, members, onDelete, onOpenForm }: LedgerPanelProps) {
  const memberMap = new Map(members.map((m) => [m.id, m]));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Ledger
        </h2>
        <button
          type="button"
          onClick={onOpenForm}
          className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
        >
          + Add
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-muted">No expenses yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => {
            const payer = memberMap.get(expense.payerId);
            const category = detectCategory(expense.description);
            const catStyle = getCategoryStyle(category);

            return (
              <div
                key={expense.id}
                className="group relative rounded-2xl border border-border bg-surface p-3 transition-all hover:border-border/80"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary truncate">
                        {expense.description}
                      </span>
                      <span
                        className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide"
                        style={{
                          backgroundColor: catStyle.bgDark,
                          color: catStyle.textDark,
                        }}
                      >
                        {category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {payer?.name ?? "Unknown"} · {formatRelativeTime(expense.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatCents(expense.amount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this expense?")) onDelete(expense.id);
                  }}
                  className="absolute right-2 top-2 rounded p-1 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger"
                  aria-label="Delete expense"
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
