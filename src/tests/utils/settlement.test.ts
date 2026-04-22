import { describe, expect, it } from "vitest";
import type { Balance } from "@/types";
import { optimizeSettlements } from "@/utils/settlement";

describe("optimizeSettlements", () => {
  it("returns empty for all zero balances", () => {
    const balances: Balance[] = [
      { memberId: "m1", memberName: "A", totalPaid: 3000, totalOwed: 3000, netBalance: 0 },
      { memberId: "m2", memberName: "B", totalPaid: 3000, totalOwed: 3000, netBalance: 0 },
    ];
    expect(optimizeSettlements(balances)).toEqual([]);
  });

  it("single creditor, single debtor → one settlement", () => {
    const balances: Balance[] = [
      { memberId: "m1", memberName: "A", totalPaid: 6000, totalOwed: 3000, netBalance: 3000 },
      { memberId: "m2", memberName: "B", totalPaid: 0, totalOwed: 3000, netBalance: -3000 },
    ];
    const settlements = optimizeSettlements(balances);
    expect(settlements).toHaveLength(1);
    expect(settlements[0]).toEqual({
      fromMemberId: "m2",
      fromMemberName: "B",
      toMemberId: "m1",
      toMemberName: "A",
      amount: 3000,
    });
  });

  it("complex 5-person scenario uses fewer than naive N*(N-1) transactions", () => {
    const balances: Balance[] = [
      { memberId: "m1", memberName: "A", totalPaid: 10000, totalOwed: 2000, netBalance: 8000 },
      { memberId: "m2", memberName: "B", totalPaid: 5000, totalOwed: 2000, netBalance: 3000 },
      { memberId: "m3", memberName: "C", totalPaid: 0, totalOwed: 5000, netBalance: -5000 },
      { memberId: "m4", memberName: "D", totalPaid: 0, totalOwed: 4000, netBalance: -4000 },
      { memberId: "m5", memberName: "E", totalPaid: 0, totalOwed: 4000, netBalance: -2000 },
    ];

    const settlements = optimizeSettlements(balances);

    expect(settlements.length).toBeLessThanOrEqual(4);

    const totalFlow = settlements.reduce((sum, s) => sum + s.amount, 0);
    expect(totalFlow).toBe(11000);

    const netFrom = new Map<string, number>();
    const netTo = new Map<string, number>();
    for (const s of settlements) {
      netFrom.set(s.fromMemberId, (netFrom.get(s.fromMemberId) ?? 0) + s.amount);
      netTo.set(s.toMemberId, (netTo.get(s.toMemberId) ?? 0) + s.amount);
    }
    expect(netFrom.get("m3")).toBe(5000);
    expect(netFrom.get("m4")).toBe(4000);
    expect(netFrom.get("m5")).toBe(2000);
    expect(netTo.get("m1")).toBe(8000);
    expect(netTo.get("m2")).toBe(3000);
  });
});
