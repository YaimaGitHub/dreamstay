"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Bed, Coffee, Star, Wifi, Globe, MapPin, MessageCircle } from "lucide-react"
import RoomPricing from "@/components/rooms/RoomPricing"
import type { Room } from "@/types/room"

interface RoomCardProps {
  room: Room
}

const RoomCard = ({ room }: RoomCardProps) => {
  const isRoomAvailable = room.available !== false

  // Verificar qué tipos de turismo están configurados
  const hasNationalPricing = room.pricing?.nationalTourism?.enabled
  const hasInternationalPricing = room.pricing?.internationalTourism?.enabled
  const hasPricingOptions = hasNationalPricing || hasInternationalPricing

  // Calcular cuántos precios hay configurados para ajustar la altura
  const hasInternationalNightly =
    hasInternationalPricing &&
    room.pricing?.internationalTourism?.nightlyRate?.enabled &&
    room.pricing?.internationalTourism?.nightlyRate?.price > 0

  const hasNationalNightly =
    hasNationalPricing &&
    room.pricing?.nationalTourism?.nightlyRate?.enabled &&
    room.pricing?.nationalTourism?.nightlyRate?.price > 0

  const hasNationalHourly =
    hasNationalPricing &&
    room.pricing?.nationalTourism?.hourlyRate?.enabled &&
    room.pricing?.nationalTourism?.hourlyRate?.price > 0

  const totalConfiguredPrices =
    (hasInternationalNightly ? 1 : 0) + (hasNationalNightly ? 1 : 0) + (hasNationalHourly ? 1 : 0)

  // Determinar el tipo de turismo por defecto (prioridad: nacional > internacional)
  const getDefaultTourismType = (): "national" | "international" | null => {
    if (hasNationalPricing) return "national"
    if (hasInternationalPricing) return "international"
    return null
  }

  const [selectedTourismType, setSelectedTourismType] = useState<"national" | "international" | null>(
    getDefaultTourismType(),
  )

  // Actualizar cuando cambien los datos de pricing
  useEffect(() => {
    const defaultType = getDefaultTourismType()
    setSelectedTourismType(defaultType)
  }, [room.pricing])

  return (
    <Card className={`overflow-hidden card-hover border border-border/50 ${!isRoomAvailable ? "opacity-70" : ""}`}>
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={room.image || "/placeholder.svg"}
          alt={room.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        {!isRoomAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg px-4 py-2 bg-red-500 rounded-md">No disponible</span>
          </div>
        )}
        {/* Badge de WhatsApp */}
        {room.hostWhatsApp?.enabled && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>WhatsApp</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{room.title}</h3>
            <p className="text-muted-foreground text-sm">{room.location}</p>
          </div>
          <Badge variant="outline" className="bg-accent text-accent-foreground">
            <Star className="h-3 w-3 fill-accent-foreground mr-1" /> {room.rating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {room.features.slice(0, 3).map((feature) => (
            <div key={feature} className="flex items-center text-sm">
              {feature.includes("Baño") && <Bed className="h-3 w-3 mr-1" />}
              {feature.includes("WiFi") && <Wifi className="h-3 w-3 mr-1" />}
              {feature.includes("Desayuno") && <Coffee className="h-3 w-3 mr-1" />}
              {feature}
            </div>
          ))}
          {room.features.length > 3 && (
            <div className="text-sm text-muted-foreground">+{room.features.length - 3} más</div>
          )}
        </div>

        {/* Indicador de WhatsApp disponible */}
        {room.hostWhatsApp?.enabled && (
          <div className="mb-3 flex items-center gap-2 text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
            <MessageCircle className="h-3 w-3" />
            <span>Reserva instantánea disponible</span>
          </div>
        )}

        {/* Selector de tipo de turismo SOLO si hay múltiples opciones */}
        {hasNationalPricing && hasInternationalPricing && (
          <div className="mb-3">
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={selectedTourismType === "national" ? "default" : "ghost"}
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => setSelectedTourismType("national")}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Nacional
              </Button>
              <Button
                variant={selectedTourismType === "international" ? "default" : "ghost"}
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => setSelectedTourismType("international")}
              >
                <Globe className="h-3 w-3 mr-1" />
                Internacional
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-start border-t pt-4">
        <div className={`flex-1 ${totalConfiguredPrices > 1 ? "min-h-[100px]" : "min-h-[60px]"}`}>
          {/* Si hay múltiples tipos de turismo y no se ha seleccionado uno específico, mostrar todos */}
          {hasNationalPricing && hasInternationalPricing && !selectedTourismType ? (
            <RoomPricing room={room} showAllPrices={true} showLabel={true} />
          ) : (
            <RoomPricing room={room} tourismType={selectedTourismType} showLabel={true} />
          )}
        </div>
        <div className="ml-4">
          <Button
            variant={isRoomAvailable ? "default" : "outline"}
            size="sm"
            className={isRoomAvailable ? "bg-terracotta hover:bg-terracotta/90" : ""}
            asChild
          >
            <Link to={`/habitacion/${room.id}`}>Ver detalles</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default RoomCard
