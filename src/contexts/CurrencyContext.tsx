"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"

// Tipos de monedas soportadas
export type CurrencyCode = "CUP" | "EUR" | "USD" | "MLC" | "CAD" | "MXN" | "ZELLE"

// Interfaz para la tasa de cambio
export interface CurrencyRate {
  code: CurrencyCode
  name: string
  symbol: string
  rate: number // Tasa de cambio respecto a CUP (1 MONEDA = X CUP)
  enabled: boolean
}

// Configuración global de monedas
export interface CurrencyConfig {
  defaultCurrency: CurrencyCode
  baseCurrency: CurrencyCode // Moneda base para los cálculos (CUP)
  rates: CurrencyRate[]
}

// Tasas de cambio iniciales según el mercado informal en Cuba
export const defaultCurrencyConfig: CurrencyConfig = {
  defaultCurrency: "CUP",
  baseCurrency: "CUP",
  rates: [
    { code: "CUP", name: "Peso Cubano", symbol: "₱", rate: 1, enabled: true },
    { code: "EUR", name: "Euro", symbol: "€", rate: 395, enabled: true },
    { code: "USD", name: "Dólar Estadounidense", symbol: "$", rate: 373, enabled: true },
    { code: "MLC", name: "Moneda Libremente Convertible", symbol: "MLC", rate: 260, enabled: true },
    { code: "CAD", name: "Dólar Canadiense", symbol: "C$", rate: 240, enabled: true },
    { code: "MXN", name: "Peso Mexicano", symbol: "MX$", rate: 19, enabled: true },
    { code: "ZELLE", name: "Zelle", symbol: "Z$", rate: 366, enabled: true },
  ],
}

interface CurrencyContextType {
  config: CurrencyConfig
  updateConfig: (newConfig: CurrencyConfig) => void
  selectedCurrency: CurrencyCode
  setSelectedCurrency: (currency: CurrencyCode) => void
  formatPrice: (priceInCUP: number) => string
  convertPrice: (priceInCUP: number, targetCurrency?: CurrencyCode) => number
  getEnabledCurrencies: () => CurrencyRate[]
  getCurrencyByCode: (code: CurrencyCode) => CurrencyRate | undefined
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  // Usar la configuración predeterminada
  const [config, setConfig] = useState<CurrencyConfig>(defaultCurrencyConfig)
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(config.defaultCurrency)

  // Actualizar la moneda seleccionada cuando cambie la configuración
  useEffect(() => {
    // Solo cambiar si la moneda actual no está habilitada
    const currentCurrencyEnabled = config.rates.find((r) => r.code === selectedCurrency)?.enabled
    if (!currentCurrencyEnabled) {
      setSelectedCurrency(config.defaultCurrency)
    }
  }, [config, selectedCurrency])

  // Actualizar la configuración de monedas
  const updateConfig = (newConfig: CurrencyConfig) => {
    setConfig(newConfig)
    // Si la moneda seleccionada ya no está habilitada, cambiar a la predeterminada
    const currencyStillEnabled = newConfig.rates.find((r) => r.code === selectedCurrency)?.enabled
    if (!currencyStillEnabled) {
      setSelectedCurrency(newConfig.defaultCurrency)
    }
  }

  // Obtener la tasa de cambio para una moneda específica
  const getRate = (currencyCode: CurrencyCode): number => {
    const currency = config.rates.find((r) => r.code === currencyCode && r.enabled)
    return currency ? currency.rate : 1 // Si no se encuentra, usar 1 (CUP)
  }

  // Convertir precio de CUP a la moneda seleccionada
  const convertPrice = (priceInCUP: number, targetCurrency?: CurrencyCode): number => {
    const currency = targetCurrency || selectedCurrency
    const rate = getRate(currency)

    // Si la moneda es CUP, devolver el precio sin conversión
    if (currency === "CUP") return priceInCUP

    // Para otras monedas, convertir de CUP a la moneda objetivo
    return priceInCUP / rate
  }

  // Formatear precio con símbolo de moneda
  const formatPrice = (priceInCUP: number): string => {
    const converted = convertPrice(priceInCUP)
    const currency = config.rates.find((r) => r.code === selectedCurrency)

    if (!currency) return `₱${priceInCUP}`

    // Formatear según la moneda
    const formattedValue = new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted)

    return `${currency.symbol}${formattedValue}`
  }

  // Obtener solo las monedas habilitadas
  const getEnabledCurrencies = (): CurrencyRate[] => {
    return config.rates.filter((r) => r.enabled)
  }

  // Obtener una moneda por su código
  const getCurrencyByCode = (code: CurrencyCode): CurrencyRate | undefined => {
    return config.rates.find((r) => r.code === code)
  }

  const value = {
    config,
    updateConfig,
    selectedCurrency,
    setSelectedCurrency,
    formatPrice,
    convertPrice,
    getEnabledCurrencies,
    getCurrencyByCode,
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

// Hook personalizado para usar el contexto
export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency debe usarse dentro de un CurrencyProvider")
  }
  return context
}
