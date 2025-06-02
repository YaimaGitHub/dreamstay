"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Clock, Moon, MapPin, Globe } from "lucide-react"
import type { Room } from "@/types/room"
import type { SelectedService } from "@/components/BookingForm"

interface PricingBreakdownDetailedProps {
  room: Room
  selectedTourismType?: "national" | "international"
  pricingMode: "nightly" | "hourly"
  nights: number
  hours: number
  selectedServices: SelectedService[]
  showAllOptions?: boolean
}

const PricingBreakdownDetailed = ({
  room,
  selectedTourismType,
  pricingMode,
  nights,
  hours,
  selectedServices,
  showAllOptions = false,
}: PricingBreakdownDetailedProps) => {
  // Obtener el precio específico según la selección
  const getSelectedPrice = () => {
    if (!selectedTourismType) return room.price

    if (selectedTourismType === "national" && room.pricing?.nationalTourism?.enabled) {
      const nationalPricing = room.pricing.nationalTourism
      if (pricingMode === "nightly" && nationalPricing.nightlyRate?.enabled) {
        return nationalPricing.nightlyRate.price
      }
      if (pricingMode === "hourly" && nationalPricing.hourlyRate?.enabled) {
        return nationalPricing.hourlyRate.price
      }
    }

    if (selectedTourismType === "international" && room.pricing?.internationalTourism?.enabled) {
      const internationalPricing = room.pricing.internationalTourism
      if (pricingMode === "nightly" && internationalPricing.nightlyRate?.enabled) {
        return internationalPricing.nightlyRate.price
      }
    }

    return room.price
  }

  const selectedPrice = getSelectedPrice()

  // Calcular totales
  const roomSubtotal = pricingMode === "nightly" ? selectedPrice * nights : selectedPrice * hours
  const servicesSubtotal = selectedServices.reduce((total, service) => total + service.price, 0)
  const cleaningFee = 25
  const serviceFee = 15
  const grandTotal = roomSubtotal + servicesSubtotal + cleaningFee + serviceFee

  // Obtener información del tipo de turismo seleccionado
  const getTourismInfo = () => {
    if (!selectedTourismType) return null

    return {
      type: selectedTourismType,
      label: selectedTourismType === "national" ? "Turismo Nacional" : "Turismo Internacional",
      icon: selectedTourismType === "national" ? <MapPin className="h-4 w-4" /> : <Globe className="h-4 w-4" />,
      color: selectedTourismType === "national" ? "text-green-600" : "text-blue-600",
      bgColor: selectedTourismType === "national" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200",
    }
  }

  const tourismInfo = getTourismInfo()

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Desglose de Precios
        </CardTitle>
        {tourismInfo && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`flex items-center gap-1 ${tourismInfo.bgColor} ${tourismInfo.color}`}>
              {tourismInfo.icon}
              {tourismInfo.label}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {pricingMode === "nightly" ? (
                <>
                  <Moon className="h-3 w-3" />
                  Por noche
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  Por hora
                </>
              )}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Precio de la habitación */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm">
                ${selectedPrice} x{" "}
                {pricingMode === "nightly"
                  ? `${nights} noche${nights > 1 ? "s" : ""}`
                  : `${hours} hora${hours > 1 ? "s" : ""}`}
              </span>
              <div className="flex items-center gap-2">
                {tourismInfo && (
                  <Badge
                    variant="outline"
                    className={`text-xs flex items-center gap-1 ${tourismInfo.bgColor} ${tourismInfo.color}`}
                  >
                    {tourismInfo.icon}
                    {tourismInfo.label}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  {pricingMode === "nightly" ? (
                    <>
                      <Moon className="h-2 w-2" />
                      Por noche
                    </>
                  ) : (
                    <>
                      <Clock className="h-2 w-2" />
                      Por hora
                    </>
                  )}
                </Badge>
              </div>
            </div>
            <span className="font-medium">${roomSubtotal}</span>
          </div>

          {/* Servicios adicionales */}
          {selectedServices.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Servicios adicionales:</h5>
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span>{service.title}</span>
                    <span>${service.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-1 border-t">
                  <span>Subtotal servicios:</span>
                  <span>${servicesSubtotal}</span>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Tarifas fijas */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tarifa de limpieza</span>
              <span>${cleaningFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tarifa de servicio</span>
              <span>${serviceFee}</span>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${grandTotal}</span>
          </div>

          {/* Resumen de la reserva */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
            <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
              <div className="h-2 w-2 bg-terracotta rounded-full animate-pulse"></div>
              Resumen de tu reserva:
            </h5>
            <div className="text-sm space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 bg-deepblue rounded-full"></div>
                <span>
                  {pricingMode === "nightly"
                    ? `${nights} noche${nights > 1 ? "s" : ""}`
                    : `${hours} hora${hours > 1 ? "s" : ""}`}
                </span>
              </div>
              {tourismInfo && (
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-deepblue rounded-full"></div>
                  <span>{tourismInfo.label}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 bg-deepblue rounded-full"></div>
                <span>
                  Precio: ${selectedPrice} / {pricingMode === "nightly" ? "noche" : "hora"}
                </span>
              </div>
              {selectedServices.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-deepblue rounded-full"></div>
                  <span>
                    {selectedServices.length} servicio{selectedServices.length > 1 ? "s" : ""} adicional
                    {selectedServices.length > 1 ? "es" : ""}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 bg-deepblue rounded-full"></div>
                <span>Incluye tarifas de limpieza y servicio</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PricingBreakdownDetailed
