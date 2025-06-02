import type { Room } from "@/types/room"

export interface PriceDisplay {
  amount: number
  unit: string
  tourismType?: string
  fullText: string
}

/**
 * Obtiene el precio principal a mostrar según las preferencias
 */
export function getPrimaryPrice(
  room: Room,
  tourismType: "national" | "international" = "national",
): { price: number; unit: string } {
  // Si no hay opciones de precios, usar el precio base
  if (!room.pricingOptions) {
    return {
      price: room.price,
      unit: "noche",
    }
  }

  // Fallback al precio base si no hay configuración válida
  return {
    price: room.price,
    unit: "noche",
  }
}

/**
 * Obtiene todos los precios disponibles para una habitación
 */
export function getAllAvailablePrices(room: Room): Array<{
  amount: number
  unit: string
  tourismType?: string
  fullText: string
}> {
  return [
    {
      amount: room.price,
      unit: "noche",
      fullText: `$${room.price} / noche`,
    },
  ]
}
