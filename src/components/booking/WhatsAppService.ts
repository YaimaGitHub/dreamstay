import type { Room } from "@/types/room"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { BookingFormValues } from "./bookingSchema"
import type { CurrencyCode } from "@/contexts/CurrencyContext"

interface BookingData {
  room: Room
  formData: BookingFormValues
  checkIn: Date
  checkOut: Date
  nightsCount: number
  totalPrice: number
  currency?: CurrencyCode
}

export function sendWhatsAppMessage(phoneNumber: string, bookingData: BookingData): void {
  try {
    const { room, formData, checkIn, checkOut, nightsCount, totalPrice, currency = "CUP" } = bookingData

    const currencySymbol = currency === "EUR" ? "€" : "$"

    // Format dates in Spanish
    const checkInFormatted = format(checkIn, "dd/MM/yyyy", { locale: es })
    const checkOutFormatted = format(checkOut, "dd/MM/yyyy", { locale: es })
    const arrivalFormatted = format(formData.arrivalDate, "dd/MM/yyyy", { locale: es })

    // Calculate total guests
    const totalGuests = formData.adults + formData.children + formData.babies

    // Format gender in a more readable way
    const genderFormatted =
      formData.gender === "male" ? "Masculino" : formData.gender === "female" ? "Femenino" : "Otro"

    // Create a more structured and readable message
    const message = encodeURIComponent(`
*📋 NUEVA SOLICITUD DE RESERVA*

*👤 INFORMACIÓN DEL HUÉSPED*
• Nombre: ${formData.fullName}
• Edad: ${formData.age} años
• Género: ${genderFormatted}
• Email: ${formData.email}
• Teléfono: ${formData.phone}

*🏨 DETALLES DE LA HABITACIÓN*
• Habitación: ${room.name}
• Check-In: ${checkInFormatted}
• Check-Out: ${checkOutFormatted}
• Noches: ${nightsCount}

*👪 HUÉSPEDES (${totalGuests} total)*
• Adultos: ${formData.adults}
• Niños: ${formData.children}
• Bebés: ${formData.babies}

*💰 PAGO*
• Método: ${formData.paymentMethod === "cash" ? "Efectivo" : "Transferencia"}
• Precio Total: ${currencySymbol}${totalPrice.toFixed(2)} ${currency}
${formData.paymentMethod === "transfer" ? "• Incluye recargo del 15% por transferencia" : ""}

*✈️ DETALLES DEL VIAJE*
• Fecha de llegada al país: ${arrivalFormatted}
• Necesita recogida: ${formData.needsPickup ? "✅ Sí" : "❌ No"}
${formData.flightNumber ? "• Número de vuelo: " + formData.flightNumber : ""}

${formData.comments ? "*📝 COMENTARIOS ADICIONALES*\n" + formData.comments : ""}

_Enviado desde DreamStay Calendar_
    `)

    console.log(`Se abriría WhatsApp con el mensaje: ${message}`)

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    // In development, log URL to console
    console.log(`WhatsApp URL: ${whatsappUrl}`)

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    return whatsappUrl
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
    throw new Error("Failed to send WhatsApp message. Please try again.")
  }
}
