"use client";

import { useState } from "react";
import type { Member } from "@/types";
import { detectCategory } from "@/utils/categories";

interface AddExpenseFormProps {
  members: Member[];
  onSubmit: (data: {
    description: string;
    amountCents: number;
    payerId: string;
    participantIds: string[];
  }) => void;
  onCancel: () => void;
  defaultValues?: {
    description?: string;
    amountCents?: number;
    payerId?: string;
    participantIds?: string[];
  };
}

export function AddExpenseForm({
  members,
  onSubmit,
  onCancel,
  defaultValues,
}: AddExpenseFormProps) {
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [amountDollars, setAmountDollars] = useState(
    defaultValues?.amountCents ? (defaultValues.amountCents / 100).toString() : ""
  );
  const [payerId, setPayerId] = useState(defaultValues?.payerId ?? members[0]?.id ?? "");
  const [participantIds, setParticipantIds] = useState<Set<string>>(
    new Set(defaultValues?.participantIds ?? members.map((m) => m.id))
  );
  const [error, setError] = useState("");

  const toggleParticipant = (id: string) => {
    setParticipantIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const desc = description.trim();
    const dollars = Number.parseFloat(amountDollars);
    const amountCents = Math.round(dollars * 100);

    if (!desc) {
      setError("Description is required");
      return;
    }
    if (!amountDollars || Number.isNaN(dollars) || amountCents <= 0) {
      setError("Amount must be greater than $0");
      return;
    }
    if (!payerId) {
      setError("Select who paid");
      return;
    }
    if (participantIds.size === 0) {
      setError("Select at least one participant");
      return;
    }

    onSubmit({ description: desc, amountCents, payerId, participantIds: [...participantIds] });
  };

  const category = detectCategory(description);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="exp-desc" className="mb-1 block text-sm text-text-secondary">
          Description
        </label>
        <div className="flex items-center gap-2">
          <input
            id="exp-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Dinner, groceries, cab..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
          {description && (
            <span className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold">{category}</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="exp-amount" className="mb-1 block text-sm text-text-secondary">
          Amount ($)
        </label>
        <input
          id="exp-amount"
          type="number"
          step="0.01"
          min="0"
          value={amountDollars}
          onChange={(e) => setAmountDollars(e.target.value)}
          placeholder="60.00"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="exp-payer" className="mb-1 block text-sm text-text-secondary">
          Paid by
        </label>
        <select
          id="exp-payer"
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm text-text-secondary">Participants</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setParticipantIds(new Set(members.map((m) => m.id)))}
              className="text-xs text-accent hover:underline"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setParticipantIds(new Set())}
              className="text-xs text-accent hover:underline"
            >
              None
            </button>
          </div>
        </div>
        <div className="space-y-1">
          {members.map((m) => (
            <label
              key={m.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-surface-hover"
            >
              <input
                type="checkbox"
                checked={participantIds.has(m.id)}
                onChange={() => toggleParticipant(m.id)}
                className="size-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-text-primary">{m.name}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          {defaultValues ? "Save Changes" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
