"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

// Tipos de monedas soportadas
export type Currency = "USD" | "EUR" | "CUP"

// Tipos de idiomas soportados
export type Language = "es" | "en"

// Valores predeterminados definidos en el código fuente
const DEFAULT_CURRENCY: Currency = "USD"
const DEFAULT_LANGUAGE: Language = "es"

// Tasas de conversión (relativas al USD)
const conversionRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92, // 1 USD = 0.92 EUR (aproximado)
  CUP: 24, // 1 USD = 24 CUP (aproximado)
}

// Símbolos de moneda
export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  CUP: "₱",
}

interface CurrencyLanguageContextType {
  currency: Currency
  language: Language
  setCurrency: (currency: Currency) => void
  setLanguage: (language: Language) => void
  formatPrice: (price: number) => string
  convertPrice: (price: number) => number
  t: (key: string) => string
}

const CurrencyLanguageContext = createContext<CurrencyLanguageContextType | undefined>(undefined)

export const CurrencyLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usar valores predeterminados definidos en el código fuente
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY)
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)

  // Actualizar el atributo lang del documento HTML cuando cambie el idioma
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    document.documentElement.lang = newLanguage
  }

  // Convertir precio a la moneda seleccionada
  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * conversionRates[currency]
  }

  // Formatear precio con símbolo de moneda
  const formatPrice = (priceInUSD: number): string => {
    const converted = convertPrice(priceInUSD)
    const symbol = currencySymbols[currency]

    // Formatear según la moneda
    if (currency === "CUP") {
      // Para CUP, mostrar sin decimales
      return `${symbol}${Math.round(converted)}`
    } else {
      // Para USD y EUR, mostrar con 2 decimales
      return `${symbol}${converted.toFixed(2)}`
    }
  }

  // Función de traducción simple
  const t = (key: string): string => {
    try {
      // Importar las traducciones directamente desde los archivos
      const translations =
        language === "es" ? require("../translations/es").default : require("../translations/en").default

      return translations[key] || key
    } catch (error) {
      // Si hay algún error, devolver la clave original
      console.error("Error loading translations:", error)
      return key
    }
  }

  const value = {
    currency,
    language,
    setCurrency,
    setLanguage: handleLanguageChange,
    formatPrice,
    convertPrice,
    t,
  }

  return <CurrencyLanguageContext.Provider value={value}>{children}</CurrencyLanguageContext.Provider>
}

// Hook personalizado para usar el contexto
export const useCurrencyLanguage = () => {
  const context = useContext(CurrencyLanguageContext)
  if (context === undefined) {
    throw new Error("useCurrencyLanguage debe usarse dentro de un CurrencyLanguageProvider")
  }
  return context
}
