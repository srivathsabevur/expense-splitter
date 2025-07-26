'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencies, Currency } from '@/lib/currency';

interface CurrencySelectorProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function CurrencySelector({ currency, onCurrencyChange }: CurrencySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={currency.code}
        onValueChange={(code) => {
          const selectedCurrency = currencies.find(c => c.code === code);
          if (selectedCurrency) {
            onCurrencyChange(selectedCurrency);
          }
        }}
      >
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span className="font-mono">{currency.symbol}</span>
              <span className="text-xs hidden sm:inline">{currency.code}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              <div className="flex items-center gap-2">
                <span className="font-mono w-6">{curr.symbol}</span>
                <span className="text-xs text-muted-foreground w-8">{curr.code}</span>
                <span className="text-sm">{curr.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}