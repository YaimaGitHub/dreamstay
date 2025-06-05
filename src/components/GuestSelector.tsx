"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Users, Plus, Minus, ChevronDown, X } from "lucide-react"
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
  variant?: "default" | "compact" | "mobile"
}

const GuestSelector = ({
  value,
  onChange,
  maxGuests = 10,
  className,
  placeholder = "¿Cuántos?",
  variant = "default",
}: GuestSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es móvil o tablet
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      setIsMobile(width <= 768 || isTouchDevice)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
        if (type === "pets" && newValue.pets >= 5) return
        newValue[type] = Math.min(newValue[type] + 1, type === "adults" ? maxGuests : 10)
      }
    } else {
      if (type === "adults") {
        newValue[type] = Math.max(1, newValue[type] - 1)
      } else {
        newValue[type] = Math.max(0, newValue[type] - 1)
      }
    }

    onChange(newValue)
  }

  const formatGuestText = () => {
    const total = getTotalGuests()
    if (total === 0) return placeholder

    if (variant === "compact") {
      return `${total}${value.pets > 0 ? ` +${value.pets}🐕` : ""}`
    }

    let text = `${total} huésped${total !== 1 ? "es" : ""}`
    if (value.pets > 0) {
      text += `, ${value.pets} mascota${value.pets !== 1 ? "s" : ""}`
    }
    return text
  }

  const getButtonHeight = () => {
    if (variant === "compact") return "h-10"
    if (isMobile) return "h-12"
    return "h-11"
  }

  const getPopoverWidth = () => {
    if (isMobile) return "w-[95vw] max-w-sm"
    return "w-80"
  }

  const CounterButton = ({
    type,
    title,
    description,
    count,
    canDecrease,
    canIncrease,
  }: {
    type: keyof GuestCounts
    title: string
    description: string
    count: number
    canDecrease: boolean
    canIncrease: boolean
  }) => (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex-1 pr-3">
        <div className={cn("font-medium", isMobile ? "text-base" : "text-sm")}>{title}</div>
        <div className={cn("text-muted-foreground", isMobile ? "text-sm" : "text-xs")}>{description}</div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className={cn("p-0 rounded-full border-2", isMobile ? "h-10 w-10" : "h-8 w-8")}
          onClick={() => updateCount(type, false)}
          disabled={!canDecrease}
        >
          <Minus className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
        </Button>
        <span className={cn("text-center font-medium min-w-[2rem]", isMobile ? "text-lg" : "text-sm")}>{count}</span>
        <Button
          variant="outline"
          size="sm"
          className={cn("p-0 rounded-full border-2", isMobile ? "h-10 w-10" : "h-8 w-8")}
          onClick={() => updateCount(type, true)}
          disabled={!canIncrease}
        >
          <Plus className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
        </Button>
      </div>
    </div>
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between text-left font-normal",
            getButtonHeight(),
            getTotalGuests() === 0 && "text-muted-foreground",
            variant === "compact" && "px-3",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <Users className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
            <span className={cn(variant === "compact" && "text-sm", isMobile && variant !== "compact" && "text-base")}>
              {formatGuestText()}
            </span>
          </div>
          <ChevronDown className={cn("opacity-50", isMobile ? "h-5 w-5" : "h-4 w-4")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("p-0 border-2", getPopoverWidth())}
        align={isMobile ? "center" : "start"}
        side={isMobile ? "bottom" : "bottom"}
        sideOffset={isMobile ? 8 : 4}
      >
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className={cn("font-semibold", isMobile ? "text-lg" : "text-base")}>¿Cuántos?</h3>
            {isMobile && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-1">
            <CounterButton
              type="adults"
              title="Adultos"
              description="13 años o más"
              count={value.adults}
              canDecrease={value.adults > 1}
              canIncrease={value.adults < maxGuests}
            />

            <div className="border-t my-2" />

            <CounterButton
              type="children"
              title="Niños"
              description="De 2 a 12 años"
              count={value.children}
              canDecrease={value.children > 0}
              canIncrease={canAddGuest()}
            />

            <div className="border-t my-2" />

            <CounterButton
              type="babies"
              title="Bebés"
              description="Menos de 2 años"
              count={value.babies}
              canDecrease={value.babies > 0}
              canIncrease={canAddGuest()}
            />

            <div className="border-t my-2" />

            <CounterButton
              type="pets"
              title="Mascotas"
              description="¿Traes a un animal de servicio?"
              count={value.pets}
              canDecrease={value.pets > 0}
              canIncrease={value.pets < 5}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-muted/30">
            <div className={cn("text-muted-foreground text-center mb-3", isMobile ? "text-sm" : "text-xs")}>
              Total: {getTotalGuests()} huésped{getTotalGuests() !== 1 ? "es" : ""}
              {value.pets > 0 && ` + ${value.pets} mascota${value.pets !== 1 ? "s" : ""}`}
            </div>

            {getTotalGuests() >= maxGuests && (
              <div className={cn("text-amber-600 text-center mb-3", isMobile ? "text-sm" : "text-xs")}>
                Máximo {maxGuests} huéspedes permitidos
              </div>
            )}

            <Button className={cn("w-full", isMobile ? "h-12 text-base" : "h-10")} onClick={() => setIsOpen(false)}>
              Confirmar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default GuestSelector
