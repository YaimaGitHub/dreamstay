export interface GlobalPricingConfig {
  enabled: boolean
  applyToAllRooms: boolean
  lastUpdated: string | null

  // Configuración para turismo nacional
  national: {
    enabled: boolean
    byNight: {
      enabled: boolean
      useMultiplier: boolean
      multiplier: number
      fixedPrice: number
    }
    byHour: {
      enabled: boolean
      useMultiplier: boolean
      multiplier: number
      fixedPrice: number
    }
  }

  // Configuración para turismo internacional
  international: {
    enabled: boolean
    byNight: {
      enabled: boolean
      useMultiplier: boolean
      multiplier: number
      fixedPrice: number
    }
    byHour: {
      enabled: boolean
      useMultiplier: boolean
      multiplier: number
      fixedPrice: number
    }
  }
}

export interface PricingOption {
  enabled: boolean
  useMultiplier: boolean
  multiplier: number
  fixedPrice: number
}
