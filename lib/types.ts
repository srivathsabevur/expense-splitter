export interface Participant {
  id: string;
  name: string;
  totalContributed: number;
  totalOwed: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // participant id
  participants: string[]; // participant ids included in this expense
  customSplits?: { [participantId: string]: number }; // custom percentage splits
  date: Date;
}

export interface Settlement {
  from: string; // participant id
  to: string; // participant id
  amount: number;
}

export interface ExpenseGroup {
  participants: Participant[];
  expenses: Expense[];
  settlements: Settlement[];
  currency: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}