import { describe, expect, it } from "vitest";
import type { Member } from "@/types";
import { parseExpense } from "@/utils/parse-expense";

const members: Member[] = [
  { id: "m1", name: "Leo" },
  { id: "m2", name: "Maya T." },
  { id: "m3", name: "Jaxon P." },
  { id: "m4", name: "Nina" },
];

describe("parseExpense", () => {
  it('parses "X paid $Y for Z" — standard pattern, all members', () => {
    const result = parseExpense("Leo paid $60 for ramen", members);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.payerId).toBe("m1");
    expect(result.data.amountCents).toBe(6000);
    expect(result.data.description).toBe("ramen");
    expect(result.data.participantIds).toEqual(["m1", "m2", "m3", "m4"]);
  });

  it('parses "X $Y Z" — shortened pattern', () => {
    const result = parseExpense("Leo 45 sushi", members);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.payerId).toBe("m1");
    expect(result.data.amountCents).toBe(4500);
    expect(result.data.description).toBe("sushi");
  });

  it('parses "$Y Z paid by X" — reversed payer', () => {
    const result = parseExpense("$200 shinkansen paid by Jaxon P.", members);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.payerId).toBe("m3");
    expect(result.data.amountCents).toBe(20000);
    expect(result.data.description).toBe("shinkansen");
  });

  it('parses "X paid $Y for Z for everyone except W" — exclusion', () => {
    const result = parseExpense("Leo paid $100 for hotel for everyone except Nina", members);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.payerId).toBe("m1");
    expect(result.data.amountCents).toBe(10000);
    expect(result.data.description).toBe("hotel");
    expect(result.data.participantIds).not.toContain("m4");
    expect(result.data.participantIds).toContain("m1");
    expect(result.data.participantIds).toContain("m2");
    expect(result.data.participantIds).toContain("m3");
  });

  it('parses "X covered $Y for Z" — synonym', () => {
    const result = parseExpense("Maya T. covered $68 for izakaya", members);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.payerId).toBe("m2");
    expect(result.data.amountCents).toBe(6800);
    expect(result.data.description).toBe("izakaya");
  });

  it("parses dollar amount formats: $45, $45.00, 45, 45.50", () => {
    const cases = [
      { input: "Leo paid $45 for lunch", expected: 4500 },
      { input: "Leo paid $45.00 for lunch", expected: 4500 },
      { input: "Leo paid 45 for lunch", expected: 4500 },
      { input: "Leo paid 45.50 for lunch", expected: 4550 },
    ];
    for (const { input, expected } of cases) {
      const result = parseExpense(input, members);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.data.amountCents).toBe(expected);
    }
  });

  it("fuzzy name matching — case-insensitive first-name match", () => {
    const result = parseExpense("leo paid $30 for coffee", members);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.payerId).toBe("m1");
  });

  it("fuzzy name matching — partial first name", () => {
    const result = parseExpense("Maya paid $30 for coffee", members);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.payerId).toBe("m2");
  });

  it("returns error for unrecognizable payer", () => {
    const result = parseExpense("Unknown paid $50 for stuff", members);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.error).toContain("Unknown");
  });

  it("returns error for empty input", () => {
    const result = parseExpense("", members);
    expect(result.ok).toBe(false);
  });

  it("returns error for garbage input", () => {
    const result = parseExpense("asdfghjkl", members);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.suggestion).toBeDefined();
  });

  it("returns error for less than 2 members", () => {
    const result = parseExpense("Leo paid $50 for lunch", [{ id: "m1", name: "Leo" }]);
    expect(result.ok).toBe(false);
  });

  it("parses specific participants with commas", () => {
    const result = parseExpense("Leo paid $60 for dinner for Maya T., Jaxon P.", members);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.participantIds).toContain("m1");
    expect(result.data.participantIds).toContain("m2");
    expect(result.data.participantIds).toContain("m3");
    expect(result.data.participantIds).not.toContain("m4");
  });
});
