export interface Member {
  id: string;
  name: string;
}

export interface Trip {
  id: string;
  name: string;
  members: Member[];
  createdAt: string;
}

export interface Expense {
  id: string;
  tripId: string;
  description: string;
  amount: number;
  payerId: string;
  participantIds: string[];
  createdAt: string;
}

export interface Balance {
  memberId: string;
  memberName: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

export interface Settlement {
  fromMemberId: string;
  fromMemberName: string;
  toMemberId: string;
  toMemberName: string;
  amount: number;
}
