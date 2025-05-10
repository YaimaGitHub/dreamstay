"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns"
import { es, enUS } from "date-fns/locale"
import type { Room } from "@/types/room"

// Tipo para las fechas no disponibles
type UnavailableDate = Date

interface AvailabilityManagerProps {
  room?: Room
  onUpdateBookedDates?: (roomId: number, newBookedDates: Date[]) => void
}

export default function AvailabilityManager({ room, onUpdateBookedDates }: AvailabilityManagerProps) {
  const { t, i18n } = useTranslation()
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Estado para almacenar fechas no disponibles
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([])

  // Estado para el mes seleccionado en operaciones por lote
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())

  // Obtener el locale correcto para date-fns
  const locale = i18n.language === "es" ? es : enUS

  // Función para verificar si una fecha está en la lista de no disponibles
  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some((unavailableDate) => isSameDay(unavailableDate, date))
  }

  // Función para alternar la disponibilidad de una fecha
  const toggleDateAvailability = (date: Date) => {
    if (isEditMode) {
      if (isDateUnavailable(date)) {
        // Si la fecha ya está marcada como no disponible, la eliminamos
        setUnavailableDates(unavailableDates.filter((unavailableDate) => !isSameDay(unavailableDate, date)))
      } else {
        // Si la fecha está disponible, la marcamos como no disponible
        setUnavailableDates([...unavailableDates, date])
      }
    }
  }

  // Función para seleccionar un rango de fechas
  const selectDateRange = () => {
    if (dateRange.from && dateRange.to) {
      const daysInRange = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      })

      // Combinar las fechas existentes con el nuevo rango
      const newUnavailableDates = [...unavailableDates]

      daysInRange.forEach((day) => {
        if (!isDateUnavailable(day)) {
          newUnavailableDates.push(day)
        }
      })

      setUnavailableDates(newUnavailableDates)
      setDateRange({ from: undefined, to: undefined })
    }
  }

  // Función para navegar al mes anterior
  const goToPreviousMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, -1))
  }

  // Función para navegar al mes siguiente
  const goToNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1))
  }

  // Función para marcar todas las fechas del mes como no disponibles
  const markMonthAsUnavailable = () => {
    const monthDates = eachDayOfInterval({
      start: startOfMonth(selectedMonth),
      end: endOfMonth(selectedMonth),
    })

    const newUnavailableDates = [...unavailableDates]

    monthDates.forEach((date) => {
      if (!isDateUnavailable(date)) {
        newUnavailableDates.push(date)
      }
    })

    setUnavailableDates(newUnavailableDates)
  }

  // Función para marcar todas las fechas del mes como disponibles
  const markMonthAsAvailable = () => {
    const monthDates = eachDayOfInterval({
      start: startOfMonth(selectedMonth),
      end: endOfMonth(selectedMonth),
    })

    setUnavailableDates(unavailableDates.filter((date) => !monthDates.some((monthDate) => isSameDay(monthDate, date))))
  }

  // Función para guardar los cambios
  const saveChanges = () => {
    if (room && onUpdateBookedDates) {
      onUpdateBookedDates(room.id, unavailableDates)
    }
    setIsEditMode(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("admin.manageAvailability") || "Gestionar disponibilidad"}</h2>
        <div className="space-x-2">
          <Button variant={isEditMode ? "default" : "outline"} onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode
              ? t("admin.finishEditing") || "Terminar edición"
              : t("admin.editAvailability") || "Editar disponibilidad"}
          </Button>
          {isEditMode && (
            <Button variant="destructive" onClick={() => setUnavailableDates([])}>
              {t("admin.clearAllDates") || "Limpiar todas las fechas"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">{t("admin.calendarView") || "Vista de calendario"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isEditMode
                  ? t("admin.clickToToggle") || "Haz clic para alternar disponibilidad"
                  : t("admin.viewAvailability") || "Ver disponibilidad"}
              </p>

              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="outline" className="bg-green-100">
                  {t("admin.available") || "Disponible"}
                </Badge>
                <Badge variant="outline" className="bg-red-100">
                  {t("admin.unavailable") || "No disponible"}
                </Badge>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              onDayClick={toggleDateAvailability}
              locale={locale}
              className="rounded-md border"
              modifiers={{
                unavailable: unavailableDates,
              }}
              modifiersClassNames={{
                unavailable: "bg-red-100 text-red-800",
              }}
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="range">
          <TabsList className="mb-4">
            <TabsTrigger value="range">{t("admin.dateRange") || "Rango de fechas"}</TabsTrigger>
            <TabsTrigger value="month">{t("admin.entireMonth") || "Mes completo"}</TabsTrigger>
          </TabsList>

          <TabsContent value="range">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">
                  {t("admin.selectDateRange") || "Seleccionar rango de fechas"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("admin.markRangeDescription") || "Marca un rango de fechas como no disponible"}
                </p>

                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  locale={locale}
                  className="rounded-md border mb-4"
                />

                <div className="flex justify-end">
                  <Button onClick={selectDateRange} disabled={!dateRange.from || !dateRange.to}>
                    {t("admin.markAsUnavailable") || "Marcar como no disponible"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">{t("admin.selectMonth") || "Seleccionar mes"}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("admin.markMonthDescription") || "Marca un mes completo como disponible o no disponible"}
                </p>

                <div className="flex justify-between items-center mb-6">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                    &larr; {t("admin.previousMonth") || "Mes anterior"}
                  </Button>
                  <h4 className="text-base font-medium">{format(selectedMonth, "MMMM yyyy", { locale })}</h4>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}>
                    {t("admin.nextMonth") || "Mes siguiente"} &rarr;
                  </Button>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={markMonthAsAvailable}>
                    {t("admin.markAsAvailable") || "Marcar como disponible"}
                  </Button>
                  <Button onClick={markMonthAsUnavailable}>
                    {t("admin.markAsUnavailable") || "Marcar como no disponible"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">{t("admin.unavailableDates") || "Fechas no disponibles"}</h3>
        {unavailableDates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {unavailableDates.map((date, index) => (
              <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                {format(date, "PPP", { locale })}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("admin.noUnavailableDates") || "No hay fechas marcadas como no disponibles"}
          </p>
        )}
      </div>

      {isEditMode && (
        <div className="flex justify-end">
          <Button onClick={saveChanges}>{t("admin.saveChanges") || "Guardar cambios"}</Button>
        </div>
      )}
    </div>
  )
}
