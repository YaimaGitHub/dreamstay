import { useNavigate } from "react-router-dom"
import { useDataStore } from "@/hooks/use-data-store"
import { toast } from "@/components/ui/sonner"
import type { Room } from "@/types/room"
import type { RoomFormValues } from "@/components/admin/RoomFormSchema"
import type { DateRange } from "react-day-picker"

interface UseRoomFormSubmissionProps {
  mode: "add" | "edit"
  currentRoom?: Room
  features: string[]
  roomImages: Array<{ id: number; url: string; alt: string }>
  initialReservedDates: Array<{ start: string; end: string }>
  reservedDates: DateRange | undefined
}

export const useRoomFormSubmission = ({
  mode,
  currentRoom,
  features,
  roomImages,
  initialReservedDates,
  reservedDates,
}: UseRoomFormSubmissionProps) => {
  const { addRoom, updateRoom } = useDataStore()
  const navigate = useNavigate()

  const handleSubmit = (values: RoomFormValues) => {
    try {
      console.log("=== GUARDANDO HABITACIÓN ===")
      console.log("Valores del formulario:", values)
      console.log("Configuración WhatsApp:", values.hostWhatsApp)
      console.log("Fechas reservadas recibidas:", reservedDates)

      // Validar que si WhatsApp está habilitado, al menos el número principal esté configurado
      if (values.hostWhatsApp.enabled && !values.hostWhatsApp.primary) {
        toast.error("Si habilita WhatsApp, debe proporcionar al menos el número principal")
        return
      }

      // Obtener todas las fechas reservadas guardadas del componente ReservedDatesManager
      const savedReservedDates: Array<{ start: string; end: string }> = []

      // Buscar elementos con data-reserved-date en el DOM
      const reservedDateElements = document.querySelectorAll('[data-reserved-date="true"]')
      reservedDateElements.forEach((element) => {
        const startDate = element.getAttribute("data-start")
        const endDate = element.getAttribute("data-end")
        if (startDate && endDate) {
          savedReservedDates.push({
            start: startDate,
            end: endDate,
          })
        }
      })

      console.log("Fechas reservadas encontradas en DOM:", savedReservedDates)

      // Preparar datos de la habitación
      const roomData: Room = {
        id: currentRoom?.id || Math.floor(Math.random() * 10000),
        title: values.title,
        location: values.location,
        province: values.province,
        price: values.price,
        rating: values.rating,
        reviews: values.reviews,
        image: roomImages[0]?.url || currentRoom?.image || "",
        type: values.type,
        area: values.area,
        description: values.description,
        available: values.isAvailable,
        features: features,
        lastUpdated: new Date().toISOString(),
        pricing: values.pricing,
        images: roomImages.length > 0 ? roomImages : currentRoom?.images || [],
        // CRÍTICO: Guardar fechas reservadas
        reservedDates: savedReservedDates.length > 0 ? savedReservedDates : currentRoom?.reservedDates || [],
        // CRÍTICO: Guardar configuración de WhatsApp
        hostWhatsApp: values.hostWhatsApp.enabled
          ? {
              enabled: true,
              primary: values.hostWhatsApp.primary.trim(),
              secondary: values.hostWhatsApp.secondary?.trim() || "",
              sendToPrimary: values.hostWhatsApp.sendToPrimary,
              sendToSecondary: values.hostWhatsApp.sendToSecondary,
            }
          : {
              enabled: false,
              primary: "",
              secondary: "",
              sendToPrimary: false,
              sendToSecondary: false,
            },
      }

      console.log("Datos finales de la habitación:", roomData)
      console.log("WhatsApp final:", roomData.hostWhatsApp)
      console.log("Fechas reservadas finales:", roomData.reservedDates)

      if (mode === "add") {
        addRoom(roomData)
        toast.success("Habitación creada correctamente con configuración de WhatsApp")
      } else {
        updateRoom(roomData)
        toast.success("Habitación actualizada correctamente con configuración de WhatsApp")
      }

      // Redirigir a la lista de habitaciones
      navigate("/admin/rooms")
    } catch (error) {
      console.error("Error al guardar la habitación:", error)
      toast.error("Error al guardar la habitación")
    }
  }

  return { handleSubmit }
}
