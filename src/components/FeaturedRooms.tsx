"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, Globe, MapPin, Clock, ChevronRight, Sparkles } from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import type { Room } from "@/types/room"

interface TourismPriceOption {
  type: "national" | "international"
  mode: "nightly" | "hourly"
  price: number
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const FeaturedRooms = () => {
  const { rooms } = useDataStore()
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  // Obtener las primeras 3 habitaciones disponibles
  const featuredRooms = rooms.filter((room) => room.available !== false).slice(0, 3)

  // Función para obtener las opciones de turismo de una habitación
  const getTourismOptions = (room: Room): TourismPriceOption[] => {
    const options: TourismPriceOption[] = []

    // Turismo Internacional (solo por noche)
    if (
      room.pricing?.internationalTourism?.enabled &&
      room.pricing.internationalTourism.nightlyRate?.enabled &&
      room.pricing.internationalTourism.nightlyRate.price > 0
    ) {
      options.push({
        type: "international",
        mode: "nightly",
        price: room.pricing.internationalTourism.nightlyRate.price,
        label: "Internacional",
        icon: <Globe className="h-4 w-4" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200",
      })
    }

    // Turismo Nacional por noche
    if (
      room.pricing?.nationalTourism?.enabled &&
      room.pricing.nationalTourism.nightlyRate?.enabled &&
      room.pricing.nationalTourism.nightlyRate.price > 0
    ) {
      options.push({
        type: "national",
        mode: "nightly",
        price: room.pricing.nationalTourism.nightlyRate.price,
        label: "Nacional",
        icon: <MapPin className="h-4 w-4" />,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
      })
    }

    // Turismo Nacional por hora
    if (
      room.pricing?.nationalTourism?.enabled &&
      room.pricing.nationalTourism.hourlyRate?.enabled &&
      room.pricing.nationalTourism.hourlyRate.price > 0
    ) {
      options.push({
        type: "national",
        mode: "hourly",
        price: room.pricing.nationalTourism.hourlyRate.price,
        label: "Nacional (Hora)",
        icon: <Clock className="h-4 w-4" />,
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200",
      })
    }

    return options
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-terracotta animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-deepblue to-terracotta bg-clip-text text-transparent">
              Habitaciones Destacadas
            </h2>
            <Sparkles className="h-6 w-6 text-terracotta animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestras mejores habitaciones con opciones de turismo nacional e internacional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room, index) => {
            const tourismOptions = getTourismOptions(room)

            return (
              <Card
                key={room.id}
                className={`overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 ${
                  selectedRoom === room.id ? "border-terracotta shadow-xl scale-105" : "border-border/50"
                }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
                onMouseEnter={() => setSelectedRoom(room.id)}
                onMouseLeave={() => setSelectedRoom(null)}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={room.image || "/placeholder.svg"}
                    alt={room.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge de habitación destacada */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-terracotta/90 text-white border-0 animate-pulse">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Destacada
                    </Badge>
                  </div>

                  {/* Etiqueta de provincia con animación */}
                  {room.province && (
                    <div className="absolute top-4 right-4">
                      <div
                        className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-medium text-sm shadow-lg 
                                     animate-pulse-slow hover:scale-105 transition-all duration-300 
                                     border border-white/20 flex items-center"
                      >
                        <span className="inline-block w-2 h-2 rounded-full bg-terracotta mr-2 animate-ping"></span>
                        {room.province}
                      </div>
                    </div>
                  )}

                  {/* Rating en la esquina inferior derecha */}
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-deepblue">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      {room.rating}
                    </Badge>
                  </div>

                  {/* Título superpuesto */}
                  <div className="absolute bottom-4 left-4 right-20">
                    <h3 className="text-xl font-bold text-white mb-1">{room.title}</h3>
                    <p className="text-white/80 text-sm">{room.location}</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Opciones de turismo */}
                  {tourismOptions.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-gradient-to-r from-terracotta to-deepblue rounded-full"></div>
                        <span className="text-sm font-medium text-muted-foreground">Opciones de Turismo</span>
                        <div className="h-1 flex-1 bg-gradient-to-r from-deepblue to-terracotta rounded-full"></div>
                      </div>

                      {tourismOptions.map((option, optionIndex) => (
                        <div
                          key={`${option.type}-${option.mode}`}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer transform ${
                            hoveredOption === `${room.id}-${option.type}-${option.mode}`
                              ? `${option.bgColor} scale-105 shadow-lg`
                              : "bg-white border-border hover:border-terracotta/30"
                          }`}
                          style={{
                            animationDelay: `${index * 150 + optionIndex * 100}ms`,
                            animation: "slideInRight 0.5s ease-out forwards",
                          }}
                          onMouseEnter={() => setHoveredOption(`${room.id}-${option.type}-${option.mode}`)}
                          onMouseLeave={() => setHoveredOption(null)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${option.bgColor} ${option.color}`}>{option.icon}</div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{option.label}</span>
                                  {option.mode === "hourly" && (
                                    <Badge variant="outline" className="text-xs">
                                      Por hora
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {option.mode === "nightly" ? "Por noche" : "Por hora"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-deepblue">${option.price}</div>
                              <div className="text-xs text-muted-foreground">
                                {option.mode === "nightly" ? "/noche" : "/hora"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Precio base si no hay opciones de turismo configuradas
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-deepblue mb-1">${room.price}</div>
                      <div className="text-sm text-muted-foreground">por noche</div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-terracotta to-deepblue hover:from-terracotta/90 hover:to-deepblue/90 text-white transition-all duration-300 transform hover:scale-105"
                  >
                    <Link to={`/habitacion/${room.id}`} className="flex items-center justify-center gap-2">
                      Ver Detalles
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Botón para ver todas las habitaciones */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <Link to="/habitaciones" className="flex items-center gap-2">
              Ver Todas las Habitaciones
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default FeaturedRooms
