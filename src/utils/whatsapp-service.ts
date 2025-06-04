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

  // Crear mensaje estructurado con emojis compatibles
  let message = `🏨 *NUEVA RESERVA - ${room.title}*

`

  // Información del cliente
  message += `👤 *DATOS DEL CLIENTE:*
`
  message += `• Nombre: ${customerInfo.firstName} ${customerInfo.lastName}
`
  message += `• Email: ${customerInfo.email}
`
  message += `• Teléfono: ${customerInfo.phone}
`
  message += `• Carnet ID: ${customerInfo.idNumber}

`

  // Detalles de la reserva
  message += `📅 *DETALLES DE LA RESERVA:*
`
  message += `• Check-in: ${checkIn}
`
  message += `• Check-out: ${checkOut}
`
  message += `• Duración: ${pricingMode === "nightly" ? `${duration} noche${duration > 1 ? "s" : ""}` : `${hours} hora${hours > 1 ? "s" : ""}`}
`
  message += `• Huéspedes: ${guestInfo}
`
  message += `• Tipo de turismo: ${tourismType}

`

  // Desglose de precios
  message += `💰 *DESGLOSE DE PRECIOS:*
`
  message += `• Habitación (${tourismType}): $${totals.roomSubtotal}
`

  if (selectedServices.length > 0) {
    message += `• Servicios adicionales:
`
    selectedServices.forEach((service) => {
      message += `  - ${service.title}: $${service.price}
`
    })
    message += `  Subtotal servicios: $${totals.servicesSubtotal}
`
  }

  message += `• Tarifa de limpieza: $${totals.cleaningFee}
`
  message += `• Tarifa de servicio: $${totals.serviceFee}
`
  message += `• *TOTAL: $${totals.grandTotal}*

`

  // Solicitudes especiales
  if (customerInfo.specialRequests.trim()) {
    message += `📝 *SOLICITUDES ESPECIALES:*
${customerInfo.specialRequests}

`
  }

  // Información adicional
  message += `🏠 *HABITACIÓN:* ${room.title}
`
  message += `📍 *UBICACIÓN:* ${room.location}
`
  if (room.province) {
    message += `🏛️ *PROVINCIA:* ${room.province}
`
  }
  message += `⭐ *RATING:* ${room.rating}/5 (${room.reviews} reseñas)

`

  message += `⏰ *Reserva recibida:* ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}

`
  message += `✅ *Por favor confirma la disponibilidad y responde al cliente.*`

  return message
}

