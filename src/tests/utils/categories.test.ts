import { describe, expect, it } from "vitest";
import { detectCategory } from "@/utils/categories";

describe("detectCategory", () => {
  it("detects DIN keywords", () => {
    expect(detectCategory("ramen at Ichiran")).toBe("DIN");
    expect(detectCategory("Dinner downtown")).toBe("DIN");
    expect(detectCategory("lunch break")).toBe("DIN");
    expect(detectCategory("coffee shop")).toBe("DIN");
    expect(detectCategory("sushi place")).toBe("DIN");
    expect(detectCategory("gelato")).toBe("DIN");
  });

  it("detects BEV keywords", () => {
    expect(detectCategory("izakaya night")).toBe("BEV");
    expect(detectCategory("beer garden")).toBe("BEV");
    expect(detectCategory("cocktail bar")).toBe("BEV");
  });

  it("detects TKT keywords", () => {
    expect(detectCategory("shinkansen to Kyoto")).toBe("TKT");
    expect(detectCategory("uber ride")).toBe("TKT");
    expect(detectCategory("taxi fare")).toBe("TKT");
  });

  it("detects BED keywords", () => {
    expect(detectCategory("hotel stay")).toBe("BED");
    expect(detectCategory("airbnb booking")).toBe("BED");
  });

  it("detects FUN keywords", () => {
    expect(detectCategory("teamLab Borderless")).toBe("FUN");
    expect(detectCategory("museum entry")).toBe("FUN");
    expect(detectCategory("concert ticket")).toBe("FUN");
  });

  it("falls back to EXP for unknown", () => {
    expect(detectCategory("random stuff")).toBe("EXP");
    expect(detectCategory("miscellaneous")).toBe("EXP");
  });
});
