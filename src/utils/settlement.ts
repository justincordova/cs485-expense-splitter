import type { Balance, Settlement } from "@/types";

export function optimizeSettlements(balances: Balance[]): Settlement[] {
  const creditors = balances
    .filter((b) => b.netBalance > 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.netBalance - a.netBalance);

  const debtors = balances
    .filter((b) => b.netBalance < 0)
    .map((b) => ({ ...b, netBalance: Math.abs(b.netBalance) }))
    .sort((a, b) => b.netBalance - a.netBalance);

  const settlements: Settlement[] = [];

  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const amount = Math.min(creditors[ci].netBalance, debtors[di].netBalance);
    settlements.push({
      fromMemberId: debtors[di].memberId,
      fromMemberName: debtors[di].memberName,
      toMemberId: creditors[ci].memberId,
      toMemberName: creditors[ci].memberName,
      amount,
    });
    creditors[ci].netBalance -= amount;
    debtors[di].netBalance -= amount;
    if (creditors[ci].netBalance === 0) ci++;
    if (debtors[di].netBalance === 0) di++;
  }

  return settlements;
}
