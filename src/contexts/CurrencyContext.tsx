"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useMemo, useCallback } from "react"
import { DollarSign, Euro } from "lucide-react"

export type CurrencyCode = "CUP" | "USD" | "EUR"

interface ExchangeRates {
  CUP: number
  USD: number
  EUR: number
}

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  convertPrice: (price: number) => number
  formatPrice: (price: number) => string
  formatPriceWithIcon: (price: number) => React.ReactNode
  currencySymbol: string
}

// Mock exchange rates (in a real application, these would come from an API)
// These are informal market rates for Cuba as of May 2025 (fictional for this example)
const EXCHANGE_RATES: ExchangeRates = {
  CUP: 1,
  USD: 280, // 1 USD = 280 CUP (example rate)
  EUR: 305, // 1 EUR = 305 CUP (example rate)
}

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  CUP: "$",
  USD: "$",
  EUR: "€",
}

const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  CUP: "CUP",
  USD: "USD",
  EUR: "EUR",
}

// Create a cache for converted prices to improve performance
const priceCache = new Map<string, number>()

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyCode>("CUP")

  // Load saved currency from localStorage on initial render
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("currency") as CurrencyCode
      if (savedCurrency && Object.keys(EXCHANGE_RATES).includes(savedCurrency)) {
        setCurrency(savedCurrency)
      }
    } catch (error) {
      console.error("Error loading currency from localStorage:", error)
    }
  }, [])

  // Save currency to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("currency", currency)
    } catch (error) {
      console.error("Error saving currency to localStorage:", error)
    }
  }, [currency])

  // Memoize the conversion function to improve performance
  const convertPrice = useCallback(
    (priceInCUP: number): number => {
      if (currency === "CUP") return priceInCUP

      // Check if the price is already in the cache
      const cacheKey = `${priceInCUP}-${currency}`
      if (priceCache.has(cacheKey)) {
        return priceCache.get(cacheKey)!
      }

      // Calculate and cache the converted price
      const convertedPrice = Number.parseFloat((priceInCUP / EXCHANGE_RATES[currency]).toFixed(2))
      priceCache.set(cacheKey, convertedPrice)

      return convertedPrice
    },
    [currency],
  )

  // Memoize the formatting function to improve performance
  const formatPrice = useCallback(
    (price: number): string => {
      const convertedPrice = convertPrice(price)
      return `${CURRENCY_SYMBOLS[currency]}${convertedPrice.toFixed(2)}`
    },
    [currency, convertPrice],
  )

  // Memoize the formatting with icon function to improve performance
  const formatPriceWithIcon = useCallback(
    (price: number): React.ReactNode => {
      const convertedPrice = convertPrice(price)
      return (
        <span className="flex items-center gap-1">
          {currency === "USD" ? (
            <DollarSign className="h-4 w-4" />
          ) : currency === "EUR" ? (
            <Euro className="h-4 w-4" />
          ) : (
            <span>{CURRENCY_SYMBOLS[currency]}</span>
          )}
          {convertedPrice.toFixed(2)} <span className="text-xs">{CURRENCY_NAMES[currency]}</span>
        </span>
      )
    },
    [currency, convertPrice],
  )

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<CurrencyContextType>(
    () => ({
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
      formatPriceWithIcon,
      currencySymbol: CURRENCY_SYMBOLS[currency],
    }),
    [currency, convertPrice, formatPrice, formatPriceWithIcon],
  )

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>
}

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
