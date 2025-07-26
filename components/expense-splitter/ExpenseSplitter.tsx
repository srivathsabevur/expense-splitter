'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Participant, Expense, ExpenseGroup, Currency } from '@/lib/types';
import { calculateSettlements, updateParticipantTotals } from '@/lib/settlement-calculator';
import { defaultCurrency } from '@/lib/currency';
import { ParticipantManager } from './ParticipantManager';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { SettlementCalculator } from './SettlementCalculator';
import { ExportButton } from './ExportButton';

interface ExpenseSplitterProps {
  currency: Currency;
}

export function ExpenseSplitter({ currency }: ExpenseSplitterProps) {
  const [expenseGroup, setExpenseGroup] = useState<ExpenseGroup>({
    participants: [],
    expenses: [],
    settlements: [],
    currency: defaultCurrency.code
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Recalculate settlements whenever participants or expenses change
  useEffect(() => {
    const updatedParticipants = updateParticipantTotals(
      expenseGroup.participants,
      expenseGroup.expenses
    );
    const settlements = calculateSettlements(updatedParticipants, expenseGroup.expenses);
    
    setExpenseGroup(prev => ({
      ...prev,
      participants: updatedParticipants,
      settlements
    }));
  }, [expenseGroup.participants.length, expenseGroup.expenses.length]);

  const addParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
      totalContributed: 0,
      totalOwed: 0
    };

    setExpenseGroup(prev => ({
      ...prev,
      participants: [...prev.participants, newParticipant]
    }));
  };

  const removeParticipant = (id: string) => {
    setExpenseGroup(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id),
      expenses: prev.expenses.filter(e => 
        e.paidBy !== id && !e.participants.includes(id)
      )
    }));
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date()
    };

    setExpenseGroup(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const removeExpense = (id: string) => {
    setExpenseGroup(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenseGroup(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    }));
    setEditingExpense(null);
  };

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const cancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-end"
      >
        <ExportButton
          participants={expenseGroup.participants}
          expenses={expenseGroup.expenses}
          settlements={expenseGroup.settlements}
          currency={currency}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ParticipantManager
          participants={expenseGroup.participants}
          currency={currency}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ExpenseForm
          participants={expenseGroup.participants}
          currency={currency}
          onAddExpense={addExpense}
          editingExpense={editingExpense}
          onUpdateExpense={updateExpense}
          onCancelEdit={cancelEdit}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ExpenseList
            expenses={expenseGroup.expenses}
            participants={expenseGroup.participants}
            currency={currency}
            onRemoveExpense={removeExpense}
            onEditExpense={editExpense}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SettlementCalculator
            settlements={expenseGroup.settlements}
            participants={expenseGroup.participants}
            currency={currency}
          />
        </motion.div>
      </div>
    </div>
  );
}