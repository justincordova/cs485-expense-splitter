"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Trip } from "@/types";

interface CreateTripFormProps {
  onSubmit: (name: string, memberNames: string[]) => Trip;
  onClose: () => void;
}

export function CreateTripForm({ onSubmit, onClose }: CreateTripFormProps) {
  const router = useRouter();
  const [tripName, setTripName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const name = tripName.trim();
    const names = memberInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!name) {
      setError("Trip name is required");
      nameRef.current?.focus();
      return;
    }
    if (names.length < 2) {
      setError("At least 2 members required (comma-separated)");
      return;
    }

    const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
    if (uniqueNames.size !== names.length) {
      setError("Duplicate member names are not allowed");
      return;
    }

    const trip = onSubmit(name, names);
    onClose();
    router.push(`/trips/${trip.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 animate-fade-in">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">New Trip</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="trip-name" className="mb-1 block text-sm text-text-secondary">
              Trip Name
            </label>
            <input
              ref={nameRef}
              id="trip-name"
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="Weekend in Vegas"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="trip-members" className="mb-1 block text-sm text-text-secondary">
              Members (comma-separated)
            </label>
            <input
              id="trip-members"
              type="text"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              placeholder="Alice, Bob, Charlie"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
