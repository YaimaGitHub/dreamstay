"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrencyLanguage } from "@/contexts/CurrencyLanguageContext"

export const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency, getEnabledCurrencies } = useCurrencyLanguage()
  const enabledCurrencies = getEnabledCurrencies()

  return (
    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
      <SelectTrigger className="w-24">
        <SelectValue placeholder="Moneda" />
      </SelectTrigger>
      <SelectContent>
        {enabledCurrencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
