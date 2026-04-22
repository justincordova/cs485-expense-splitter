"use client";

import Link from "next/link";
import { useState } from "react";
import { AddExpenseModal } from "@/components/add-expense-modal";
import { Header } from "@/components/header";
import { LedgerPanel } from "@/components/ledger-panel";
import { NaturalLanguageInput } from "@/components/natural-language-input";
import { SettlementPanel } from "@/components/settlement-panel";
import { StandingsPanel } from "@/components/standings-panel";
import { useTrip } from "@/hooks/use-trip";
import type { Expense } from "@/types";

export function TripDashboard({ tripId }: { tripId: string }) {
  const {
    trip,
    expenses,
    balances,
    settlements,
    addExpense,
    deleteExpense,
    updateExpense,
    addMember,
    removeMember,
  } = useTrip();
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const buildExpense = (data: {
    description: string;
    amountCents: number;
    payerId: string;
    participantIds: string[];
  }): Expense => ({
    id: crypto.randomUUID(),
    tripId,
    description: data.description,
    amount: data.amountCents,
    payerId: data.payerId,
    participantIds: data.participantIds,
    createdAt: new Date().toISOString(),
  });

  const handleNLExpense = (data: {
    description: string;
    amountCents: number;
    payerId: string;
    participantIds: string[];
  }) => {
    addExpense(buildExpense(data));
  };

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="py-20 text-center">
            <p className="mb-4 text-text-muted">Trip not found</p>
            <Link href="/" className="text-accent hover:underline">
              Back to trips
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/" className="text-sm text-text-muted transition-colors hover:text-accent">
            &larr; Trips
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="text-xl font-bold text-text-primary">{trip.name}</h1>
        </div>

        <NaturalLanguageInput members={trip.members} onParsed={handleNLExpense} />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <StandingsPanel
              members={trip.members}
              balances={balances}
              expenses={expenses}
              onAddMember={addMember}
              onRemoveMember={removeMember}
            />
          </div>
          <div className="md:col-span-5">
            <LedgerPanel
              expenses={expenses}
              members={trip.members}
              onDelete={deleteExpense}
              onEdit={(expense) => {
                setEditingExpense(expense);
                setShowModal(true);
              }}
              onOpenForm={() => {
                setEditingExpense(null);
                setShowModal(true);
              }}
            />
          </div>
          <div className="md:col-span-4">
            <SettlementPanel settlements={settlements} />
          </div>
        </div>
      </main>

      {showModal && (
        <AddExpenseModal
          members={trip.members}
          onSubmit={(data) => {
            if (editingExpense) {
              const original = expenses.find((e) => e.id === editingExpense.id);
              if (original) {
                updateExpense({
                  ...original,
                  description: data.description,
                  amount: data.amountCents,
                  payerId: data.payerId,
                  participantIds: data.participantIds,
                });
              }
            } else {
              addExpense(buildExpense(data));
            }
            setShowModal(false);
            setEditingExpense(null);
          }}
          onClose={() => {
            setShowModal(false);
            setEditingExpense(null);
          }}
          defaultValues={
            editingExpense
              ? {
                  description: editingExpense.description,
                  amountCents: editingExpense.amount,
                  payerId: editingExpense.payerId,
                  participantIds: editingExpense.participantIds,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
