"use client";

import Link from "next/link";
import type { Trip } from "@/types";
import { formatCents, formatDate } from "@/utils/format";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-neon-cyan",
  "bg-neon-green",
  "bg-neon-pink",
  "bg-neon-yellow",
  "bg-purple-500",
  "bg-orange-500",
];

const CARD_ACCENTS = [
  "border-t-accent",
  "border-t-neon-green",
  "border-t-neon-pink",
  "border-t-neon-yellow",
  "border-t-purple-500",
  "border-t-orange-500",
];

function AvatarStack({ members }: { members: Trip["members"] }) {
  return (
    <div className="flex -space-x-2">
      {members.slice(0, 5).map((m, i) => (
        <div
          key={m.id}
          className={`flex size-8 items-center justify-center rounded-full border-2 border-surface text-xs font-medium text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
          title={m.name}
        >
          {getInitials(m.name)}
        </div>
      ))}
      {members.length > 5 && (
        <div className="flex size-8 items-center justify-center rounded-full border-2 border-surface bg-border text-xs text-text-secondary">
          +{members.length - 5}
        </div>
      )}
    </div>
  );
}

export function TripCard({
  trip,
  expenseCount,
  totalSpent,
}: {
  trip: Trip;
  expenseCount: number;
  totalSpent: number;
}) {
  const accent = CARD_ACCENTS[trip.name.length % CARD_ACCENTS.length];

  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <div
        className={`card-hover rounded-2xl border border-border border-t-2 bg-surface p-5 transition-all duration-200 ${accent}`}
      >
        <div className="mb-4 flex items-start justify-between pr-6">
          <h3 className="text-base font-semibold text-text-primary group-hover:text-accent">
            {trip.name}
          </h3>
          <span className="shrink-0 text-xs text-text-muted">{formatDate(trip.createdAt)}</span>
        </div>
        <div className="mb-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Spent</p>
          <p className="text-xl font-bold text-text-primary">{formatCents(totalSpent)}</p>
        </div>
        <div className="flex items-center justify-between">
          <AvatarStack members={trip.members} />
          <div className="text-xs text-text-secondary">
            {trip.members.length} member{trip.members.length !== 1 ? "s" : ""} · {expenseCount}{" "}
            expense{expenseCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </Link>
  );
}
