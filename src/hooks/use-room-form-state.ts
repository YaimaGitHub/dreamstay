"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import type { Room } from "@/types/room"
import type { UseFormReturn } from "react-hook-form"
import type { RoomFormValues } from "@/components/admin/RoomFormSchema"

interface UseRoomFormStateProps {
  mode: "add" | "edit"
  currentRoom?: Room
  form: UseFormReturn<RoomFormValues>
}

export function useRoomFormState({ mode, currentRoom, form }: UseRoomFormStateProps) {
  const [features, setFeatures] = useState<string[]>([])
  const [reservedDates, setReservedDates] = useState<DateRange | undefined>()
  const [roomImages, setRoomImages] = useState<{ id: number; url: string; alt: string }[]>([])
  const [lastModified, setLastModified] = useState<Date | null>(null)
  const [initialReservedDates, setInitialReservedDates] = useState<Array<{ start: string; end: string }>>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    if (mode === "edit" && currentRoom) {
      // Set features
      setFeatures(currentRoom.features || [])

      // Set images
      if (currentRoom.images && currentRoom.images.length > 0) {
        setRoomImages(currentRoom.images)
      } else if (currentRoom.image) {
        // Si no hay imágenes pero hay una imagen principal, la añadimos al array
        setRoomImages([
          {
            id: 1,
            url: currentRoom.image,
            alt: currentRoom.title,
          },
        ])
      }

      // Set last modified date
      if (currentRoom.lastUpdated) {
        setLastModified(new Date(currentRoom.lastUpdated))
      }

      // Set reserved dates if they exist
      if (currentRoom.reservedDates && currentRoom.reservedDates.length > 0) {
        setInitialReservedDates(currentRoom.reservedDates)
      }

      // Set province field
      if (currentRoom.province) {
        form.setValue("province", currentRoom.province)
      }
    }
  }, [currentRoom, mode, form])

  return {
    features,
    setFeatures,
    reservedDates,
    setReservedDates,
    roomImages,
    setRoomImages,
    lastModified,
    setLastModified,
    initialReservedDates,
    dateRange,
    setDateRange,
  }
}
