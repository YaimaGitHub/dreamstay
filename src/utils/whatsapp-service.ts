import type { Room } from "@/types/room"
import type { DateRange } from "react-day-picker"
import type { SelectedService } from "@/components/BookingForm"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ReservationData {
  room: Room
  dateRange: DateRange | undefined
  guests: {
    adults: number
    children: number
    babies: number
    pets: number
  }
  duration: number
  pricingMode: "nightly" | "hourly"
  hours: number
  selectedTourismType?: "national" | "international"
  roomPrice: number
  selectedServices: SelectedService[]
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    idNumber: string
    specialRequests: string
  }
  totals: {
    roomSubtotal: number
    servicesSubtotal: number
    cleaningFee: number
    serviceFee: number
    grandTotal: number
  }
}

export const formatReservationMessage = (data: ReservationData): string => {
  const {
    room,
    dateRange,
    guests,
    duration,
    pricingMode,
    hours,
    selectedTourismType,
    customerInfo,
    totals,
    selectedServices,
  } = data

  // Formatear fechas
  const checkIn = dateRange?.from ? format(dateRange.from, "dd/MM/yyyy", { locale: es }) : "No especificada"
  const checkOut = dateRange?.to ? format(dateRange.to, "dd/MM/yyyy", { locale: es }) : "No especificada"

  // Determinar tipo de turismo
  const tourismType =
    selectedTourismType === "national"
      ? "Nacional"
      : selectedTourismType === "international"
        ? "Internacional"
        : "No especificado"

  // Formatear información de huéspedes
  const totalGuests = guests.adults + guests.children + guests.babies
  let guestInfo = `${totalGuests} persona${totalGuests > 1 ? "s" : ""}`

  const guestDetails = []
  if (guests.adults > 0) guestDetails.push(`${guests.adults} adulto${guests.adults > 1 ? "s" : ""}`)
  if (guests.children > 0) guestDetails.push(`${guests.children} niño${guests.children > 1 ? "s" : ""}`)
  if (guests.babies > 0) guestDetails.push(`${guests.babies} bebé${guests.babies > 1 ? "s" : ""}`)
  if (guests.pets > 0) guestDetails.push(`${guests.pets} mascota${guests.pets > 1 ? "s" : ""}`)

  if (guestDetails.length > 0) {
    guestInfo += ` (${guestDetails.join(", ")})`
  }

  // Crear mensaje estructurado
  let message = `🏨 *NUEVA RESERVA - ${room.title}*\n\n`

  // Información del cliente
  message += `👤 *DATOS DEL CLIENTE:*\n`
  message += `• Nombre: ${customerInfo.firstName} ${customerInfo.lastName}\n`
  message += `• Email: ${customerInfo.email}\n`
  message += `• Teléfono: ${customerInfo.phone}\n`
  message += `• Carnet ID: ${customerInfo.idNumber}\n\n`

  // Detalles de la reserva
  message += `📅 *DETALLES DE LA RESERVA:*\n`
  message += `• Check-in: ${checkIn}\n`
  message += `• Check-out: ${checkOut}\n`
  message += `• Duración: ${pricingMode === "nightly" ? `${duration} noche${duration > 1 ? "s" : ""}` : `${hours} hora${hours > 1 ? "s" : ""}`}\n`
  message += `• Huéspedes: ${guestInfo}\n`
  message += `• Tipo de turismo: ${tourismType}\n\n`

  // Desglose de precios
  message += `💰 *DESGLOSE DE PRECIOS:*\n`
  message += `• Habitación (${tourismType}): $${totals.roomSubtotal}\n`

  if (selectedServices.length > 0) {
    message += `• Servicios adicionales:\n`
    selectedServices.forEach((service) => {
      message += `  - ${service.title}: $${service.price}\n`
    })
    message += `  Subtotal servicios: $${totals.servicesSubtotal}\n`
  }

  message += `• Tarifa de limpieza: $${totals.cleaningFee}\n`
  message += `• Tarifa de servicio: $${totals.serviceFee}\n`
  message += `• *TOTAL: $${totals.grandTotal}*\n\n`

  // Solicitudes especiales
  if (customerInfo.specialRequests.trim()) {
    message += `📝 *SOLICITUDES ESPECIALES:*\n${customerInfo.specialRequests}\n\n`
  }

  // Información adicional
  message += `🏠 *HABITACIÓN:* ${room.title}\n`
  message += `📍 *UBICACIÓN:* ${room.location}\n`
  if (room.province) {
    message += `🏛️ *PROVINCIA:* ${room.province}\n`
  }
  message += `⭐ *RATING:* ${room.rating}/5 (${room.reviews} reseñas)\n\n`

  message += `⏰ *Reserva recibida:* ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}\n\n`
  message += `✅ *Por favor confirma la disponibilidad y responde al cliente.*`

  return message
}