export const sendReservationToHosts = async (
  data: ReservationData,
): Promise<{ success: boolean; errors: string[]; sentTo: string[] }> => {
  const { room } = data
  const errors: string[] = []
  const sentTo: string[] = []

  console.log("🚀 Iniciando envío de reserva por WhatsApp...")
  console.log("📱 Configuración WhatsApp de la habitación:", room.hostWhatsApp)

  if (!room.hostWhatsApp?.enabled) {
    const error = "WhatsApp no está configurado para esta habitación"
    console.error("❌", error)
    errors.push(error)
    return { success: false, errors, sentTo }
  }

  // Generar el mensaje UNA SOLA VEZ para asegurar consistencia
  const message = formatReservationMessage(data)
  console.log("📝 Mensaje generado (mismo para todos):", message.substring(0, 150) + "...")

  // Codificar el mensaje UNA SOLA VEZ
  const encodedMessage = encodeURIComponent(message)

  // Lista de números a enviar
  const numbersToSend: Array<{ number: string; type: string; enabled: boolean }> = []

  // Agregar número principal si está configurado
  if (room.hostWhatsApp.primary?.trim()) {
    numbersToSend.push({
      number: room.hostWhatsApp.primary.trim(),
      type: "Principal",
      enabled: room.hostWhatsApp.sendToPrimary || false,
    })
  }

  // Agregar número secundario si está configurado
  if (room.hostWhatsApp.secondary?.trim()) {
    numbersToSend.push({
      number: room.hostWhatsApp.secondary.trim(),
      type: "Secundario",
      enabled: room.hostWhatsApp.sendToSecondary || false,
    })
  }

  console.log("📋 Números configurados:", numbersToSend)

  // Filtrar solo los números habilitados
  const enabledNumbers = numbersToSend.filter((num) => num.enabled)

  if (enabledNumbers.length === 0) {
    const error = "No hay números de WhatsApp habilitados para enviar"
    console.error("❌", error)
    errors.push(error)
    return { success: false, errors, sentTo }
  }

  console.log("📤 Números habilitados para envío:", enabledNumbers)

  // Función para enviar a un número específico
  const sendToNumber = (phoneData: { number: string; type: string }, delay = 0): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Limpiar el número (remover espacios, guiones, paréntesis, etc.)
          const cleanNumber = phoneData.number.replace(/[^\d+]/g, "")

          console.log(`📱 Preparando envío a anfitrión ${phoneData.type}:`)
          console.log(`   Original: ${phoneData.number}`)
          console.log(`   Limpio: ${cleanNumber}`)

          // Validar que el número tenga formato correcto
          if (!cleanNumber.startsWith("+") || cleanNumber.length < 10) {
            console.error(`❌ Número inválido para ${phoneData.type}: ${cleanNumber}`)
            errors.push(`Número inválido para anfitrión ${phoneData.type}`)
            resolve(false)
            return
          }

          // Crear URL de WhatsApp usando el MISMO mensaje codificado
          const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`

          console.log(`🔗 URL generada para ${phoneData.type}:`)
          console.log(`   ${whatsappUrl.substring(0, 80)}...`)

          // Detectar si estamos en móvil
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

          console.log(`📱 Dispositivo detectado: ${isMobile ? "Móvil/Tablet" : "Desktop"}`)

          if (isMobile) {
            // En móviles, usar location.href para mejor compatibilidad
            console.log(`📲 Abriendo WhatsApp en móvil para ${phoneData.type}...`)
            window.location.href = whatsappUrl
          } else {
            // En desktop, usar window.open
            console.log(`💻 Abriendo WhatsApp en desktop para ${phoneData.type}...`)
            const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer")

            if (!newWindow) {
              console.warn(`⚠️ Popup bloqueado, usando location.href como fallback para ${phoneData.type}`)
              window.location.href = whatsappUrl
            }
          }

          console.log(`✅ Envío iniciado para anfitrión ${phoneData.type}`)
          sentTo.push(`${phoneData.type}: ${phoneData.number}`)
          resolve(true)
        } catch (error) {
          console.error(`❌ Error al enviar a anfitrión ${phoneData.type}:`, error)
          errors.push(`Error al enviar a anfitrión ${phoneData.type}: ${error}`)
          resolve(false)
        }
      }, delay)
    })
  }

  // Enviar a todos los números habilitados
  try {
    let successCount = 0

    for (let i = 0; i < enabledNumbers.length; i++) {
      const phoneData = enabledNumbers[i]
      const delay = i * 4000 // 4 segundos entre cada envío para mejor compatibilidad

      console.log(`⏱️ Enviando a ${phoneData.type} con delay de ${delay}ms`)

      const success = await sendToNumber(phoneData, delay)
      if (success) {
        successCount++
      }
    }

    console.log(`📊 Resultado final: ${successCount} envíos exitosos de ${enabledNumbers.length} intentos`)
    console.log(`📤 Enviado a: ${sentTo.join(", ")}`)

    return {
      success: successCount > 0,
      errors,
      sentTo,
    }
  } catch (error) {
    console.error("❌ Error general en el envío:", error)
    errors.push(`Error general: ${error}`)
    return { success: false, errors, sentTo }
  }
}

export const validateWhatsAppNumber = (number: string): boolean => {
  // Remover espacios y caracteres especiales excepto +
  const cleanNumber = number.replace(/[^\d+]/g, "")

  // Debe empezar con + y tener al menos 10 dígitos
  const regex = /^\+\d{10,15}$/
  return regex.test(cleanNumber)
}
