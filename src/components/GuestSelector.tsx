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
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop")

  // Detectar tamaño de pantalla más preciso
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0

      if (width <= 640 || (isTouchDevice && width <= 768)) {
        setScreenSize("mobile")
      } else if (width <= 1024 || (isTouchDevice && width <= 1200)) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
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
    if (screenSize === "mobile") return "h-12"
    return "h-11"
  }

  const getPopoverProps = () => {
    switch (screenSize) {
      case "mobile":
        return {
          width: "w-[90vw] max-w-sm",
          align: "center" as const,
          side: "bottom" as const,
          sideOffset: 12,
        }
      case "tablet":
        return {
          width: "w-[70vw] max-w-md",
          align: "center" as const,
          side: "bottom" as const,
          sideOffset: 8,
        }
      default:
        return {
          width: "w-80",
          align: "start" as const,
          side: "bottom" as const,
          sideOffset: 4,
        }
    }
  }

  const popoverProps = getPopoverProps()

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
        <div className={cn("font-medium", screenSize === "mobile" ? "text-base" : "text-sm")}>{title}</div>
        <div className={cn("text-muted-foreground", screenSize === "mobile" ? "text-sm" : "text-xs")}>
          {description}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "p-0 rounded-full border-2 hover:bg-muted/50 transition-colors",
            screenSize === "mobile" ? "h-10 w-10" : "h-8 w-8",
          )}
          onClick={() => updateCount(type, false)}
          disabled={!canDecrease}
        >
          <Minus className={cn(screenSize === "mobile" ? "h-5 w-5" : "h-4 w-4")} />
        </Button>
        <span className={cn("text-center font-medium min-w-[2rem]", screenSize === "mobile" ? "text-lg" : "text-sm")}>
          {count}
        </span>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "p-0 rounded-full border-2 hover:bg-muted/50 transition-colors",
            screenSize === "mobile" ? "h-10 w-10" : "h-8 w-8",
          )}
          onClick={() => updateCount(type, true)}
          disabled={!canIncrease}
        >
          <Plus className={cn(screenSize === "mobile" ? "h-5 w-5" : "h-4 w-4")} />
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
            "justify-between text-left font-normal hover:bg-muted/50 transition-colors",
            getButtonHeight(),
            getTotalGuests() === 0 && "text-muted-foreground",
            variant === "compact" && "px-3",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <Users className={cn(screenSize === "mobile" ? "h-5 w-5" : "h-4 w-4")} />
            <span
              className={cn(
                variant === "compact" && "text-sm",
                screenSize === "mobile" && variant !== "compact" && "text-base",
              )}
            >
              {formatGuestText()}
            </span>
          </div>
          <ChevronDown className={cn("opacity-50", screenSize === "mobile" ? "h-5 w-5" : "h-4 w-4")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("p-0 border-2 shadow-lg", popoverProps.width)}
        align={popoverProps.align}
        side={popoverProps.side}
        sideOffset={popoverProps.sideOffset}
        avoidCollisions={true}
        collisionPadding={screenSize === "mobile" ? 16 : 8}
      >
        <div className="bg-white rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <h3 className={cn("font-semibold", screenSize === "mobile" ? "text-lg" : "text-base")}>
              ¿Cuántos huéspedes?
            </h3>
            {screenSize === "mobile" && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-1 max-h-[60vh] overflow-y-auto">
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
          <div className="p-4 border-t bg-muted/20">
            <div
              className={cn("text-muted-foreground text-center mb-3", screenSize === "mobile" ? "text-sm" : "text-xs")}
            >
              Total: {getTotalGuests()} huésped{getTotalGuests() !== 1 ? "es" : ""}
              {value.pets > 0 && ` + ${value.pets} mascota${value.pets !== 1 ? "s" : ""}`}
            </div>

            {getTotalGuests() >= maxGuests && (
              <div
                className={cn(
                  "text-amber-600 text-center mb-3 font-medium",
                  screenSize === "mobile" ? "text-sm" : "text-xs",
                )}
              >
                Máximo {maxGuests} huéspedes permitidos
              </div>
            )}

            <Button
              className={cn(
                "w-full bg-terracotta hover:bg-terracotta/90 transition-colors",
                screenSize === "mobile" ? "h-12 text-base" : "h-10",
              )}
              onClick={() => setIsOpen(false)}
            >
              Confirmar selección
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default GuestSelector
