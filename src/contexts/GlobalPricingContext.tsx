"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { globalPricingConfig as initialGlobalConfig } from "@/data/global-pricing"
import type { GlobalPricingConfig } from "@/types/global-pricing"
import { getEffectiveRoomPrice, type GlobalPricingContextType } from "@/hooks/use-global-pricing"
import { toast } from "@/components/ui/sonner"

const GlobalPricingContext = createContext<GlobalPricingContextType | undefined>(undefined)

export const GlobalPricingProvider = ({ children }: { children: ReactNode }) => {
  const [globalConfig, setGlobalConfig] = useState<GlobalPricingConfig>(initialGlobalConfig)

  // Cargar configuración desde localStorage al inicializar
  useEffect(() => {
    const savedConfig = localStorage.getItem("globalPricingConfig")
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        setGlobalConfig(parsedConfig)
        console.log("✅ Configuración global cargada desde localStorage:", parsedConfig)
      } catch (error) {
        console.error("❌ Error al cargar configuración global:", error)
      }
    }
  }, [])

  // Guardar configuración en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("globalPricingConfig", JSON.stringify(globalConfig))
    console.log("💾 Configuración global guardada:", globalConfig)
  }, [globalConfig])

  const updateGlobalConfig = (updates: Partial<GlobalPricingConfig>) => {
    const updatedConfig = {
      ...globalConfig,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    setGlobalConfig(updatedConfig)

    toast.success("Configuración global actualizada", {
      description: "Los cambios se aplicarán a todas las habitaciones de la plataforma",
    })

    console.log("🔄 Configuración global actualizada:", updatedConfig)
  }

  const resetGlobalConfig = () => {
    setGlobalConfig(initialGlobalConfig)
    localStorage.removeItem("globalPricingConfig")
    toast.info("Configuración global restablecida")
  }

  const isGlobalPricingActive = globalConfig.enabled && globalConfig.applyToAllRooms

  // Wrapper para la función de precio efectivo
  const getEffectiveRoomPriceWrapper = (room: any, tourismType?: "national" | "international" | null) => {
    return getEffectiveRoomPrice(room, globalConfig, tourismType)
  }

  return (
    <GlobalPricingContext.Provider
      value={{
        globalConfig,
        updateGlobalConfig,
        getEffectiveRoomPrice: getEffectiveRoomPriceWrapper,
        isGlobalPricingActive,
        resetGlobalConfig,
      }}
    >
      {children}
    </GlobalPricingContext.Provider>
  )
}

export const useGlobalPricing = () => {
  const context = useContext(GlobalPricingContext)
  if (context === undefined) {
    throw new Error("useGlobalPricing must be used within a GlobalPricingProvider")
  }
  return context
}
