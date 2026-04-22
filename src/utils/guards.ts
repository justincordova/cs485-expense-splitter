import type { Expense } from "@/types";

export function canRemoveMember(memberId: string, expenses: Expense[]): boolean {
  return expenses.every((e) => e.payerId !== memberId && !e.participantIds.includes(memberId));
}
