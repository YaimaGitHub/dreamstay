"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Star, MessageCircle, Eye, Heart, Share2 } from "lucide-react"
import type { Room } from "@/types/room"

interface RoomCardProps {
  room: Room
  viewMode?: "grid" | "list"
}

const RoomCard = ({ room, viewMode = "grid" }: RoomCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const getMinPrice = () => {
    let minPrice = room.price || 0

    if (room.pricing) {
      const nationalNightly = room.pricing.nationalTourism?.nightlyRate?.enabled
        ? room.pricing.nationalTourism.nightlyRate.price
        : 0
      const nationalHourly = room.pricing.nationalTourism?.hourlyRate?.enabled
        ? room.pricing.nationalTourism.hourlyRate.price
        : 0
      const internationalNightly = room.pricing.internationalTourism?.nightlyRate?.enabled
        ? room.pricing.internationalTourism.nightlyRate.price
        : 0

      const availablePrices = [nationalNightly, nationalHourly, internationalNightly, minPrice].filter(
        (price) => price > 0,
      )

      if (availablePrices.length > 0) {
        minPrice = Math.min(...availablePrices)
      }
    }

    return minPrice
  }

  const minPrice = getMinPrice()

  // Obtener la imagen principal de la habitación
  const getMainImage = () => {
    // Prioridad: images array > image property > placeholder
    if (room.images && room.images.length > 0) {
      return room.images[0]
    }
    if (room.image) {
      return room.image
    }
    return "/placeholder.svg?height=300&width=400"
  }

  const mainImage = getMainImage()
  const hasMultipleImages = room.images && room.images.length > 1

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-muted group">
        <div className="flex flex-col md:flex-row">
          {/* Imagen */}
          <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
            <img
              src={mainImage || "/placeholder.svg"}
              alt={room.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=300&width=400"
              }}
            />
            {!isImageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

            {/* Indicador de múltiples imágenes */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-3 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                +{room.images!.length - 1} fotos
              </div>
            )}

            {/* Badges sobre la imagen */}
            <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
              {room.available === false && (
                <Badge className="bg-red-500/90 text-white backdrop-blur-sm">No disponible</Badge>
              )}
              {room.hostWhatsApp?.enabled && (
                <Badge className="bg-green-500/90 text-white backdrop-blur-sm">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  WhatsApp
                </Badge>
              )}
            </div>

            {/* Botones de acción */}
            <div className="absolute top-3 right-3 z-20 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">{room.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{room.location}</span>
                  {room.province && (
                    <Badge variant="outline" className="text-xs">
                      {room.province}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">${minPrice}</div>
                <div className="text-sm text-muted-foreground">por noche</div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{room.capacity || 4} huéspedes</span>
              </div>
              {room.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{room.rating}</span>
                </div>
              )}
              <Badge variant="outline">{room.type || "Estándar"}</Badge>
            </div>

            {/* Características */}
            <div className="flex flex-wrap gap-2 mb-4">
              {room.features.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {room.features.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{room.features.length - 4} más
                </Badge>
              )}
            </div>

            {/* Descripción */}
            {room.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{room.description}</p>}

            {/* Botones de acción */}
            <div className="flex gap-2">
              <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Link to={`/habitacion/${room.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalles
                </Link>
              </Button>
              {room.hostWhatsApp?.enabled && (
                <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-muted group hover:scale-[1.02]">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <img
          src={mainImage || "/placeholder.svg"}
          alt={room.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=300&width=400"
          }}
        />
        {!isImageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

        {/* Indicador de múltiples imágenes */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-3 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            +{room.images!.length - 1} fotos
          </div>
        )}

        {/* Badges sobre la imagen */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
          {room.available === false && (
            <Badge className="bg-red-500/90 text-white backdrop-blur-sm">No disponible</Badge>
          )}
          {room.hostWhatsApp?.enabled && (
            <Badge className="bg-green-500/90 text-white backdrop-blur-sm">
              <MessageCircle className="h-3 w-3 mr-1" />
              WhatsApp
            </Badge>
          )}
        </div>

        {/* Botones de acción */}
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Precio flotante */}
        <div className="absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <div className="text-lg font-bold text-orange-600">${minPrice}</div>
          <div className="text-xs text-muted-foreground">por noche</div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Título y ubicación */}
          <div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
              {room.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="text-sm line-clamp-1">{room.location}</span>
              {room.province && (
                <Badge variant="outline" className="text-xs">
                  {room.province}
                </Badge>
              )}
            </div>
          </div>

          {/* Información básica */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{room.capacity || 4} huéspedes</span>
            </div>
            {room.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{room.rating}</span>
              </div>
            )}
          </div>

          {/* Tipo de habitación */}
          <Badge variant="outline" className="w-fit">
            {room.type || "Estándar"}
          </Badge>

          {/* Características principales */}
          <div className="flex flex-wrap gap-1">
            {room.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {room.features.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{room.features.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 transition-colors">
          <Link to={`/habitacion/${room.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Ver detalles
          </Link>
        </Button>
        {room.hostWhatsApp?.enabled && (
          <Button variant="outline" size="sm" className="w-full text-green-600 border-green-200 hover:bg-green-50">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contactar por WhatsApp
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default RoomCard
