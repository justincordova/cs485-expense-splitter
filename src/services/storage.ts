import type { Expense, Trip } from "@/types";

const TRIPS_KEY = "splitfair-trips";
const EXPENSES_KEY = "splitfair-expenses";

function safeJsonParse<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeJsonSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded");
    }
    throw e;
  }
}

export function getTrips(): Trip[] {
  return safeJsonParse<Trip[]>(TRIPS_KEY) ?? [];
}

export function saveTrips(trips: Trip[]): void {
  safeJsonSet(TRIPS_KEY, trips);
}

export function getExpenses(tripId: string): Expense[] {
  const all = safeJsonParse<Expense[]>(EXPENSES_KEY) ?? [];
  return all.filter((e) => e.tripId === tripId);
}

export function getAllExpenses(): Expense[] {
  return safeJsonParse<Expense[]>(EXPENSES_KEY) ?? [];
}

export function saveExpenses(expenses: Expense[]): void {
  safeJsonSet(EXPENSES_KEY, expenses);
}

export function addExpense(expense: Expense): void {
  const all = getAllExpenses();
  all.push(expense);
  saveExpenses(all);
}

export function updateExpense(expense: Expense): void {
  const all = getAllExpenses();
  const idx = all.findIndex((e) => e.id === expense.id);
  if (idx !== -1) {
    all[idx] = expense;
    saveExpenses(all);
  }
}

export function deleteExpense(tripId: string, expenseId: string): void {
  const all = getAllExpenses().filter((e) => !(e.tripId === tripId && e.id === expenseId));
  saveExpenses(all);
}

export function deleteTrip(tripId: string): void {
  const trips = getTrips().filter((t) => t.id !== tripId);
  saveTrips(trips);
  const expenses = getAllExpenses().filter((e) => e.tripId !== tripId);
  saveExpenses(expenses);
}
