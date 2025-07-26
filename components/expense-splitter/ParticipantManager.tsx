'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Participant, Currency } from '@/lib/types';
import { formatAmount } from '@/lib/currency';

interface ParticipantManagerProps {
  participants: Participant[];
  currency: Currency;
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (id: string) => void;
}

export function ParticipantManager({
  participants,
  currency,
  onAddParticipant,
  onRemoveParticipant
}: ParticipantManagerProps) {
  const [newParticipantName, setNewParticipantName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddParticipant = () => {
    if (newParticipantName.trim()) {
      onAddParticipant(newParticipantName.trim());
      setNewParticipantName('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddParticipant();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewParticipantName('');
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-cyan-50/90 to-blue-50/90 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200/50 dark:border-cyan-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="popLayout">
          {participants.map((participant) => (
            <motion.div
              key={participant.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200/50 dark:border-teal-800/50 hover:from-teal-100/70 hover:to-cyan-100/70 dark:hover:from-teal-900/30 dark:hover:to-cyan-900/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{participant.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Contributed: {formatAmount(participant.totalContributed, currency)}</span>
                    <span>•</span>
                    <span>Owes: {formatAmount(participant.totalOwed, currency)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {participant.totalContributed > participant.totalOwed ? (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    +{formatAmount(participant.totalContributed - participant.totalOwed, currency)}
                  </Badge>
                ) : participant.totalContributed < participant.totalOwed ? (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                    -{formatAmount(participant.totalOwed - participant.totalContributed, currency)}
                  </Badge>
                ) : (
                  <Badge className="bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0">Even</Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveParticipant(participant.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isAdding ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2"
            >
              <Input
                placeholder="Enter participant name"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
                className="flex-1"
              />
              <Button onClick={handleAddParticipant} size="sm" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0">
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewParticipantName('');
                }}
              >
                Cancel
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => setIsAdding(true)}
                className="w-full border-dashed border-2 border-teal-300/50 hover:border-teal-500 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 dark:hover:from-teal-950/30 dark:hover:to-cyan-950/30 text-teal-700 dark:text-teal-300 transition-all duration-200"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Participant
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}