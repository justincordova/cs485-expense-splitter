"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import * as storage from "@/services/storage";
import type { Balance, Expense, Settlement, Trip } from "@/types";
import { computeBalances } from "@/utils/balances";
import { optimizeSettlements } from "@/utils/settlement";

interface TripContextValue {
  trip: Trip | null;
  expenses: Expense[];
  balances: Balance[];
  settlements: Settlement[];
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
  addMember: (name: string) => void;
  removeMember: (memberId: string) => void;
  refresh: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ tripId, children }: { tripId: string; children: ReactNode }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const refresh = useCallback(() => {
    const trips = storage.getTrips();
    const found = trips.find((t) => t.id === tripId) ?? null;
    setTrip(found);
    if (found) {
      setExpenses(storage.getExpenses(tripId));
    }
  }, [tripId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const balances = trip ? computeBalances(trip, expenses) : [];
  const settlements = optimizeSettlements(balances);

  const addExpense = (expense: Expense) => {
    storage.addExpense(expense);
    setExpenses(storage.getExpenses(tripId));
  };

  const handleUpdateExpense = (expense: Expense) => {
    storage.updateExpense(expense);
    setExpenses(storage.getExpenses(tripId));
  };

  const handleDeleteExpense = (expenseId: string) => {
    storage.deleteExpense(tripId, expenseId);
    setExpenses(storage.getExpenses(tripId));
  };

  const addMember = (name: string) => {
    if (!trip) return;
    const updated: Trip = {
      ...trip,
      members: [...trip.members, { id: crypto.randomUUID(), name }],
    };
    const allTrips = storage.getTrips();
    storage.saveTrips(allTrips.map((t) => (t.id === trip.id ? updated : t)));
    setTrip(updated);
  };

  const removeMember = (memberId: string) => {
    if (!trip) return;
    const updated: Trip = {
      ...trip,
      members: trip.members.filter((m) => m.id !== memberId),
    };
    const allTrips = storage.getTrips();
    storage.saveTrips(allTrips.map((t) => (t.id === trip.id ? updated : t)));
    setTrip(updated);
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        expenses,
        balances,
        settlements,
        addExpense,
        updateExpense: handleUpdateExpense,
        deleteExpense: handleDeleteExpense,
        addMember,
        removeMember,
        refresh,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
