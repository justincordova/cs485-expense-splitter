"use client";

import { useState } from "react";
import type { Member } from "@/types";
import { parseExpense } from "@/utils/parse-expense";

interface NaturalLanguageInputProps {
  members: Member[];
  onParsed: (data: {
    description: string;
    amountCents: number;
    payerId: string;
    participantIds: string[];
  }) => void;
}

function matchMemberName(name: string, members: Member[]): Member | undefined {
  const lower = name.toLowerCase().trim();
  return members.find(
    (m) =>
      m.name.toLowerCase() === lower ||
      m.name.toLowerCase().startsWith(lower) ||
      lower.startsWith(m.name.toLowerCase().split(" ")[0])
  );
}

export function NaturalLanguageInput({ members, onParsed }: NaturalLanguageInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/parse-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed, memberNames: members.map((m) => m.name) }),
      });

      const json = (await res.json()) as {
        ok?: boolean;
        data?: {
          payerName: string;
          amount: number;
          description: string;
          participantNames: string[];
          excludeNames: string[];
        };
        error?: string;
      };

      if (!res.ok || !json.ok || !json.data) {
        const fallback = parseExpense(trimmed, members);
        if (fallback.ok) {
          setInput("");
          onParsed(fallback.data);
          return;
        }
        setError(json.error ?? fallback.error.error);
        setTimeout(() => setError(""), 5000);
        return;
      }

      const { payerName, amount, description, participantNames, excludeNames } = json.data;
      const payer = matchMemberName(payerName, members);

      if (!payer) {
        const fallback = parseExpense(trimmed, members);
        if (fallback.ok) {
          setInput("");
          onParsed(fallback.data);
          return;
        }
        setError(
          `Could not find member "${payerName}". Members: ${members.map((m) => m.name).join(", ")}`
        );
        setTimeout(() => setError(""), 5000);
        return;
      }

      let participants: Member[];

      if (excludeNames?.length > 0) {
        const excluded = excludeNames
          .map((n) => matchMemberName(n, members))
          .filter((m): m is Member => m !== undefined);
        const excludedIds = new Set(excluded.map((m) => m.id));
        participants = members.filter((m) => !excludedIds.has(m.id));
      } else if (participantNames?.length > 0) {
        participants = participantNames
          .map((n) => matchMemberName(n, members))
          .filter((m): m is Member => m !== undefined);
      } else {
        participants = members;
      }

      const participantIds = [...new Set(participants.map((m) => m.id))];
      if (!participantIds.includes(payer.id)) {
        participantIds.push(payer.id);
      }

      setInput("");
      onParsed({
        description,
        amountCents: Math.round(amount * 100),
        payerId: payer.id,
        participantIds,
      });
    } catch {
      const fallback = parseExpense(trimmed, members);
      if (fallback.ok) {
        setInput("");
        onParsed(fallback.data);
        return;
      }
      setError(fallback.error.error);
      if (fallback.error.suggestion) {
        setTimeout(() => setError(""), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="glow-accent rounded-2xl border border-accent/30 bg-surface p-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                handleParse();
              }
            }}
            placeholder='Type an expense...  "Leo paid $85 for ramen"'
            className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleParse}
            disabled={!input.trim() || loading}
            className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "..." : "Add"}
          </button>
        </div>
      </div>
      {error && <p className="animate-fade-in px-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
