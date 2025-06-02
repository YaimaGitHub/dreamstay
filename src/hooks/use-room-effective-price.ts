"use client"

import { useMemo } from "react"
import type { Room } from "@/types/room"

interface EffectivePrice {
  nightlyPrice: number | null
  hourlyPrice: number | null
  hasNightlyRate: boolean
  hasHourlyRate: boolean
  tourismType: "Nacional" | "Internacional" | null
  source: "specific-national" | "specific-international" | "auto-national" | "auto-international" | "base-price"
  mainPrice: number
  mainPriceLabel: string
  displayTexts: string[]
}

export function useRoomEffectivePrice(
  room: Room,
  preferredTourismType?: "national" | "international" | null,
): EffectivePrice {
  return useMemo(() => {
    // PRIORIDAD ABSOLUTA: Si hay configuración de pricing, REEMPLAZA el precio base
    if (room.pricing) {
      // Si se especifica un tipo de turismo, usarlo
      if (preferredTourismType === "national" && room.pricing.nationalTourism?.enabled) {
        const nationalPricing = room.pricing.nationalTourism
        const nightlyPrice = nationalPricing.nightlyRate?.enabled ? nationalPricing.nightlyRate.price : null
        const hourlyPrice = nationalPricing.hourlyRate?.enabled ? nationalPricing.hourlyRate.price : null

        const displayTexts = []
        if (nightlyPrice && nightlyPrice > 0) {
          displayTexts.push(`$${nightlyPrice}/ noche Turismo (Nacional)`)
        }
        if (hourlyPrice && hourlyPrice > 0) {
          displayTexts.push(`$${hourlyPrice}/ hora Turismo (Nacional)`)
        }

        return {
          nightlyPrice,
          hourlyPrice,
          hasNightlyRate: nationalPricing.nightlyRate?.enabled || false,
          hasHourlyRate: nationalPricing.hourlyRate?.enabled || false,
          tourismType: "Nacional",
          source: "specific-national",
          mainPrice: nightlyPrice || hourlyPrice || room.price,
          mainPriceLabel: nightlyPrice ? "noche" : "hora",
          displayTexts,
        }
      }

      if (preferredTourismType === "international" && room.pricing.internationalTourism?.enabled) {
        const internationalPricing = room.pricing.internationalTourism
        const nightlyPrice = internationalPricing.nightlyRate?.enabled ? internationalPricing.nightlyRate.price : null

        const displayTexts = []
        if (nightlyPrice && nightlyPrice > 0) {
          displayTexts.push(`$${nightlyPrice}/ noche Turismo (Internacional)`)
        }

        return {
          nightlyPrice,
          hourlyPrice: null,
          hasNightlyRate: internationalPricing.nightlyRate?.enabled || false,
          hasHourlyRate: false,
          tourismType: "Internacional",
          source: "specific-international",
          mainPrice: nightlyPrice || room.price,
          mainPriceLabel: "noche",
          displayTexts,
        }
      }

      // Si no se especifica tipo, usar el PRIMER tipo disponible (prioridad: nacional > internacional)
      if (room.pricing.nationalTourism?.enabled) {
        const nationalPricing = room.pricing.nationalTourism
        const nightlyPrice = nationalPricing.nightlyRate?.enabled ? nationalPricing.nightlyRate.price : null
        const hourlyPrice = nationalPricing.hourlyRate?.enabled ? nationalPricing.hourlyRate.price : null

        const displayTexts = []
        if (nightlyPrice && nightlyPrice > 0) {
          displayTexts.push(`$${nightlyPrice}/ noche Turismo (Nacional)`)
        }
        if (hourlyPrice && hourlyPrice > 0) {
          displayTexts.push(`$${hourlyPrice}/ hora Turismo (Nacional)`)
        }

        return {
          nightlyPrice,
          hourlyPrice,
          hasNightlyRate: nationalPricing.nightlyRate?.enabled || false,
          hasHourlyRate: nationalPricing.hourlyRate?.enabled || false,
          tourismType: "Nacional",
          source: "auto-national",
          mainPrice: nightlyPrice || hourlyPrice || room.price,
          mainPriceLabel: nightlyPrice ? "noche" : "hora",
          displayTexts,
        }
      }

      if (room.pricing.internationalTourism?.enabled) {
        const internationalPricing = room.pricing.internationalTourism
        const nightlyPrice = internationalPricing.nightlyRate?.enabled ? internationalPricing.nightlyRate.price : null

        const displayTexts = []
        if (nightlyPrice && nightlyPrice > 0) {
          displayTexts.push(`$${nightlyPrice}/ noche Turismo (Internacional)`)
        }

        return {
          nightlyPrice,
          hourlyPrice: null,
          hasNightlyRate: internationalPricing.nightlyRate?.enabled || false,
          hasHourlyRate: false,
          tourismType: "Internacional",
          source: "auto-international",
          mainPrice: nightlyPrice || room.price,
          mainPriceLabel: "noche",
          displayTexts: [`$${nightlyPrice}/ noche Turismo (Internacional)`],
        }
      }
    }

    // FALLBACK: Solo usar precio base si NO hay configuración de pricing
    return {
      nightlyPrice: room.price,
      hourlyPrice: null,
      hasNightlyRate: true,
      hasHourlyRate: false,
      tourismType: null,
      source: "base-price",
      mainPrice: room.price,
      mainPriceLabel: "noche",
      displayTexts: [`$${room.price}/ noche`],
    }
  }, [room, preferredTourismType])
}
