"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, CheckCircle, Clock, Users, ArrowLeft, ArrowRight } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { sendReservationToHosts } from "@/utils/whatsapp-service"
import WhatsAppNotification from "@/components/WhatsAppNotification"
import type { Room } from "@/types/room"
import type { DateRange } from "react-day-picker"
import type { SelectedService } from "@/components/BookingForm"
import GuestSelector from "@/components/GuestSelector"

interface GuestCounts {
  adults: number
  children: number
  babies: number
  pets: number
}

interface ReservationFormProps {
  room: Room
  dateRange: DateRange | undefined
  guests: GuestCounts
  selectedServices: SelectedService[]
  onClose: () => void
  duration: number
  roomPrice: number
  pricingMode: "nightly" | "hourly"
  hours?: number
  selectedTourismType?: "national" | "international"
  onDateRangeChange: (range: DateRange | undefined) => void
}

const ReservationForm = ({
  room,
  dateRange: initialDateRange,
  guests: initialGuests,
  selectedServices,
  onClose,
  duration: initialDuration,
  roomPrice,
  pricingMode,
  hours,
  selectedTourismType,
  onDateRangeChange,
}: ReservationFormProps) => {
  const [step, setStep] = useState(1)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange)
  const [guests, setGuests] = useState<GuestCounts>(initialGuests)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWhatsAppNotification, setShowWhatsAppNotification] = useState(false)

  // Calcular duración de la estancia
  const calculateDuration = () => {
    if (!dateRange?.from || !dateRange?.to) return 0
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const duration = calculateDuration()

  // Calcular precio total
  const calculateTotal = () => {
    if (pricingMode === "nightly") {
      return roomPrice * duration
    } else {
      return roomPrice * (hours || 0)
    }
  }

  const total = calculateTotal()
  const servicesTotalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const cleaningFee = 40
  const grandTotal = total + servicesTotalPrice + cleaningFee

  // Validar formulario
  const validateForm = () => {
    if (step === 1) {
      if (!dateRange?.from || !dateRange?.to) {
        toast.error("Por favor seleccione fechas de entrada y salida")
        return false
      }
      const totalGuests = guests.adults + guests.children + guests.babies
      if (totalGuests < 1) {
        toast.error("Por favor seleccione al menos 1 huésped")
        return false
      }
      return true
    }

    if (step === 2) {
      if (!firstName.trim()) {
        toast.error("Por favor ingrese su nombre")
        return false
      }
      if (!lastName.trim()) {
        toast.error("Por favor ingrese su apellido")
        return false
      }
      if (!email.trim() || !email.includes("@")) {
        toast.error("Por favor ingrese un email válido")
        return false
      }
      if (!phone.trim()) {
        toast.error("Por favor ingrese su número de teléfono")
        return false
      }
      if (!idNumber.trim()) {
        toast.error("Por favor ingrese su número de identificación")
        return false
      }
      return true
    }

    return true
  }

  // Manejar siguiente paso
  const handleNextStep = () => {
    if (validateForm()) {
      setStep(step + 1)
    }
  }

  // Manejar paso anterior
  const handlePrevStep = () => {
    setStep(step - 1)
  }

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Verificar si la habitación tiene WhatsApp configurado
      if (!room.hostWhatsApp?.enabled) {
        toast.error("Esta habitación no tiene WhatsApp configurado para reservas")
        setIsSubmitting(false)
        return
      }

      // Preparar datos para enviar por WhatsApp
      const reservationData = {
        room,
        dateRange,
        guests,
        duration,
        pricingMode,
        hours: hours || 0,
        selectedTourismType,
        roomPrice,
        selectedServices,
        customerInfo: {
          firstName,
          lastName,
          email,
          phone,
          idNumber,
          specialRequests,
        },
        totals: {
          roomSubtotal: total,
          servicesSubtotal: servicesTotalPrice,
          cleaningFee,
          serviceFee: 0,
          grandTotal,
        },
      }

      // Enviar reserva por WhatsApp
      const result = await sendReservationToHosts(reservationData)

      if (result.success) {
        // Mostrar notificación de WhatsApp
        setShowWhatsAppNotification(true)
        toast.success("Reserva enviada exitosamente por WhatsApp")
      } else {
        toast.error(`Error al enviar reserva: ${result.errors.join(", ")}`)
      }
    } catch (error) {
      console.error("Error al enviar reserva:", error)
      toast.error("Error al enviar la reserva. Por favor intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejar cierre de notificación de WhatsApp
  const handleWhatsAppNotificationClose = () => {
    setShowWhatsAppNotification(false)
    onClose()
  }

  // Actualizar fechas en el componente padre
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    onDateRangeChange(range)
  }

  const getTotalGuests = () => {
    return guests.adults + guests.children + guests.babies
  }

  return (
    <>
      <Card className="w-full border-0 shadow-none">
        <CardHeader className="px-4 sm:px-6 pb-4">
          <CardTitle className="text-lg sm:text-xl">Completar Reserva</CardTitle>
          <CardDescription className="text-sm">Complete el formulario para reservar esta habitación</CardDescription>

          {/* Indicador de pasos */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= stepNumber ? "bg-terracotta text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={cn("w-8 h-0.5 mx-2", step > stepNumber ? "bg-terracotta" : "bg-muted")} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date-range">Fechas de estadía</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-auto py-3",
                        !dateRange?.from && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <div>
                        {dateRange?.from && dateRange?.to ? (
                          <div>
                            <div className="text-sm font-medium">
                              {format(dateRange.from, "d MMM", { locale: es })} -{" "}
                              {format(dateRange.to, "d MMM", { locale: es })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {duration} noche{duration !== 1 ? "s" : ""}
                            </div>
                          </div>
                        ) : (
                          <span>Seleccionar fechas</span>
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={window.innerWidth < 768 ? 1 : 2}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Huéspedes</Label>
                <GuestSelector value={guests} onChange={setGuests} maxGuests={room.capacity || 10} className="w-full" />
              </div>

              {dateRange?.from && dateRange?.to && (
                <div className="mt-6 space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duración:</span>
                    </div>
                    <span className="font-medium">
                      {pricingMode === "nightly"
                        ? `${duration} noche${duration !== 1 ? "s" : ""}`
                        : `${hours} hora${hours !== 1 ? "s" : ""}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Huéspedes:</span>
                    </div>
                    <span className="font-medium">
                      {getTotalGuests()} persona{getTotalGuests() !== 1 ? "s" : ""}
                      {guests.pets > 0 && ` + ${guests.pets} mascota${guests.pets !== 1 ? "s" : ""}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-medium mt-2 pt-2 border-t">
                    <span>Precio total:</span>
                    <span className="text-lg">${grandTotal}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pérez"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan.perez@ejemplo.com"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+53 55555555"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">Número de identificación</Label>
                <Input
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="12345678901"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Solicitudes especiales (opcional)</Label>
                <Textarea
                  id="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Cualquier solicitud especial para su estancia..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resumen de la reserva
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Habitación:</span>
                    <span className="font-medium text-right">{room.title}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fechas:</span>
                    <span className="font-medium text-right">
                      {dateRange?.from && dateRange?.to
                        ? `${format(dateRange.from, "dd/MM/yyyy", { locale: es })} - ${format(
                            dateRange.to,
                            "dd/MM/yyyy",
                            { locale: es },
                          )}`
                        : "No especificadas"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span className="font-medium">
                      {pricingMode === "nightly"
                        ? `${duration} noche${duration !== 1 ? "s" : ""}`
                        : `${hours} hora${hours !== 1 ? "s" : ""}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Huéspedes:</span>
                    <span className="font-medium">
                      {getTotalGuests()} persona{getTotalGuests() !== 1 ? "s" : ""}
                      {guests.pets > 0 && ` + ${guests.pets} mascota${guests.pets !== 1 ? "s" : ""}`}
                    </span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Habitación:</span>
                      <span>${total}</span>
                    </div>
                    {servicesTotalPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Servicios:</span>
                        <span>${servicesTotalPrice}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Limpieza:</span>
                      <span>${cleaningFee}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>${grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Información de contacto
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="font-medium text-right">
                      {firstName} {lastName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-right break-all">{email}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="font-medium">{phone}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium">{idNumber}</span>
                  </div>
                </div>
              </div>

              {specialRequests && (
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium mb-2">Solicitudes especiales</h3>
                  <p className="text-sm">{specialRequests}</p>
                </div>
              )}

              <div className="rounded-lg bg-green-50 p-4 border border-green-100">
                <p className="text-sm text-green-700">
                  Al hacer clic en "Reservar ahora", se enviará un mensaje de WhatsApp al anfitrión con los detalles de
                  su reserva. El anfitrión se pondrá en contacto con usted para confirmar la disponibilidad y finalizar
                  su reserva.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between px-4 sm:px-6 pt-4">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={handleNextStep} disabled={isSubmitting} className="flex items-center gap-2">
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              {isSubmitting ? "Enviando..." : "Reservar ahora"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Notificación de WhatsApp */}
      <WhatsAppNotification
        isVisible={showWhatsAppNotification}
        hostNumbers={{
          primary: room.hostWhatsApp?.primary || "",
          secondary: room.hostWhatsApp?.secondary,
        }}
        roomTitle={room.title}
        onComplete={handleWhatsAppNotificationClose}
      />
    </>
  )
}

export default ReservationForm
