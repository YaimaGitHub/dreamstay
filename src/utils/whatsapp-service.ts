import type { Room } from "@/types/room"
import type { DateRange } from "react-day-picker"
import type { SelectedService } from "@/components/BookingForm"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ReservationData {
  room: Room
  dateRange: DateRange | undefined
  guests: number
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
  message += `• Huéspedes: ${guests} persona${guests > 1 ? "s" : ""}\n`
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

export const sendReservationToHosts = async (data: ReservationData): Promise<boolean> => {
  const { room } = data

  if (!room.hostWhatsApp?.enabled) {
    console.warn("WhatsApp no está configurado para esta habitación")
    return false
  }

  const message = formatReservationMessage(data)
  const encodedMessage = encodeURIComponent(message)

  // Enviar al número principal si está configurado
  if (room.hostWhatsApp.sendToPrimary && room.hostWhatsApp.primary) {
    const primaryUrl = `https://wa.me/${room.hostWhatsApp.primary.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
    window.open(primaryUrl, "_blank")
  }

  // Enviar al número secundario si está configurado
  if (room.hostWhatsApp.sendToSecondary && room.hostWhatsApp.secondary) {
    setTimeout(() => {
      const secondaryUrl = `https://wa.me/${room.hostWhatsApp.secondary?.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
      window.open(secondaryUrl, "_blank")
    }, 1000) // Esperar 1 segundo entre envíos
  }

  return true
}

export const validateWhatsAppNumber = (number: string): boolean => {
  // Remover espacios y caracteres especiales excepto +
  const cleanNumber = number.replace(/[^\d+]/g, "")

  // Debe empezar con + y tener al menos 10 dígitos
  const regex = /^\+\d{10,15}$/
  return regex.test(cleanNumber)
}
