"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, PlusCircle, X, Pencil, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DateRange } from "react-day-picker"
import { toast } from "@/components/ui/use-toast"

interface ReservedDatesManagerProps {
  reservedDates: DateRange | undefined
  setReservedDates: (dates: DateRange | undefined) => void
  initialDates?: Array<{ start: string; end: string }>
}

const ReservedDatesManager = ({ reservedDates, setReservedDates, initialDates = [] }: ReservedDatesManagerProps) => {
  const [savedDates, setSavedDates] = useState<Array<{ id: string; start: Date; end: Date }>>([])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [editingDateId, setEditingDateId] = useState<string | null>(null)

  // Cargar las fechas iniciales cuando el componente se monta o cuando initialDates cambia
  useEffect(() => {
    if (initialDates && initialDates.length > 0) {
      console.log("Cargando fechas reservadas iniciales:", initialDates.length)
      const formattedDates = initialDates.map((date, index) => ({
        id: `date-${index}`,
        start: new Date(date.start),
        end: new Date(date.end),
      }))
      setSavedDates(formattedDates)
    }
  }, [initialDates])

  const handleAddDate = () => {
    if (reservedDates?.from && reservedDates?.to) {
      // Si estamos en modo edición
      if (editingDateId) {
        // Actualizar la fecha existente
        const updatedDates = savedDates.map((date) => {
          if (date.id === editingDateId) {
            return {
              ...date,
              start: reservedDates.from!,
              end: reservedDates.to!,
            }
          }
          return date
        })

        setSavedDates(updatedDates)
        setEditingDateId(null)
        setReservedDates(undefined)
        setIsCalendarOpen(false)

        toast({
          title: "Fecha actualizada",
          description: "La fecha reservada ha sido actualizada correctamente.",
        })
        return
      }

      // Verificar si la fecha ya existe (solo para nuevas fechas)
      const isDuplicate = savedDates.some((date) => {
        const sameStartDay =
          date.start.getDate() === reservedDates.from?.getDate() &&
          date.start.getMonth() === reservedDates.from?.getMonth() &&
          date.start.getFullYear() === reservedDates.from?.getFullYear()

        const sameEndDay =
          date.end.getDate() === reservedDates.to?.getDate() &&
          date.end.getMonth() === reservedDates.to?.getMonth() &&
          date.end.getFullYear() === reservedDates.to?.getFullYear()

        return sameStartDay && sameEndDay
      })

      if (isDuplicate) {
        toast({
          title: "Fecha duplicada",
          description: "Esta fecha ya ha sido reservada para esta habitación.",
          variant: "destructive",
        })
        return
      }

      const newDate = {
        id: `date-${Date.now()}`,
        start: reservedDates.from,
        end: reservedDates.to,
      }
      setSavedDates([...savedDates, newDate])
      setReservedDates(undefined)
      setIsCalendarOpen(false)

      toast({
        title: "Fecha reservada",
        description: "La fecha ha sido añadida correctamente.",
      })
    }
  }

  const handleRemoveDate = (id: string) => {
    setSavedDates(savedDates.filter((date) => date.id !== id))

    // Si estábamos editando esta fecha, salir del modo edición
    if (editingDateId === id) {
      setEditingDateId(null)
      setReservedDates(undefined)
    }
  }

  const handleEditDate = (id: string) => {
    const dateToEdit = savedDates.find((date) => date.id === id)
    if (dateToEdit) {
      setReservedDates({
        from: dateToEdit.start,
        to: dateToEdit.end,
      })
      setEditingDateId(id)
      setIsCalendarOpen(true)
    }
  }

  const cancelEdit = () => {
    setEditingDateId(null)
    setReservedDates(undefined)
  }

  // Función para deshabilitar fechas ya reservadas (excepto la que se está editando)
  const isDateDisabled = (date: Date) => {
    // Check if the date is already in a reserved range
    return savedDates.some((reservedDate) => {
      // Si estamos editando esta fecha, no la deshabilitamos
      if (reservedDate.id === editingDateId) {
        return false
      }

      const dateTime = date.getTime()
      const startTime = reservedDate.start.getTime()
      const endTime = reservedDate.end.getTime()

      return dateTime >= startTime && dateTime <= endTime
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fechas Reservadas</CardTitle>
        <CardDescription>Seleccione las fechas en las que la habitación no estará disponible</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Lista de fechas guardadas */}
          {savedDates.length > 0 && (
            <ScrollArea className="h-[150px] rounded-md border p-4">
              <div className="space-y-2">
                {savedDates.map((date) => (
                  <div
                    key={date.id}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      editingDateId === date.id ? "bg-accent/30 border border-accent" : "bg-muted/50"
                    }`}
                    data-reserved-date="true"
                    data-start={date.start.toISOString()}
                    data-end={date.end.toISOString()}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {format(date.start, "dd/MM/yyyy", { locale: es })} -{" "}
                        {format(date.end, "dd/MM/yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {editingDateId === date.id ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={cancelEdit}
                          className="h-6 w-6 rounded-full text-muted-foreground"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancelar edición</span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditDate(date.id)}
                          className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar fecha</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDate(date.id)}
                        className="h-6 w-6 rounded-full text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Eliminar fecha</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Selector de fechas */}
          <div className="flex flex-col space-y-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setIsCalendarOpen(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reservedDates?.from ? (
                    reservedDates.to ? (
                      <>
                        {format(reservedDates.from, "dd/MM/yyyy", { locale: es })} -{" "}
                        {format(reservedDates.to, "dd/MM/yyyy", { locale: es })}
                      </>
                    ) : (
                      format(reservedDates.from, "dd/MM/yyyy", { locale: es })
                    )
                  ) : (
                    <span>Seleccionar fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={reservedDates?.from}
                  selected={reservedDates}
                  onSelect={setReservedDates}
                  numberOfMonths={2}
                  locale={es}
                  disabled={isDateDisabled}
                />
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleAddDate}
              disabled={!reservedDates?.from || !reservedDates?.to}
              className="flex items-center"
            >
              {editingDateId ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Actualizar fecha reservada
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir fecha reservada
                </>
              )}
            </Button>
          </div>

          {/* Resumen */}
          <div className="pt-2">
            <Badge variant="outline" className="text-muted-foreground">
              {savedDates.length} {savedDates.length === 1 ? "fecha reservada" : "fechas reservadas"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReservedDatesManager
