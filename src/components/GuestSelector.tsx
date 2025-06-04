"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Users, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface GuestCounts {
  adults: number
  children: number
  babies: number
  pets: number
}

interface GuestSelectorProps {
  value: GuestCounts
  onChange: (value: GuestCounts) => void
  maxGuests?: number
  className?: string
  placeholder?: string
}

const GuestSelector = ({
  value,
  onChange,
  maxGuests = 10,
  className,
  placeholder = "¿Cuántos?",
}: GuestSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const getTotalGuests = () => {
    return value.adults + value.children + value.babies
  }

  const canAddGuest = () => {
    return getTotalGuests() < maxGuests
  }

  const updateCount = (type: keyof GuestCounts, increment: boolean) => {
    const newValue = { ...value }

    if (increment) {
      if (type === "adults" || canAddGuest()) {
        if (type === "pets" && newValue.pets >= 5) return // Límite de mascotas
        newValue[type] = Math.min(newValue[type] + 1, type === "adults" ? maxGuests : 10)
      }
    } else {
      if (type === "adults") {
        newValue[type] = Math.max(1, newValue[type] - 1) // Mínimo 1 adulto
      } else {
        newValue[type] = Math.max(0, newValue[type] - 1)
      }
    }

    onChange(newValue)
  }

  const formatGuestText = () => {
    const total = getTotalGuests()
    if (total === 0) return placeholder

    let text = `${total} huésped${total !== 1 ? "es" : ""}`
    if (value.pets > 0) {
      text += `, ${value.pets} mascota${value.pets !== 1 ? "s" : ""}`
    }
    return text
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between text-left font-normal h-11",
            getTotalGuests() === 0 && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{formatGuestText()}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium text-center mb-4">¿Cuántos?</div>

          {/* Adultos */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Adultos</div>
              <div className="text-sm text-muted-foreground">13 años o más</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateCount("adults", false)}
                disabled={value.adults <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{value.adults}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateCount("adults", true)}
                disabled={value.adults >= maxGuests}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Niños */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Niños</div>
              <div className="text-sm text-muted-foreground">De 2 a 12 años</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateCount("children", false)}
                disabled={value.children <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{value.children}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateCount("children", true)}
                disabled={!canAddGuest()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bebés */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Bebés</div>
              <div className="text-sm text-muted-foreground">Menos de 2 años</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateCount("babies", false)}
                disabled={value.babies <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{value.babies}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateCount("babies", true)}
                disabled={!canAddGuest()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mascotas */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Mascotas</div>
              <div className="text-sm text-muted-foreground">¿Traes a un animal de servicio?</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateCount("pets", false)}
                disabled={value.pets <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{value.pets}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateCount("pets", true)}
                disabled={value.pets >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="text-sm text-muted-foreground text-center">
              Total: {getTotalGuests()} huésped{getTotalGuests() !== 1 ? "es" : ""}
              {value.pets > 0 && ` + ${value.pets} mascota${value.pets !== 1 ? "s" : ""}`}
            </div>
          </div>

          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Confirmar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default GuestSelector
