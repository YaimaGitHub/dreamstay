"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, CheckCircle, Clock, Users } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/sonner"
import { sendReservationToHosts } from "@/utils/whatsapp-service"
import WhatsAppNotification from "@/components/WhatsAppNotification"
import type { Room } from "@/types/room"
import type { DateRange } from "react-day-picker"

interface ReservationFormProps {
  room: Room
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  onClose: () => void
}

const ReservationForm = ({ room, dateRange, onDateRangeChange, onClose }: ReservationFormProps) => {
  const [step, setStep] = useState(1)
  const [guests, setGuests] = useState(1)
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
    if (!duration) return room.price
    return room.price * duration
  }

  const total = calculateTotal()

  // Validar formulario
  const validateForm = () => {
    if (step === 1) {
      if (!dateRange?.from || !dateRange?.to) {
        toast.error("Por favor seleccione fechas de entrada y salida")
        return false
      }
      if (guests < 1) {
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
        pricingMode: "nightly",
        hours: 0,
        selectedTourismType: "national",
        roomPrice: room.price,
        selectedServices: [],
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
          servicesSubtotal: 0,
          cleaningFee: 0,
          serviceFee: 0,
          grandTotal: total,
        },
      }

      // Enviar reserva por WhatsApp
      await sendReservationToHosts(reservationData)

      // Mostrar notificación de WhatsApp
      setShowWhatsAppNotification(true)
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

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Reservar {room.title}</CardTitle>
          <CardDescription>Complete el formulario para reservar esta habitación</CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date-range">Fechas de estadía</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-range"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange?.from && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          format(dateRange.from, "PPP", { locale: es })
                        ) : (
                          <span>Fecha de entrada</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={onDateRangeChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange?.to && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.to ? format(dateRange.to, "PPP", { locale: es }) : <span>Fecha de salida</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={onDateRangeChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Número de huéspedes</Label>
                <Select value={guests.toString()} onValueChange={(value) => setGuests(Number.parseInt(value))}>
                  <SelectTrigger id="guests" className="w-full">
                    <SelectValue placeholder="Seleccione número de huéspedes" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: room.capacity || 4 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} {i === 0 ? "huésped" : "huéspedes"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {dateRange?.from && dateRange?.to && (
                <div className="mt-6 space-y-2 border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duración de la estancia:</span>
                    </div>
                    <span className="font-medium">
                      {duration} {duration === 1 ? "noche" : "noches"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Huéspedes:</span>
                    </div>
                    <span className="font-medium">
                      {guests} {guests === 1 ? "persona" : "personas"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-medium mt-2 pt-2 border-t">
                    <span>Precio total:</span>
                    <span className="text-lg">${total}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pérez"
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+53 55555555" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">Número de identificación</Label>
                <Input
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="12345678901"
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
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resumen de la reserva
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Habitación:</span>
                    <span className="font-medium">{room.title}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fechas:</span>
                    <span className="font-medium">
                      {dateRange?.from && dateRange?.to
                        ? `${format(dateRange.from, "dd/MM/yyyy", { locale: es })} - ${format(
                            dateRange.to,
                            "dd/MM/yyyy",
                            {
                              locale: es,
                            },
                          )}`
                        : "No especificadas"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span className="font-medium">
                      {duration} {duration === 1 ? "noche" : "noches"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Huéspedes:</span>
                    <span className="font-medium">
                      {guests} {guests === 1 ? "persona" : "personas"}
                    </span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Información de contacto
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="font-medium">
                      {firstName} {lastName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{email}</span>
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

              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <p className="text-sm text-blue-700">
                  Al hacer clic en "Reservar ahora", se enviará un mensaje de WhatsApp al anfitrión con los detalles de
                  su reserva. El anfitrión se pondrá en contacto con usted para confirmar la disponibilidad y finalizar
                  su reserva.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
              Anterior
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={handleNextStep} disabled={isSubmitting}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
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
