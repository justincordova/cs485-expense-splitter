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

export function NaturalLanguageInput({ members, onParsed }: NaturalLanguageInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleParse = () => {
    const result = parseExpense(input.trim(), members);
    if (!result.ok) {
      setError(result.error.error);
      if (result.error.suggestion) {
        setTimeout(() => setError(""), 5000);
      }
      return;
    }
    setError("");
    setInput("");
    onParsed(result.data);
  };

  return (
    <div className="space-y-1.5">
      <div className="glow-cyan rounded-2xl border border-accent/30 bg-surface p-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleParse();
              }
            }}
            placeholder='Play a receipt...  "Leo paid $85 for ramen"'
            className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={handleParse}
            disabled={!input.trim()}
            className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
      {error && <p className="animate-fade-in px-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
