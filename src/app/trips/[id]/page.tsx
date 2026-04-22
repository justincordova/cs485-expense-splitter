"use client";

import { use } from "react";
import { TripDashboard } from "@/components/trip-dashboard";
import { TripProvider } from "@/hooks/use-trip";

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <TripProvider tripId={id}>
      <TripDashboard tripId={id} />
    </TripProvider>
  );
}
