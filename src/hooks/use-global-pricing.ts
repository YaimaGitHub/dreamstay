import type { GlobalPricingConfig } from "@/types/global-pricing"
import type { Room } from "@/types/room"

export interface GlobalPricingContextType {
  globalConfig: GlobalPricingConfig
  updateGlobalConfig: (config: Partial<GlobalPricingConfig>) => void
  getEffectiveRoomPrice: (room: Room, tourismType?: "national" | "international" | null) => number
  isGlobalPricingActive: boolean
  resetGlobalConfig: () => void
}

// Función para obtener el precio efectivo de una habitación
export const getEffectiveRoomPrice = (
  room: Room,
  globalConfig: GlobalPricingConfig,
  tourismType?: "national" | "international" | null,
): number => {
  console.log(`=== getEffectiveRoomPrice - Room ${room.id} ===`)

  const isGlobalPricingActive = globalConfig.enabled && globalConfig.applyToAllRooms

  console.log("Global config active:", isGlobalPricingActive)
  console.log("Tourism type:", tourismType)
  console.log("Global config:", globalConfig)

  // Si la configuración global no está habilitada, devolver el precio base de la habitación
  if (!isGlobalPricingActive) {
    return room.price
  }

  // Determinar el tipo de turismo
  const tourism = tourismType || "national" // Por defecto, usar nacional

  // Verificar si la configuración para este tipo de turismo está habilitada
  if (!globalConfig[tourism].enabled) {
    return room.price
  }

  // Por defecto, usar configuración por noche
  const pricingConfig = globalConfig[tourism].byNight

  // Si la configuración específica no está habilitada, devolver precio base
  if (!pricingConfig.enabled) {
    return room.price
  }

  // Calcular precio basado en multiplicador o precio fijo
  if (pricingConfig.useMultiplier) {
    return room.price * pricingConfig.multiplier
  } else {
    return pricingConfig.fixedPrice > 0 ? pricingConfig.fixedPrice : room.price
  }
}

// Función para exportar la configuración global como código TypeScript
export function generateGlobalPricingTypeScript(config: GlobalPricingConfig): string {
  return `import type { GlobalPricingConfig } from "@/types/global-pricing";

// Configuración global de precios - Última actualización: ${new Date().toLocaleString()}
export const globalPricingConfig: GlobalPricingConfig = ${JSON.stringify(config, null, 2)};
`
}
