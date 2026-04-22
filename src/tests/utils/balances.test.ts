import { describe, expect, it } from "vitest";
import type { Expense, Trip } from "@/types";
import { computeBalances } from "@/utils/balances";

function makeTrip(memberNames: string[]): Trip {
  return {
    id: "trip-1",
    name: "Test Trip",
    members: memberNames.map((name, i) => ({ id: `m${i + 1}`, name })),
    createdAt: "2025-01-01T00:00:00.000Z",
  };
}

function findBalance(balances: ReturnType<typeof computeBalances>, name: string) {
  return balances.find((b) => b.memberName === name);
}

describe("computeBalances", () => {
  it("computes equal split for 3 people", () => {
    const trip = makeTrip(["Alice", "Bob", "Charlie"]);
    const expenses: Expense[] = [
      {
        id: "e1",
        tripId: "trip-1",
        description: "Dinner",
        amount: 9000,
        payerId: "m1",
        participantIds: ["m1", "m2", "m3"],
        createdAt: "2025-01-01T12:00:00.000Z",
      },
    ];

    const balances = computeBalances(trip, expenses);
    expect(balances).toHaveLength(3);

    const alice = findBalance(balances, "Alice");
    expect(alice).toBeDefined();
    expect(alice?.totalPaid).toBe(9000);
    expect(alice?.totalOwed).toBe(3000);
    expect(alice?.netBalance).toBe(6000);

    const bob = findBalance(balances, "Bob");
    expect(bob).toBeDefined();
    expect(bob?.netBalance).toBe(-3000);

    const charlie = findBalance(balances, "Charlie");
    expect(charlie).toBeDefined();
    expect(charlie?.netBalance).toBe(-3000);
  });

  it("partial participation — only participants owe", () => {
    const trip = makeTrip(["Alice", "Bob", "Charlie"]);
    const expenses: Expense[] = [
      {
        id: "e1",
        tripId: "trip-1",
        description: "Cab",
        amount: 2000,
        payerId: "m1",
        participantIds: ["m1", "m2"],
        createdAt: "2025-01-01T12:00:00.000Z",
      },
    ];

    const balances = computeBalances(trip, expenses);
    const alice = findBalance(balances, "Alice");
    expect(alice).toBeDefined();
    expect(alice?.netBalance).toBe(1000);

    const bob = findBalance(balances, "Bob");
    expect(bob).toBeDefined();
    expect(bob?.netBalance).toBe(-1000);

    const charlie = findBalance(balances, "Charlie");
    expect(charlie).toBeDefined();
    expect(charlie?.totalPaid).toBe(0);
    expect(charlie?.totalOwed).toBe(0);
    expect(charlie?.netBalance).toBe(0);
  });

  it("returns zero balances with no expenses", () => {
    const trip = makeTrip(["Alice", "Bob"]);
    const balances = computeBalances(trip, []);
    expect(balances.every((b) => b.netBalance === 0)).toBe(true);
  });
});
