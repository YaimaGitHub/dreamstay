
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import type { Room } from "@/types/room"
import type { RoomFormValues } from "@/components/admin/RoomFormSchema"
import { useDataStore } from "@/hooks/use-data-store"

interface UseRoomFormSubmissionProps {
  mode: "add" | "edit"
  currentRoom?: Room
  features: string[]
  roomImages: Array<{ id: number; url: string; alt: string }>
  initialReservedDates: Array<{ start: string; end: string }>
  reservedDates?: { from?: Date; to?: Date }
}

export function useRoomFormSubmission({
  mode,
  currentRoom,
  features,
  roomImages,
  initialReservedDates,
  reservedDates,
}: UseRoomFormSubmissionProps) {
  const { addRoom, updateRoom, generateTypeScriptFiles } = useDataStore()
  const navigate = useNavigate()
  const [lastModified, setLastModified] = useState<Date | null>(null)

  const handleSubmit = (values: RoomFormValues) => {
    if (features.length === 0) {
      toast.error("Agregue al menos una característica")
      return
    }

    if (roomImages.length === 0) {
      toast.error("Agregue al menos una imagen")
      return
    }

    // Use the first image as the main image
    const mainImage = roomImages[0].url
    const now = new Date()

    // Obtener las fechas reservadas del componente ReservedDatesManager
    // Esto se hace a través del DOM ya que el componente no expone directamente las fechas guardadas
    const reservedDatesElements = document.querySelectorAll("[data-reserved-date]")
    const savedReservedDates: Array<{ start: string; end: string }> = []

    // Si hay fechas en el DOM, las procesamos
    if (reservedDatesElements.length > 0) {
      reservedDatesElements.forEach((element) => {
        const start = element.getAttribute("data-start")
        const end = element.getAttribute("data-end")
        if (start && end) {
          savedReservedDates.push({
            start,
            end,
          })
        }
      })
    } else {
      // Si no hay elementos en el DOM, usamos las fechas iniciales
      // y añadimos la fecha actual si está definida
      const existingDates = initialReservedDates || []
      if (reservedDates?.from && reservedDates?.to) {
        savedReservedDates.push(...existingDates, {
          start: reservedDates.from.toISOString(),
          end: reservedDates.to.toISOString(),
        })
      } else {
        savedReservedDates.push(...existingDates)
      }
    }

    if (mode === "edit" && currentRoom) {
      updateRoom({
        ...currentRoom,
        title: values.title,
        location: values.location,
        province: values.province,
        price: values.price,
        rating: values.rating,
        reviews: values.reviews,
        image: mainImage,
        type: values.type,
        area: values.area,
        description: values.description,
        available: values.isAvailable,
        features,
        images: roomImages,
        reservedDates: savedReservedDates,
        lastUpdated: now.toISOString(),
      })

      toast.success("Habitación actualizada correctamente", {
        action: {
          label: "Generar archivos TS",
          onClick: () => generateTypeScriptFiles(),
        },
      })

      // Actualizar la fecha de última modificación
      setLastModified(now)
    } else {
      addRoom({
        title: values.title,
        location: values.location,
        province: values.province,
        price: values.price,
        rating: values.rating,
        reviews: values.reviews,
        image: mainImage,
        features,
        type: values.type,
        area: values.area,
        description: values.description,
        available: values.isAvailable,
        reservedDates: savedReservedDates,
        images: roomImages,
        lastUpdated: now.toISOString(),
      })

      toast.success("Habitación agregada correctamente", {
        action: {
          label: "Generar archivos TS",
          onClick: () => generateTypeScriptFiles(),
        },
      })

      // Si es una nueva habitación, redirigir a la lista de habitaciones
      if (mode === "add") {
        navigate("/admin/rooms")
      }
    }

    return lastModified
  }

  return { handleSubmit, lastModified, setLastModified }
}
