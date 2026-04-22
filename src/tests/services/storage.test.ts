import { beforeEach, describe, expect, it } from "vitest";
import {
  addExpense,
  deleteExpense,
  deleteTrip,
  getAllExpenses,
  getExpenses,
  getTrips,
  saveTrips,
  updateExpense,
} from "@/services/storage";
import type { Expense, Trip } from "@/types";

const mockTrip: Trip = {
  id: "trip-1",
  name: "Beach Trip",
  members: [
    { id: "m1", name: "Alice" },
    { id: "m2", name: "Bob" },
  ],
  createdAt: "2025-01-01T00:00:00.000Z",
};

const mockExpense: Expense = {
  id: "exp-1",
  tripId: "trip-1",
  description: "Dinner",
  amount: 6000,
  payerId: "m1",
  participantIds: ["m1", "m2"],
  createdAt: "2025-01-01T12:00:00.000Z",
};

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("trips", () => {
    it("returns empty array when no trips stored", () => {
      expect(getTrips()).toEqual([]);
    });

    it("round-trips trip data", () => {
      saveTrips([mockTrip]);
      expect(getTrips()).toEqual([mockTrip]);
    });
  });

  describe("expenses", () => {
    beforeEach(() => {
      localStorage.clear();
      addExpense(mockExpense);
    });

    it("gets expenses filtered by tripId", () => {
      expect(getExpenses("trip-1")).toEqual([mockExpense]);
      expect(getExpenses("trip-999")).toEqual([]);
    });

    it("gets all expenses", () => {
      expect(getAllExpenses()).toEqual([mockExpense]);
    });

    it("adds an expense", () => {
      const expense2: Expense = { ...mockExpense, id: "exp-2" };
      addExpense(expense2);
      expect(getAllExpenses()).toHaveLength(2);
    });

    it("updates an expense", () => {
      const updated = { ...mockExpense, description: "Lunch", amount: 3000 };
      updateExpense(updated);
      expect(getExpenses("trip-1")[0].description).toBe("Lunch");
      expect(getExpenses("trip-1")[0].amount).toBe(3000);
    });

    it("deletes an expense", () => {
      deleteExpense("trip-1", "exp-1");
      expect(getExpenses("trip-1")).toEqual([]);
    });
  });

  describe("deleteTrip", () => {
    it("removes trip and cascades to expenses", () => {
      saveTrips([mockTrip]);
      addExpense(mockExpense);
      addExpense({ ...mockExpense, id: "exp-2" });

      deleteTrip("trip-1");

      expect(getTrips()).toEqual([]);
      expect(getExpenses("trip-1")).toEqual([]);
      expect(getAllExpenses()).toEqual([]);
    });
  });
});
