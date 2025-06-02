"use client"

import { useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { Room } from "@/types/room"
import type { RoomFormValues } from "@/components/admin/RoomFormSchema"
import type { DateRange } from "react-day-picker"

interface UseRoomFormStateProps {
  mode: "add" | "edit"
  currentRoom?: Room
  form: UseFormReturn<RoomFormValues>
}

export const useRoomFormState = ({ mode, currentRoom, form }: UseRoomFormStateProps) => {
  const [features, setFeatures] = useState<string[]>([])
  const [roomImages, setRoomImages] = useState<Array<{ id: number; url: string; alt: string }>>([])
  const [lastModified, setLastModified] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Preparar fechas reservadas iniciales
  const initialReservedDates = currentRoom?.reservedDates || []

  useEffect(() => {
    if (mode === "edit" && currentRoom) {
      console.log("=== LOADING ROOM DATA FOR EDITING ===")
      console.log("Current room:", currentRoom)
      console.log("WhatsApp config:", currentRoom.hostWhatsApp)
      console.log("Reserved dates:", currentRoom.reservedDates)

      // Cargar características
      setFeatures(currentRoom.features || [])

      // Cargar imágenes
      if (currentRoom.images && currentRoom.images.length > 0) {
        setRoomImages(currentRoom.images)
      } else if (currentRoom.image) {
        setRoomImages([
          {
            id: 1,
            url: currentRoom.image,
            alt: `Imagen de ${currentRoom.title}`,
          },
        ])
      }

      // Cargar fecha de última modificación
      if (currentRoom.lastUpdated) {
        setLastModified(new Date(currentRoom.lastUpdated))
      }

      // CRÍTICO: Cargar configuración de WhatsApp en el formulario
      if (currentRoom.hostWhatsApp) {
        console.log("Loading WhatsApp config into form:", currentRoom.hostWhatsApp)
        form.setValue("hostWhatsApp.enabled", currentRoom.hostWhatsApp.enabled)
        form.setValue("hostWhatsApp.primary", currentRoom.hostWhatsApp.primary || "")
        form.setValue("hostWhatsApp.secondary", currentRoom.hostWhatsApp.secondary || "")
        form.setValue("hostWhatsApp.sendToPrimary", currentRoom.hostWhatsApp.sendToPrimary ?? true)
        form.setValue("hostWhatsApp.sendToSecondary", currentRoom.hostWhatsApp.sendToSecondary ?? false)
      }

      console.log("Form values after loading:", form.getValues())
    }
  }, [mode, currentRoom, form])

  return {
    features,
    setFeatures,
    roomImages,
    setRoomImages,
    lastModified,
    initialReservedDates,
    dateRange,
    setDateRange,
  }
}
