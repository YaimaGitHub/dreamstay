import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Room } from "@/types/room"

interface PricingBreakdownProps {
  room: Room
  nights?: number
  hours?: number
  tourismType?: "national" | "international"
  pricingMode?: "nightly" | "hourly"
}

const PricingBreakdown = ({
  room,
  nights = 1,
  hours = 0,
  tourismType,
  pricingMode = "nightly",
}: PricingBreakdownProps) => {
  // Función para obtener los precios según el tipo de turismo
  const getPricing = () => {
    if (tourismType === "national" && room.pricing?.nationalTourism?.enabled) {
      return {
        ...room.pricing.nationalTourism,
        tourismLabel: "Nacional",
      }
    }
    if (tourismType === "international" && room.pricing?.internationalTourism?.enabled) {
      return {
        ...room.pricing.internationalTourism,
        tourismLabel: "Internacional",
      }
    }

    // Auto-detectar el primer tipo disponible
    if (room.pricing?.nationalTourism?.enabled) {
      return {
        ...room.pricing.nationalTourism,
        tourismLabel: "Nacional",
      }
    }
    if (room.pricing?.internationalTourism?.enabled) {
      return {
        ...room.pricing.internationalTourism,
        tourismLabel: "Internacional",
      }
    }

    // Precios generales
    return {
      nightlyRate: { enabled: true, price: room.price },
      hourlyRate: { enabled: false, price: 0 },
      tourismLabel: null,
    }
  }

  const pricing = getPricing()
  const hasNightlyRate = pricing.nightlyRate?.enabled && pricing.nightlyRate.price > 0
  const hasHourlyRate = pricing.hourlyRate?.enabled && pricing.hourlyRate.price > 0

  let nightlyTotal = 0
  let hourlyTotal = 0
  let total = 0

  if (pricingMode === "nightly" && hasNightlyRate && nights > 0) {
    nightlyTotal = pricing.nightlyRate.price * nights
    total += nightlyTotal
  }

  if (pricingMode === "hourly" && hasHourlyRate && hours > 0) {
    hourlyTotal = pricing.hourlyRate.price * hours
    total += hourlyTotal
  }

  // Si no hay precios específicos, usar precio base
  if (!hasNightlyRate && !hasHourlyRate) {
    nightlyTotal = room.price * nights
    total = nightlyTotal
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Desglose de Precios</CardTitle>
        {pricing.tourismLabel && (
          <Badge variant="outline" className="w-fit">
            Turismo {pricing.tourismLabel}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Precio por noche */}
        {pricingMode === "nightly" && hasNightlyRate && nights > 0 && (
          <div className="flex justify-between items-center">
            <span>
              ${pricing.nightlyRate.price} x {nights} noche{nights > 1 ? "s" : ""}
              {pricing.tourismLabel && ` Turismo (${pricing.tourismLabel})`}
            </span>
            <span className="font-medium">${nightlyTotal}</span>
          </div>
        )}

        {/* Precio por hora */}
        {pricingMode === "hourly" && hasHourlyRate && hours > 0 && (
          <div className="flex justify-between items-center">
            <span>
              ${pricing.hourlyRate.price} x {hours} hora{hours > 1 ? "s" : ""}
              {pricing.tourismLabel && ` Turismo (${pricing.tourismLabel})`}
            </span>
            <span className="font-medium">${hourlyTotal}</span>
          </div>
        )}

        {/* Precio base si no hay opciones específicas */}
        {!hasNightlyRate && !hasHourlyRate && (
          <div className="flex justify-between items-center">
            <span>
              ${room.price} x {nights} noche{nights > 1 ? "s" : ""}
            </span>
            <span className="font-medium">${nightlyTotal}</span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total</span>
          <span>${total}</span>
        </div>

        {/* Información adicional */}
        <div className="text-sm text-muted-foreground space-y-1">
          {hasNightlyRate && hasHourlyRate && <p>* Se pueden seleccionar precios por noche o por hora</p>}
          {pricing.tourismLabel && <p>* Precios especiales para turismo {pricing.tourismLabel.toLowerCase()}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export default PricingBreakdown
