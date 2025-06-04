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
  if (guests.adults > 0) guestInfo += ` (${guests.adults} adulto${guests.adults > 1 ? "s" : ""})`
  if (guests.children > 0) guestInfo += ` (${guests.children} niño${guests.children > 1 ? "s" : ""})`
  if (guests.babies > 0) guestInfo += ` (${guests.babies} bebé${guests.babies > 1 ? "s" : ""})`
  if (guests.pets > 0) guestInfo += ` (${guests.pets} mascota${guests.pets > 1 ? "s" : ""})`

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

  if (!room.hostWhatsApp?.enabled) {
    errors.push("WhatsApp no está configurado para esta habitación")
    return { success: false, errors }
  }

  const message = formatReservationMessage(data)
  const encodedMessage = encodeURIComponent(message)

  // Función para abrir WhatsApp
  const openWhatsApp = (phoneNumber: string, delay = 0) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          const cleanNumber = phoneNumber.replace(/[^0-9]/g, "")
          const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`

          // Abrir en nueva ventana
          const newWindow = window.open(whatsappUrl, "_blank")

          if (newWindow) {
            console.log(`✅ WhatsApp abierto para: ${phoneNumber}`)
            successCount++
            resolve()
          } else {
            throw new Error("No se pudo abrir WhatsApp")
          }
        } catch (error) {
          console.error(`❌ Error al abrir WhatsApp para ${phoneNumber}:`, error)
          reject(error)
        }
      }, delay)
    })
  }

  // Enviar al anfitrión principal si está configurado
  if (room.hostWhatsApp.sendToPrimary && room.hostWhatsApp.primary) {
    try {
      console.log(`📱 Enviando a anfitrión principal: ${room.hostWhatsApp.primary}`)
      await openWhatsApp(room.hostWhatsApp.primary, 0)
    } catch (error) {
      errors.push(`Error al enviar al anfitrión principal: ${error}`)
    }
  }

  // Enviar al anfitrión secundario si está configurado (con delay)
  if (room.hostWhatsApp.sendToSecondary && room.hostWhatsApp.secondary) {
    try {
      console.log(`📱 Enviando a anfitrión secundario: ${room.hostWhatsApp.secondary}`)
      await openWhatsApp(room.hostWhatsApp.secondary, 2000) // 2 segundos de delay
    } catch (error) {
      errors.push(`Error al enviar al anfitrión secundario: ${error}`)
    }
  }

  if (successCount === 0) {
    errors.push("No se pudo enviar a ningún anfitrión")
  }

  console.log(`📊 Resultado del envío: ${successCount} exitosos, ${errors.length} errores`)

  return {
    success: successCount > 0,
    errors,
  }
}

export const validateWhatsAppNumber = (number: string): boolean => {
  // Remover espacios y caracteres especiales excepto +
  const cleanNumber = number.replace(/[^\d+]/g, "")

  // Debe empezar con + y tener al menos 10 dígitos
  const regex = /^\+\d{10,15}$/
  return regex.test(cleanNumber)
}
