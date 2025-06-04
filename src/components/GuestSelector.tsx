"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Minus, Plus, Users, ChevronDown } from "lucide-react"

interface GuestCounts {
  adults: number
  children: number
  babies: number
  pets: number
}

interface GuestSelectorProps {
  value: GuestCounts
  onChange: (guests: GuestCounts) => void
  maxGuests?: number
  className?: string
}

const GuestSelector = ({ value, onChange, maxGuests = 10, className = "" }: GuestSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const updateCount = (type: keyof GuestCounts, increment: boolean) => {
    const newValue = { ...value }
    const currentCount = newValue[type]

    if (increment) {
      // Verificar límites máximos
      const totalGuests = value.adults + value.children + value.babies
      if (type !== "pets" && totalGuests >= maxGuests) return
      if (type === "pets" && currentCount >= 5) return // Máximo 5 mascotas

      newValue[type] = currentCount + 1
    } else {
      if (currentCount > 0) {
        newValue[type] = currentCount - 1
      }
    }

    // Asegurar que siempre haya al menos 1 adulto
    if (type === "adults" && newValue.adults === 0) {
      newValue.adults = 1
    }

    onChange(newValue)
  }

  const getTotalGuests = () => {
    return value.adults + value.children + value.babies
  }

  const getGuestSummary = () => {
    const total = getTotalGuests()
    let summary = `${total} huésped${total !== 1 ? "es" : ""}`

    if (value.pets > 0) {
      summary += `, ${value.pets} mascota${value.pets !== 1 ? "s" : ""}`
    }

    return summary
  }

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-left font-normal h-auto py-3 px-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">¿Cuántos?</div>
                <div className="text-xs text-muted-foreground">{getGuestSummary()}</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Huéspedes</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pb-4">
              {/* Adultos */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">Adultos</div>
                  <div className="text-xs text-muted-foreground">13 años o más</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateCount("adults", false)}
                    disabled={value.adults <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{value.adults}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateCount("adults", true)}
                    disabled={getTotalGuests() >= maxGuests}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Niños */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">Niños</div>
                  <div className="text-xs text-muted-foreground">De 2 a 12 años</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateCount("children", false)}
                    disabled={value.children <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{value.children}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateCount("children", true)}
                    disabled={getTotalGuests() >= maxGuests}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Bebés */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">Bebés</div>
                  <div className="text-xs text-muted-foreground">Menos de 2 años</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateCount("babies", false)}
                    disabled={value.babies <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{value.babies}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateCount("babies", true)}
                    disabled={getTotalGuests() >= maxGuests}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Mascotas */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">Mascotas</div>
                  <div className="text-xs text-muted-foreground">¿Traes a un animal de servicio?</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateCount("pets", false)}
                    disabled={value.pets <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{value.pets}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateCount("pets", true)}
                    disabled={value.pets >= 5}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Información adicional */}
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Total: {getTotalGuests()} huésped{getTotalGuests() !== 1 ? "es" : ""}
                  {value.pets > 0 && ` + ${value.pets} mascota${value.pets !== 1 ? "s" : ""}`}
                </div>
                {getTotalGuests() >= maxGuests && (
                  <div className="text-xs text-amber-600 mt-1">Máximo {maxGuests} huéspedes permitidos</div>
                )}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default GuestSelector
