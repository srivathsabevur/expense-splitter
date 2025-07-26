import { Participant, Expense, Settlement } from './types';

export function calculateSettlements(
  participants: Participant[],
  expenses: Expense[]
): Settlement[] {
  // Calculate net balance for each participant
  const participantBalances = new Map<string, number>();
  
  // Initialize all participants with 0 balance
  participants.forEach(participant => {
    participantBalances.set(participant.id, 0);
  });

  expenses.forEach(expense => {
    // The person who paid gets a positive balance (they are owed money)
    participantBalances.set(
      expense.paidBy,
      (participantBalances.get(expense.paidBy) || 0) + expense.amount
    );

    // Calculate how much each included participant owes
    if (expense.customSplits) {
      Object.entries(expense.customSplits).forEach(([participantId, percentage]) => {
        if (expense.participants.includes(participantId)) {
          const owedAmount = (expense.amount * percentage) / 100;
          // Subtract what they owe (negative balance means they owe money)
          participantBalances.set(
            participantId,
            (participantBalances.get(participantId) || 0) - owedAmount
          );
        }
      });
    } else {
      // Equal split among all included participants
      const perPersonAmount = expense.amount / expense.participants.length;
      expense.participants.forEach(participantId => {
        // Subtract what they owe (negative balance means they owe money)
        participantBalances.set(
          participantId,
          (participantBalances.get(participantId) || 0) - perPersonAmount
        );
      });
    }
  });

  // Create settlements to balance out the amounts
  const settlements: Settlement[] = [];
  const creditors: Array<{ id: string; amount: number }> = [];
  const debtors: Array<{ id: string; amount: number }> = [];

  // Separate creditors (positive balance - they are owed money) and debtors (negative balance - they owe money)
  participantBalances.forEach((balance, participantId) => {
    if (balance > 0.01) {
      // This person is owed money
      creditors.push({ id: participantId, amount: balance });
    } else if (balance < -0.01) {
      // This person owes money
      debtors.push({ id: participantId, amount: -balance });
    }
  });

  // Create optimal settlements to minimize number of transactions
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const settlementAmount = Math.min(creditor.amount, debtor.amount);

    if (settlementAmount > 0.01) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(settlementAmount * 100) / 100
      });
    }

    creditor.amount -= settlementAmount;
    debtor.amount -= settlementAmount;

    if (creditor.amount < 0.01) creditorIndex++;
    if (debtor.amount < 0.01) debtorIndex++;
  }

  return settlements;
}

export function updateParticipantTotals(
  participants: Participant[],
  expenses: Expense[]
): Participant[] {
  return participants.map(participant => {
    let totalContributed = 0;
    let totalOwed = 0;

    expenses.forEach(expense => {
      // Calculate total contributed
      if (expense.paidBy === participant.id) {
        totalContributed += expense.amount;
      }

      // Calculate total owed
      if (expense.participants.includes(participant.id)) {
        if (expense.customSplits && expense.customSplits[participant.id]) {
          totalOwed += (expense.amount * expense.customSplits[participant.id]) / 100;
        } else {
          totalOwed += expense.amount / expense.participants.length;
        }
      }
    });

    return {
      ...participant,
      totalContributed: Math.round(totalContributed * 100) / 100,
      totalOwed: Math.round(totalOwed * 100) / 100
    };
  });
}