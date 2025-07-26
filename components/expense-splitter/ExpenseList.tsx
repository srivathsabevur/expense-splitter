'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar, User, Users, Percent, Edit, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense, Participant, Currency } from '@/lib/types';
import { formatAmount } from '@/lib/currency';

interface ExpenseListProps {
  expenses: Expense[];
  participants: Participant[];
  currency: Currency;
  onRemoveExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
}

export function ExpenseList({ expenses, participants, currency, onRemoveExpense, onEditExpense }: ExpenseListProps) {
  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || 'Unknown';
  };

  const grandTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  if (expenses.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200/50 dark:border-purple-800/50">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No expenses added yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200/50 dark:border-purple-800/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Expenses ({expenses.length})
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Spent</div>
            <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {formatAmount(grandTotal, currency)}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {expenses.map((expense) => (
            <motion.div
              key={expense.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50 hover:from-blue-100/70 hover:to-indigo-100/70 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{expense.description}</h3>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0">
                      {formatAmount(expense.amount, currency)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      <span>Paid by {getParticipantName(expense.paidBy)}</span>
                      <span className="text-xs text-muted-foreground/70">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
                      <span>Split between: {expense.participants.map(id => getParticipantName(id)).join(', ')}</span>
                    </div>
                    
                    {expense.customSplits && (
                      <div className="flex items-center gap-2">
                        <Percent className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                        <span>Custom splits: {
                          Object.entries(expense.customSplits)
                            .map(([id, percentage]) => `${getParticipantName(id)} (${percentage}%)`)
                            .join(', ')
                        }</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditExpense(expense)}
                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveExpense(expense.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}