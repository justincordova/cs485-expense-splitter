"use client";

import { useState } from "react";
import { CreateTripForm } from "@/components/create-trip-form";
import { Header } from "@/components/header";
import { TripCard } from "@/components/trip-card";
import { TripsProvider, useTrips } from "@/hooks/use-trips";
import * as storage from "@/services/storage";
import { formatCents } from "@/utils/format";

function HomeContent() {
  const { trips, createTrip, deleteTrip } = useTrips();
  const [showForm, setShowForm] = useState(false);

  const totalExpenses = trips.reduce((sum, t) => sum + storage.getExpenses(t.id).length, 0);
  const totalSpent = trips.reduce(
    (sum, t) => sum + storage.getExpenses(t.id).reduce((s, e) => s + e.amount, 0),
    0
  );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="gradient-bg rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs text-text-muted uppercase tracking-wider">Trips</p>
            <p className="mt-1 text-3xl font-bold text-text-primary">{trips.length}</p>
          </div>
          <div className="gradient-bg rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs text-text-muted uppercase tracking-wider">Expenses Tracked</p>
            <p className="mt-1 text-3xl font-bold text-text-primary">{totalExpenses}</p>
          </div>
          <div className="gradient-bg rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs text-text-muted uppercase tracking-wider">Total Spent</p>
            <p className="mt-1 text-3xl font-bold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
              {formatCents(totalSpent)}
            </p>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Your Trips</h2>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 glow-accent"
          >
            + New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/10">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
                aria-hidden="true"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <p className="text-text-primary font-medium">No trips yet</p>
              <p className="mt-1 text-sm text-text-muted">
                Create your first trip to start splitting expenses
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 glow-accent"
            >
              Create a Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div key={trip.id} className="relative group">
                <TripCard
                  trip={trip}
                  expenseCount={storage.getExpenses(trip.id).length}
                  totalSpent={storage.getExpenses(trip.id).reduce((s, e) => s + e.amount, 0)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm(`Delete "${trip.name}"?`)) deleteTrip(trip.id);
                  }}
                  className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-surface-hover hover:text-danger"
                  aria-label={`Delete ${trip.name}`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && <CreateTripForm onSubmit={createTrip} onClose={() => setShowForm(false)} />}
    </>
  );
}

export default function HomePage() {
  return (
    <TripsProvider>
      <HomeContent />
    </TripsProvider>
  );
}
