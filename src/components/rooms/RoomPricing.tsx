import { Badge } from "@/components/ui/badge"
import { Globe, MapPin } from "lucide-react"
import type { Room } from "@/types/room"

interface RoomPricingProps {
  room: Room
  tourismType?: "national" | "international" | null
  showLabel?: boolean
  compact?: boolean
  className?: string
  showAllPrices?: boolean // Nueva prop para mostrar todos los precios
}

const RoomPricing = ({
  room,
  tourismType,
  showLabel = true,
  compact = false,
  className = "",
  showAllPrices = false,
}: RoomPricingProps) => {
  // Función para obtener todos los precios configurados
  const getAllConfiguredPrices = () => {
    const prices = []

    // Turismo Internacional (siempre primero si existe)
    if (room.pricing?.internationalTourism?.enabled) {
      const internationalPricing = room.pricing.internationalTourism
      if (internationalPricing.nightlyRate?.enabled && internationalPricing.nightlyRate.price > 0) {
        prices.push({
          price: internationalPricing.nightlyRate.price,
          unit: "noche",
          tourismType: "Internacional",
          priority: 1,
        })
      }
    }

    // Turismo Nacional (después del internacional)
    if (room.pricing?.nationalTourism?.enabled) {
      const nationalPricing = room.pricing.nationalTourism

      // Precio por noche nacional
      if (nationalPricing.nightlyRate?.enabled && nationalPricing.nightlyRate.price > 0) {
        prices.push({
          price: nationalPricing.nightlyRate.price,
          unit: "noche",
          tourismType: "Nacional",
          priority: 2,
        })
      }

      // Precio por hora nacional
      if (nationalPricing.hourlyRate?.enabled && nationalPricing.hourlyRate.price > 0) {
        prices.push({
          price: nationalPricing.hourlyRate.price,
          unit: "hora",
          tourismType: "Nacional",
          priority: 3,
        })
      }
    }

    return prices.sort((a, b) => a.priority - b.priority)
  }

  // Función para determinar el precio efectivo cuando se especifica un tipo
  const getSpecificPrice = () => {
    if (room.pricing) {
      if (tourismType === "national" && room.pricing.nationalTourism?.enabled) {
        const nationalPricing = room.pricing.nationalTourism
        return {
          nightlyPrice:
            nationalPricing.nightlyRate?.enabled && nationalPricing.nightlyRate.price > 0
              ? nationalPricing.nightlyRate.price
              : null,
          hourlyPrice:
            nationalPricing.hourlyRate?.enabled && nationalPricing.hourlyRate.price > 0
              ? nationalPricing.hourlyRate.price
              : null,
          hasNightlyRate: nationalPricing.nightlyRate?.enabled && nationalPricing.nightlyRate.price > 0,
          hasHourlyRate: nationalPricing.hourlyRate?.enabled && nationalPricing.hourlyRate.price > 0,
          tourismType: "Nacional",
          source: "specific-national",
        }
      }

      if (tourismType === "international" && room.pricing.internationalTourism?.enabled) {
        const internationalPricing = room.pricing.internationalTourism
        return {
          nightlyPrice:
            internationalPricing.nightlyRate?.enabled && internationalPricing.nightlyRate.price > 0
              ? internationalPricing.nightlyRate.price
              : null,
          hourlyPrice: null,
          hasNightlyRate: internationalPricing.nightlyRate?.enabled && internationalPricing.nightlyRate.price > 0,
          hasHourlyRate: false,
          tourismType: "Internacional",
          source: "specific-international",
        }
      }
    }

    return null
  }

  // Si showAllPrices es true o no se especifica tourismType, mostrar todos los precios
  if (showAllPrices || !tourismType) {
    const allPrices = getAllConfiguredPrices()

    // Si no hay precios configurados, usar precio base
    if (allPrices.length === 0) {
      if (compact) {
        return (
          <div className={`flex items-center gap-1 ${className}`}>
            <span className="font-bold text-lg">${room.price}</span>
            <span className="text-muted-foreground text-sm">/ noche</span>
          </div>
        )
      }

      return (
        <div className={`space-y-1 ${className}`}>
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-lg font-semibold">${room.price}</span>
            <span className="text-muted-foreground">/ noche</span>
          </div>
          {showLabel && (
            <Badge variant="outline" className="text-xs mt-2">
              Precio base
            </Badge>
          )}
        </div>
      )
    }

    // Modo compacto: mostrar solo el primer precio
    if (compact) {
      const firstPrice = allPrices[0]
      return (
        <div className={`flex items-center gap-1 ${className}`}>
          <span className="font-bold text-lg">${firstPrice.price}</span>
          <span className="text-muted-foreground text-sm">/ {firstPrice.unit}</span>
          <span className="text-muted-foreground text-sm">Turismo ({firstPrice.tourismType})</span>
        </div>
      )
    }

    // Mostrar todos los precios configurados
    return (
      <div className={`space-y-1 ${className}`}>
        {allPrices.map((priceInfo, index) => (
          <div key={index} className="flex items-center gap-1 flex-wrap">
            <span className="text-lg font-semibold">${priceInfo.price}</span>
            <span className="text-muted-foreground">/ {priceInfo.unit}</span>
            <span className="text-muted-foreground">Turismo ({priceInfo.tourismType})</span>
          </div>
        ))}

        {/* Indicadores visuales */}
        {showLabel && allPrices.length > 0 && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {allPrices.some((p) => p.tourismType === "Nacional") && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-green-600" />
                <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                  Nacional
                </Badge>
              </div>
            )}
            {allPrices.some((p) => p.tourismType === "Internacional") && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-blue-600" />
                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                  Internacional
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Mostrar precio específico cuando se selecciona un tipo de turismo
  const pricing = getSpecificPrice()

  if (!pricing) {
    // Fallback al precio base
    if (compact) {
      return (
        <div className={`flex items-center gap-1 ${className}`}>
          <span className="font-bold text-lg">${room.price}</span>
          <span className="text-muted-foreground text-sm">/ noche</span>
        </div>
      )
    }

    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-lg font-semibold">${room.price}</span>
          <span className="text-muted-foreground">/ noche</span>
        </div>
        {showLabel && (
          <Badge variant="outline" className="text-xs mt-2">
            Precio base
          </Badge>
        )}
      </div>
    )
  }

  // Modo compacto para precio específico
  if (compact) {
    const mainPrice = pricing.hasNightlyRate ? pricing.nightlyPrice : pricing.hourlyPrice
    const mainUnit = pricing.hasNightlyRate ? "noche" : "hora"

    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="font-bold text-lg">${mainPrice}</span>
        <span className="text-muted-foreground text-sm">/ {mainUnit}</span>
        <span className="text-muted-foreground text-sm">Turismo ({pricing.tourismType})</span>
      </div>
    )
  }

  // Mostrar precios específicos del tipo seleccionado
  return (
    <div className={`space-y-1 ${className}`}>
      {/* Precio por noche */}
      {pricing.hasNightlyRate && pricing.nightlyPrice !== null && (
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-lg font-semibold">${pricing.nightlyPrice}</span>
          <span className="text-muted-foreground">/ noche</span>
          <span className="text-muted-foreground">Turismo ({pricing.tourismType})</span>
        </div>
      )}

      {/* Precio por hora */}
      {pricing.hasHourlyRate && pricing.hourlyPrice !== null && (
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-lg font-semibold">${pricing.hourlyPrice}</span>
          <span className="text-muted-foreground">/ hora</span>
          <span className="text-muted-foreground">Turismo ({pricing.tourismType})</span>
        </div>
      )}

      {/* Indicador visual del tipo de turismo */}
      {showLabel && pricing.tourismType && (
        <div className="flex items-center gap-1 mt-2">
          {pricing.tourismType === "Nacional" ? (
            <MapPin className="h-3 w-3 text-green-600" />
          ) : (
            <Globe className="h-3 w-3 text-blue-600" />
          )}
          <Badge
            variant="outline"
            className={`text-xs ${
              pricing.tourismType === "Nacional"
                ? "border-green-200 text-green-700 bg-green-50"
                : "border-blue-200 text-blue-700 bg-blue-50"
            }`}
          >
            {pricing.tourismType}
          </Badge>
        </div>
      )}
    </div>
  )
}

export default RoomPricing
