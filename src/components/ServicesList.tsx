"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Car, Wifi, Utensils, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { useDataStore } from "@/hooks/use-data-store"

const ServicesList = () => {
  const { services } = useDataStore()
  const [featuredServices, setFeaturedServices] = useState([])

  useEffect(() => {
    if (services && services.length > 0) {
      // Mostrar solo los primeros 6 servicios
      setFeaturedServices(services.slice(0, 6))
    }
  }, [services])

  // Función para obtener el icono según la categoría
  const getServiceIcon = (category) => {
    switch (category.toLowerCase()) {
      case "transporte":
        return <Car className="h-8 w-8 text-terracotta" />
      case "gastronomía":
        return <Utensils className="h-8 w-8 text-terracotta" />
      case "comodidades":
        return <Wifi className="h-8 w-8 text-terracotta" />
      case "experiencias":
        return <MapPin className="h-8 w-8 text-terracotta" />
      default:
        return <Plane className="h-8 w-8 text-terracotta" />
    }
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Servicios Adicionales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personaliza tu estancia con nuestros servicios adicionales diseñados para hacer tu experiencia inolvidable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <Card key={service.id} className="card-hover border border-border/50 bg-card">
              <CardHeader>
                <div className="mb-3">{getServiceIcon(service.category)}</div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="font-bold">${service.price}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-terracotta text-terracotta hover:bg-terracotta/10"
                >
                  Añadir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="default" className="bg-terracotta hover:bg-terracotta/90" asChild>
            <Link to="/servicios">Ver todos los servicios</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ServicesList
