'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Users, Calculator } from 'lucide-react';
import { ExpenseSplitter } from '@/components/expense-splitter/ExpenseSplitter';
import { DarkModeToggle } from '@/components/expense-splitter/DarkModeToggle';
import { CurrencySelector } from '@/components/expense-splitter/CurrencySelector';
import { defaultCurrency, Currency } from '@/lib/currency';

export default function Home() {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-violet-950 dark:via-blue-950 dark:to-cyan-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="relative">
        {/* Header */}
        <header className="border-b border-violet-200/40 dark:border-violet-800/40 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">SplitWise</h1>
                  <p className="text-sm text-muted-foreground">Expense Splitter</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <CurrencySelector
                  currency={currency}
                  onCurrencyChange={setCurrency}
                />
                <DarkModeToggle />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Split Expenses Effortlessly
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Manage group expenses for trips, meals, and activities with precision and ease
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 rounded-lg bg-gradient-to-br from-cyan-50/80 to-blue-50/80 dark:from-cyan-950/30 dark:to-blue-950/30 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/50"
                >
                  <Users className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Unlimited Participants</h3>
                  <p className="text-sm text-muted-foreground">
                    Add as many friends and family members as needed
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-6 rounded-lg bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50"
                >
                  <Receipt className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Flexible Splitting</h3>
                  <p className="text-sm text-muted-foreground">
                    Equal splits, custom percentages, or exclude participants
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-6 rounded-lg bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-orange-950/30 dark:to-red-950/30 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50"
                >
                  <Calculator className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Smart Calculations</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic settlement optimization with clear breakdowns
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Application */}
        <main className="container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <ExpenseSplitter currency={currency} />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-violet-200/40 dark:border-violet-800/40 py-8 px-4 mt-12">
          <div className="container mx-auto text-center text-muted-foreground">
            <p>&copy; 2025 SplitWise. Built with Next.js, TypeScript, and Tailwind CSS.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}