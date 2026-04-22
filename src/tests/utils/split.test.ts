import { describe, expect, it } from "vitest";
import { equalSplit } from "@/utils/split";

describe("equalSplit", () => {
  it("splits evenly when divisible", () => {
    const shares = equalSplit(3000, 3);
    expect(shares).toEqual([1000, 1000, 1000]);
    expect(shares.reduce((a, b) => a + b, 0)).toBe(3000);
  });

  it("distributes remainder cents to first participants", () => {
    const shares = equalSplit(1000, 3);
    expect(shares).toEqual([334, 333, 333]);
    expect(shares.reduce((a, b) => a + b, 0)).toBe(1000);
  });

  it("handles single participant", () => {
    expect(equalSplit(5000, 1)).toEqual([5000]);
  });

  it("returns empty for zero participants", () => {
    expect(equalSplit(1000, 0)).toEqual([]);
  });
});
