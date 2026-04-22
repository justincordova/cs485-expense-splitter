"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import * as storage from "@/services/storage";
import type { Trip } from "@/types";
import { seedDemoData } from "@/utils/seed";

interface TripsContextValue {
  trips: Trip[];
  createTrip: (name: string, memberNames: string[]) => Trip;
  deleteTrip: (id: string) => void;
  refresh: () => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);

  const refresh = useCallback(() => {
    seedDemoData();
    setTrips(storage.getTrips());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTrip = (name: string, memberNames: string[]): Trip => {
    const trip: Trip = {
      id: crypto.randomUUID(),
      name,
      members: memberNames.map((n) => ({ id: crypto.randomUUID(), name: n })),
      createdAt: new Date().toISOString(),
    };
    const updated = [...storage.getTrips(), trip];
    storage.saveTrips(updated);
    setTrips(updated);
    return trip;
  };

  const handleDeleteTrip = (id: string) => {
    storage.deleteTrip(id);
    setTrips(storage.getTrips());
  };

  return (
    <TripsContext.Provider value={{ trips, createTrip, deleteTrip: handleDeleteTrip, refresh }}>
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used within TripsProvider");
  return ctx;
}
