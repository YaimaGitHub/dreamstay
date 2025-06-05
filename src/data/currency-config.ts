import type { CurrencyConfig } from "@/contexts/CurrencyLanguageContext"

// Configuración inicial de monedas (tasas de cambio del mercado informal en Cuba)
export const currencyConfig: CurrencyConfig[] = [
  { code: "CUP", name: "Peso Cubano", symbol: "₱", rate: 1, enabled: true },
  { code: "USD", name: "Dólar Estadounidense", symbol: "$", rate: 373, enabled: true },
  { code: "EUR", name: "Euro", symbol: "€", rate: 395, enabled: true },
  { code: "MLC", name: "Moneda Libremente Convertible", symbol: "MLC", rate: 260, enabled: true },
  { code: "CAD", name: "Dólar Canadiense", symbol: "C$", rate: 240, enabled: true },
  { code: "MXN", name: "Peso Mexicano", symbol: "MX$", rate: 19, enabled: true },
  { code: "ZELLE", name: "Zelle", symbol: "Z$", rate: 366, enabled: true },
]

export default currencyConfig
