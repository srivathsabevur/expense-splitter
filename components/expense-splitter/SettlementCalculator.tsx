'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settlement, Participant, Currency } from '@/lib/types';
import { formatAmount } from '@/lib/currency';

interface SettlementCalculatorProps {
  settlements: Settlement[];
  participants: Participant[];
  currency: Currency;
}

export function SettlementCalculator({ settlements, participants, currency }: SettlementCalculatorProps) {
  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || 'Unknown';
  };

  const totalAmount = settlements.reduce((sum, settlement) => sum + settlement.amount, 0);

  if (settlements.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50 dark:border-green-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            All Settled Up!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No payments needed - everyone is even!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-yellow-50/90 to-orange-50/90 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200/50 dark:border-yellow-800/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Settlement Required
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            Total: {formatAmount(totalAmount, currency)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {settlements.map((settlement, index) => (
          <motion.div
            key={`${settlement.from}-${settlement.to}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-rose-50 to-emerald-50 dark:from-rose-950/20 dark:to-emerald-950/20 border-rose-200/50 dark:border-rose-800/50"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {getParticipantName(settlement.from).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{getParticipantName(settlement.from)}</p>
                <p className="text-sm text-muted-foreground">owes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="font-mono bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
                {formatAmount(settlement.amount, currency)}
              </Badge>
              <ArrowRight className="h-4 w-4 text-orange-500 dark:text-orange-400" />
            </div>

            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-right">{getParticipantName(settlement.to)}</p>
                <p className="text-sm text-muted-foreground text-right">receives</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {getParticipantName(settlement.to).charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200/50">
          <p className="text-sm text-muted-foreground text-center">
            Complete these {settlements.length} payment{settlements.length !== 1 ? 's' : ''} to settle all expenses
          </p>
        </div>
      </CardContent>
    </Card>
  );
}