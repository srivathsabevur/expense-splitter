"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, DollarSign, Users, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Participant, Expense, Currency } from "@/lib/types";
import { formatAmount } from "@/lib/currency";

interface ExpenseFormProps {
  participants: Participant[];
  currency: Currency;
  onAddExpense: (expense: Omit<Expense, "id" | "date">) => void;
  editingExpense?: Expense | null;
  onUpdateExpense?: (expense: Expense) => void;
  onCancelEdit?: () => void;
}

export function ExpenseForm({
  participants,
  currency,
  onAddExpense,
  editingExpense,
  onUpdateExpense,
  onCancelEdit,
}: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [useCustomSplits, setUseCustomSplits] = useState(false);
  const [customSplits, setCustomSplits] = useState<{ [key: string]: number }>(
    {}
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Effect to populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setPaidBy(editingExpense.paidBy);
      setSelectedParticipants(editingExpense.participants);
      setUseCustomSplits(!!editingExpense.customSplits);
      setCustomSplits(editingExpense.customSplits || {});
      setIsExpanded(!!editingExpense.customSplits);
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !description.trim() ||
      !amount ||
      !paidBy ||
      selectedParticipants.length === 0
    ) {
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      return;
    }

    // Validate custom splits if enabled
    if (useCustomSplits) {
      const totalPercentage = selectedParticipants.reduce((sum, id) => {
        return sum + (customSplits[id] || 0);
      }, 0);

      if (Math.abs(totalPercentage - 100) > 0.01) {
        alert("Custom split percentages must add up to 100%");
        return;
      }
    }

    const expenseData = {
      description: description.trim(),
      amount: expenseAmount,
      paidBy,
      participants: selectedParticipants,
      customSplits: useCustomSplits ? customSplits : undefined,
    };

    if (editingExpense && onUpdateExpense) {
      onUpdateExpense({
        ...editingExpense,
        ...expenseData,
      });
    } else {
      onAddExpense(expenseData);
    }

    // Reset form
    setDescription("");
    setAmount("");
    setPaidBy("");
    setSelectedParticipants([]);
    setCustomSplits({});
    setUseCustomSplits(false);
    setIsExpanded(false);
  };

  const handleParticipantToggle = (participantId: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants([...selectedParticipants, participantId]);
      if (useCustomSplits) {
        const equalSplit = 100 / (selectedParticipants.length + 1);
        const newSplits = { ...customSplits };
        selectedParticipants.forEach((id) => {
          newSplits[id] = equalSplit;
        });
        newSplits[participantId] = equalSplit;
        setCustomSplits(newSplits);
      }
    } else {
      setSelectedParticipants(
        selectedParticipants.filter((id) => id !== participantId)
      );
      if (useCustomSplits) {
        const newSplits = { ...customSplits };
        delete newSplits[participantId];
        const remainingParticipants = selectedParticipants.filter(
          (id) => id !== participantId
        );
        if (remainingParticipants.length > 0) {
          const equalSplit = 100 / remainingParticipants.length;
          remainingParticipants.forEach((id) => {
            newSplits[id] = equalSplit;
          });
        }
        setCustomSplits(newSplits);
      }
    }
  };

  const handleCustomSplitChange = (participantId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomSplits({
      ...customSplits,
      [participantId]: numValue,
    });
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    // Reset form
    setDescription("");
    setAmount("");
    setPaidBy("");
    setSelectedParticipants([]);
    setCustomSplits({});
    setUseCustomSplits(false);
    setIsExpanded(false);
  };

  const totalCustomSplit = selectedParticipants.reduce((sum, id) => {
    return sum + (customSplits[id] || 0);
  }, 0);

  if (participants.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50/90 to-red-50/90 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200/50 dark:border-orange-800/50">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Add participants first to create expenses
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50/90 to-red-50/90 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200/50 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            {editingExpense ? "Edit Expense" : "Add Expense"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30"
          >
            {isExpanded ? "Simple" : "Advanced"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Dinner at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({currency.symbol})</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid by</Label>
            <Select value={paidBy} onValueChange={setPaidBy} required>
              <SelectTrigger>
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Split between</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedParticipants.length === participants.length) {
                    // Deselect all
                    setSelectedParticipants([]);
                    setCustomSplits({});
                  } else {
                    // Select all
                    const allParticipantIds = participants.map((p) => p.id);
                    setSelectedParticipants(allParticipantIds);
                    if (useCustomSplits) {
                      const equalSplit = 100 / participants.length;
                      const newSplits: { [key: string]: number } = {};
                      allParticipantIds.forEach((id) => {
                        newSplits[id] = equalSplit;
                      });
                      setCustomSplits(newSplits);
                    }
                  }
                }}
                className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              >
                {selectedParticipants.length === participants.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 rounded border border-orange-200/50 bg-gradient-to-r from-orange-50/30 to-red-50/30 dark:from-orange-950/10 dark:to-red-950/10"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={participant.id}
                      checked={selectedParticipants.includes(participant.id)}
                      onCheckedChange={(checked) =>
                        handleParticipantToggle(
                          participant.id,
                          checked as boolean
                        )
                      }
                      className="border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <Label htmlFor={participant.id} className="font-normal">
                      {participant.name}
                    </Label>
                  </div>
                  {useCustomSplits &&
                    selectedParticipants.includes(participant.id) && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          className="w-20 h-8"
                          value={customSplits[participant.id] || ""}
                          onChange={(e) =>
                            handleCustomSplitChange(
                              participant.id,
                              e.target.value
                            )
                          }
                          placeholder="0"
                        />
                        <Percent className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="space-y-4 border-t pt-4"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="customSplits">
                  Use custom split percentages
                </Label>
                <Switch
                  id="customSplits"
                  checked={useCustomSplits}
                  onCheckedChange={setUseCustomSplits}
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>

              {useCustomSplits && (
                <div className="p-3 bg-gradient-to-r from-orange-100/50 to-red-100/50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200/50">
                  <div className="text-sm text-muted-foreground mb-2">
                    Total: {totalCustomSplit.toFixed(1)}%
                    {Math.abs(totalCustomSplit - 100) > 0.01 && (
                      <span className="text-destructive ml-2">
                        (Must equal 100%)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
              disabled={
                !description.trim() ||
                !amount ||
                !paidBy ||
                selectedParticipants.length === 0 ||
                (useCustomSplits && Math.abs(totalCustomSplit - 100) > 0.01)
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingExpense ? "Update Expense" : "Add Expense"}
            </Button>
            {editingExpense && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