export const sendReservationToHosts = async (
  data: ReservationData,
): Promise<{ success: boolean; errors: string[] }> => {
  const { room } = data
  const errors: string[] = []
  let successCount = 0

  console.log("🚀 Iniciando envío de reserva por WhatsApp...")
  console.log("📱 Configuración WhatsApp de la habitación:", room.hostWhatsApp)

  if (!room.hostWhatsApp?.enabled) {
    const error = "WhatsApp no está configurado para esta habitación"
    console.error("❌", error)
    errors.push(error)
    return { success: false, errors }
  }

  const message = formatReservationMessage(data)
  const encodedMessage = encodeURIComponent(message)

  console.log("📝 Mensaje generado:", message.substring(0, 100) + "...")

  // Lista de números a enviar
  const numbersToSend: Array<{ number: string; type: string }> = []

  // Agregar número principal si está configurado
  if (room.hostWhatsApp.sendToPrimary && room.hostWhatsApp.primary?.trim()) {
    numbersToSend.push({
      number: room.hostWhatsApp.primary.trim(),
      type: "Principal",
    })
  }

  // Agregar número secundario si está configurado
  if (room.hostWhatsApp.sendToSecondary && room.hostWhatsApp.secondary?.trim()) {
    numbersToSend.push({
      number: room.hostWhatsApp.secondary.trim(),
      type: "Secundario",
    })
  }

  console.log("📋 Números a enviar:", numbersToSend)

  if (numbersToSend.length === 0) {
    const error = "No hay números de WhatsApp configurados para enviar"
    console.error("❌", error)
    errors.push(error)
    return { success: false, errors }
  }

  // Función para enviar a un número específico
  const sendToNumber = async (phoneData: { number: string; type: string }, delay = 0) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        try {
          // Limpiar el número (remover espacios, guiones, etc.)
          const cleanNumber = phoneData.number.replace(/[^\d+]/g, "")

          console.log(`📱 Enviando a anfitrión ${phoneData.type}:`, phoneData.number, "→", cleanNumber)

          // Crear URL de WhatsApp
          const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`

          console.log(`🔗 URL generada para ${phoneData.type}:`, whatsappUrl.substring(0, 50) + "...")

          // Intentar abrir WhatsApp
          if (typeof window !== "undefined") {
            // En navegador
            const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer")

            if (newWindow) {
              console.log(`✅ WhatsApp abierto exitosamente para anfitrión ${phoneData.type}`)
              successCount++
            } else {
              console.warn(`⚠️ No se pudo abrir ventana para anfitrión ${phoneData.type}`)
              // Intentar con location.href como fallback
              setTimeout(() => {
                window.location.href = whatsappUrl
              }, 100)
              successCount++
            }
          } else {
            console.warn("⚠️ Window no disponible (entorno servidor)")
          }

          resolve()
        } catch (error) {
          console.error(`❌ Error al enviar a anfitrión ${phoneData.type}:`, error)
          errors.push(`Error al enviar a anfitrión ${phoneData.type}: ${error}`)
          resolve()
        }
      }, delay)
    })
  }

  // Enviar a todos los números configurados
  try {
    for (let i = 0; i < numbersToSend.length; i++) {
      const phoneData = numbersToSend[i]
      const delay = i * 3000 // 3 segundos entre cada envío

      console.log(`⏱️ Enviando a ${phoneData.type} con delay de ${delay}ms`)
      await sendToNumber(phoneData, delay)
    }

    console.log(`📊 Resultado final: ${successCount} envíos exitosos de ${numbersToSend.length} intentos`)

    if (successCount === 0) {
      errors.push("No se pudo enviar a ningún anfitrión")
    }

    return {
      success: successCount > 0,
      errors,
    }
  } catch (error) {
    console.error("❌ Error general en el envío:", error)
    errors.push(`Error general: ${error}`)
    return { success: false, errors }
  }
}

export const validateWhatsAppNumber = (number: string): boolean => {
  // Remover espacios y caracteres especiales excepto +
  const cleanNumber = number.replace(/[^\d+]/g, "")

  // Debe empezar con + y tener al menos 10 dígitos
  const regex = /^\+\d{10,15}$/
  return regex.test(cleanNumber)
}
