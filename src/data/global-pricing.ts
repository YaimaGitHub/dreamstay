import type { GlobalPricingConfig } from "@/types/global-pricing"

// Configuración inicial para precios globales
export const globalPricingConfig: GlobalPricingConfig = {
  enabled: false,
  applyToAllRooms: true,
  lastUpdated: null,

  // Configuración para turismo nacional
  national: {
    enabled: false,
    byNight: {
      enabled: false,
      useMultiplier: false,
      multiplier: 1.0,
      fixedPrice: 0,
    },
    byHour: {
      enabled: false,
      useMultiplier: false,
      multiplier: 1.0,
      fixedPrice: 0,
    },
  },

  // Configuración para turismo internacional
  international: {
    enabled: false,
    byNight: {
      enabled: false,
      useMultiplier: false,
      multiplier: 1.5,
      fixedPrice: 0,
    },
    byHour: {
      enabled: false,
      useMultiplier: false,
      multiplier: 1.5,
      fixedPrice: 0,
    },
  },
}
