"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronDown, Check, Loader2, AlertTriangle } from "lucide-react"
import type { DateRange } from "react-day-picker"
import type { SelectedService } from "./BookingForm"
import type { Room } from "@/types/room"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReservationFormProps {
  room: Room
  dateRange: DateRange | undefined
  guests: number
  selectedServices: SelectedService[]
  onClose: () => void
  duration: number
  roomPrice: number
}

const ReservationForm = ({
  room,
  dateRange,
  guests,
  selectedServices,
  onClose,
  duration,
  roomPrice,
}: ReservationFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    idNumber: "",
    gender: "masculino",
    paymentMethod: "efectivo",
  })
  const [editableDateRange, setEditableDateRange] = useState<DateRange | undefined>(dateRange)
  const [editableGuests, setEditableGuests] = useState(guests.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Calcular la duración de la estancia en días
  const getStayDuration = () => {
    if (!editableDateRange?.from || !editableDateRange?.to) return 0
    const diffTime = editableDateRange.to.getTime() - editableDateRange.from.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const currentDuration = getStayDuration()

  // Calcular el precio total de la habitación
  const roomTotalPrice = roomPrice * currentDuration

  // Calcular el precio total de los servicios adicionales
  const servicesTotalPrice = selectedServices.reduce((total, service) => total + service.price, 0)

  // Calcular el precio total (habitación + servicios)
  const totalPrice = roomTotalPrice + servicesTotalPrice + 40 // 40 = tarifas fijas (limpieza + servicio)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const formatWhatsAppMessage = () => {
    const checkInDate = editableDateRange?.from
      ? format(editableDateRange.from, "dd/MM/yyyy", { locale: es })
      : "No especificada"
    const checkOutDate = editableDateRange?.to
      ? format(editableDateRange.to, "dd/MM/yyyy", { locale: es })
      : "No especificada"

    let message = `*¡NUEVA SOLICITUD DE RESERVA!* 🏨✨\n\n`
    message += `*Detalles de la Habitación:*\n`
    message += `🛏️ *${room.title}*\n`
    message += `📍 ${room.location}\n\n`

    message += `*Fechas de Estancia:*\n`
    message += `📅 Llegada: ${checkInDate}\n`
    message += `📅 Salida: ${checkOutDate}\n`
    message += `🗓️ Duración: ${currentDuration} noches\n\n`

    message += `*Datos del Huésped:*\n`
    message += `👤 Nombre: ${formData.name}\n`
    message += `📞 Teléfono: ${formData.phone}\n`
    message += `🪪 Carnet de Identidad: ${formData.idNumber}\n`
    message += `👥 Género: ${formData.gender === "masculino" ? "Masculino" : "Femenino"}\n`
    message += `🧓 Edad: ${formData.age} años\n`
    message += `👥 Cantidad de huéspedes: ${editableGuests}\n\n`

    message += `*Método de Pago:*\n`
    message += `💰 ${formData.paymentMethod === "efectivo" ? "Efectivo" : "Transferencia"}\n\n`

    message += `*Desglose de Costos:*\n`
    message += `🏠 Habitación: $${roomPrice} x ${currentDuration} noches = $${roomTotalPrice}\n`
    message += `🧹 Tarifa de limpieza: $25\n`
    message += `🛎️ Tarifa de servicio: $15\n`

    if (selectedServices.length > 0) {
      message += `\n*Servicios Adicionales:*\n`
      selectedServices.forEach((service) => {
        message += `✅ ${service.title}: $${service.price}\n`
      })
    }

    message += `\n*💵 TOTAL A PAGAR: $${totalPrice}*\n\n`

    message += `¡Gracias por elegir nuestro alojamiento! 🙏`

    return encodeURIComponent(message)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validar el formulario
    if (!formData.name || !formData.phone || !formData.age || !formData.idNumber) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, completa todos los campos requeridos.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validar que la habitación tenga número de WhatsApp
    if (!room.whatsappNumber || room.whatsappNumber.trim() === "") {
      toast({
        title: "Error de configuración",
        description: "Esta habitación no tiene configurado un número de WhatsApp. Contacta al administrador.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Preparar mensaje para WhatsApp
      const message = formatWhatsAppMessage()
      // Usar el número de WhatsApp específico de la habitación
      const phoneNumber = room.whatsappNumber.replace(/\D/g, "") // Remover caracteres no numéricos
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

      // Abrir WhatsApp en una nueva pestaña
      window.open(whatsappUrl, "_blank")

      toast({
        title: "¡Reserva solicitada!",
        description: `Tu solicitud ha sido enviada al anfitrión. Te contactaremos pronto para confirmar.`,
      })

      // Cerrar el formulario después de 2 segundos
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  // Verificar si la habitación tiene WhatsApp configurado
  if (!room.whatsappNumber || room.whatsappNumber.trim() === "") {
    return (
      <div className="py-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Esta habitación no tiene configurado un número de WhatsApp. Por favor, contacta al administrador para
            completar la configuración.
          </AlertDescription>
        </Alert>
        <div className="pt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-6">Solicitar reservación</h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <img src={room.image || "/placeholder.svg"} alt={room.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-medium">{room.title}</h3>
          <p className="text-sm text-muted-foreground">{room.location}</p>
          <p className="text-xs text-green-600">WhatsApp: {room.whatsappNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Fechas</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between border-border">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editableDateRange?.from && editableDateRange?.to ? (
                    <>
                      {format(editableDateRange.from, "d MMM", { locale: es })} -{" "}
                      {format(editableDateRange.to, "d MMM", { locale: es })}
                    </>
                  ) : (
                    <span>Seleccionar fechas</span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={editableDateRange?.from}
                selected={editableDateRange}
                onSelect={setEditableDateRange}
                numberOfMonths={2}
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Huéspedes</label>
          <Select value={editableGuests} onValueChange={setEditableGuests}>
            <SelectTrigger className="w-full border-border">
              <SelectValue placeholder="Número de huéspedes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Huésped</SelectItem>
              <SelectItem value="2">2 Huéspedes</SelectItem>
              <SelectItem value="3">3 Huéspedes</SelectItem>
              <SelectItem value="4">4 Huéspedes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">Datos personales</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: +1234567890"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Ingresa tu edad"
              min="18"
              max="120"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">Carnet de identidad</Label>
            <Input
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Ingresa tu número de identificación"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sexo</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="masculino" id="masculino" />
              <Label htmlFor="masculino">Masculino</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="femenino" id="femenino" />
              <Label htmlFor="femenino">Femenino</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Método de pago</Label>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => handleSelectChange("paymentMethod", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="efectivo" id="efectivo" />
              <Label htmlFor="efectivo">Efectivo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="transferencia" id="transferencia" />
              <Label htmlFor="transferencia">Transferencia</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">Desglose de costos</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                ${roomPrice} x {currentDuration} noches
              </span>
              <span>${roomTotalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarifa de limpieza</span>
              <span>$25</span>
            </div>
            <div className="flex justify-between">
              <span>Tarifa de servicio</span>
              <span>$15</span>
            </div>

            {selectedServices.length > 0 && (
              <>
                <div className="pt-2 border-t border-border">
                  <h4 className="font-medium mb-2">Servicios adicionales:</h4>
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span>{service.title}</span>
                      <span>${service.price}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-between font-bold border-t border-border pt-4 mt-4">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            className="bg-terracotta hover:bg-terracotta/90 w-full md:w-auto"
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : isSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                ¡Solicitud enviada!
              </>
            ) : (
              "Confirmar y enviar"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReservationForm
