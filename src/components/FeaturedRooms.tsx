"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"

const FeaturedRooms = () => {
  const { rooms } = useDataStore()
  const [isLoading, setIsLoading] = useState(true)

  // Agregar esta línea para definir el estilo de animación personalizado
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.9; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Filter available rooms and sort by rating
  const sortedRooms = [...rooms]
    .filter((room) => room.available !== false) // Filter out unavailable rooms
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Habitaciones Destacadas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Cargando nuestras habitaciones más populares...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-muted"></div>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Habitaciones Destacadas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestras habitaciones más populares, diseñadas para brindarte una experiencia única de confort y
            elegancia durante tu estancia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden card-hover border border-border/50">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={room.image || "/placeholder.svg"}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                {room.province && (
                  <div className="absolute top-3 right-3 z-10">
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
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{room.title}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {room.location}
                      {room.province && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {room.province}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-accent text-accent-foreground">
                    <Star className="h-3 w-3 fill-accent-foreground mr-1" /> {room.rating}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="line-clamp-2 text-muted-foreground">
                  {room.description || "Una habitación confortable con todas las comodidades para tu estancia."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <div>
                  <span className="font-bold text-lg">${room.price}</span>
                  <span className="text-muted-foreground text-sm"> / noche</span>
                </div>
                <Button variant="default" size="sm" className="bg-terracotta hover:bg-terracotta/90" asChild>
                  <Link to={`/habitacion/${room.id}`}>Ver detalles</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-terracotta text-terracotta" asChild>
            <Link to="/habitaciones">Ver todas las habitaciones</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedRooms
