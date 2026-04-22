"use client";

import type { Member } from "@/types";
import { AddExpenseForm } from "./add-expense-form";

interface AddExpenseModalProps {
  members: Member[];
  onSubmit: (data: {
    description: string;
    amountCents: number;
    payerId: string;
    participantIds: string[];
  }) => void;
  onClose: () => void;
  defaultValues?: {
    description?: string;
    amountCents?: number;
    payerId?: string;
    participantIds?: string[];
  };
}

export function AddExpenseModal({
  members,
  onSubmit,
  onClose,
  defaultValues,
}: AddExpenseModalProps) {
  const handleSubmit = (data: {
    description: string;
    amountCents: number;
    payerId: string;
    participantIds: string[];
  }) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 animate-fade-in">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          {defaultValues ? "Edit Expense" : "Add Expense"}
        </h2>
        <AddExpenseForm
          members={members}
          onSubmit={handleSubmit}
          onCancel={onClose}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  );
}
