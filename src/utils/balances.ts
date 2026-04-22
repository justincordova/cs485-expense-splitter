import type { Balance, Expense, Trip } from "@/types";
import { equalSplit } from "./split";

export function computeBalances(trip: Trip, expenses: Expense[]): Balance[] {
  const totals = new Map<string, { totalPaid: number; totalOwed: number }>();
  for (const m of trip.members) {
    totals.set(m.id, { totalPaid: 0, totalOwed: 0 });
  }

  for (const expense of expenses) {
    const t = totals.get(expense.payerId);
    if (t) t.totalPaid += expense.amount;

    const shares = equalSplit(expense.amount, expense.participantIds.length);
    for (let i = 0; i < expense.participantIds.length; i++) {
      const t = totals.get(expense.participantIds[i]);
      if (t) t.totalOwed += shares[i];
    }
  }

  return trip.members.map((m) => {
    const t = totals.get(m.id) ?? { totalPaid: 0, totalOwed: 0 };
    return {
      memberId: m.id,
      memberName: m.name,
      totalPaid: t.totalPaid,
      totalOwed: t.totalOwed,
      netBalance: t.totalPaid - t.totalOwed,
    };
  });
}
