import * as storage from "@/services/storage";
import type { Expense, Trip } from "@/types";

const SEED_KEY = "splitfair-seeded";

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function seedDemoData(): void {
  if (localStorage.getItem(SEED_KEY)) return;

  const members = [
    { id: "seed-m1", name: "Leo" },
    { id: "seed-m2", name: "Maya T." },
    { id: "seed-m3", name: "Jaxon P." },
    { id: "seed-m4", name: "Nina" },
  ];

  const trip: Trip = {
    id: "seed-trip-1",
    name: "Tokyo Drift '24",
    members,
    createdAt: daysAgo(5),
  };

  const expenses: Expense[] = [
    {
      id: "seed-e1",
      tripId: trip.id,
      description: "Ramen at Ichiran",
      amount: 8500,
      payerId: "seed-m1",
      participantIds: ["seed-m1", "seed-m2", "seed-m3", "seed-m4"],
      createdAt: daysAgo(4),
    },
    {
      id: "seed-e2",
      tripId: trip.id,
      description: "Shinkansen to Kyoto",
      amount: 22000,
      payerId: "seed-m3",
      participantIds: ["seed-m1", "seed-m2", "seed-m3", "seed-m4"],
      createdAt: daysAgo(3),
    },
    {
      id: "seed-e3",
      tripId: trip.id,
      description: "Izakaya night",
      amount: 6800,
      payerId: "seed-m2",
      participantIds: ["seed-m1", "seed-m2", "seed-m3", "seed-m4"],
      createdAt: daysAgo(2),
    },
    {
      id: "seed-e4",
      tripId: trip.id,
      description: "TeamLab Borderless",
      amount: 9600,
      payerId: "seed-m4",
      participantIds: ["seed-m1", "seed-m2", "seed-m3", "seed-m4"],
      createdAt: daysAgo(1),
    },
  ];

  storage.saveTrips([trip]);
  storage.saveExpenses(expenses);
  localStorage.setItem(SEED_KEY, "1");
}
