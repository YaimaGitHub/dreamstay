"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RoomGallery from "@/components/RoomGallery"
import BookingForm from "@/components/BookingForm"
import RoomAmenities from "@/components/RoomAmenities"
import { Star, User, MapPin, MessageCircle } from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import type { Room } from "@/types/room"
import { Badge } from "@/components/ui/badge"
import RoomPricing from "@/components/rooms/RoomPricing"

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { rooms } = useDataStore()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    if (rooms && id) {
      const roomId = Number.parseInt(id)
      const foundRoom = rooms.find((r) => r.id === roomId)

      if (foundRoom) {
        setRoom(foundRoom)
      } else {
        // Redirigir a página 404 o a la lista de habitaciones si no se encuentra
        navigate("/habitaciones")
      }
    }
  }, [id, rooms, navigate])

  if (!room) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 px-4">
          <p>Cargando información de la habitación...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">{room.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-terracotta text-terracotta mr-1" />
            <span className="font-medium mr-1">{room.rating}</span>
            <span className="text-muted-foreground">({room.reviews} reseñas)</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{room.location}</span>
            {room.province && (
              <Badge variant="outline" className="ml-2">
                {room.province}
              </Badge>
            )}
          </div>
          {/* Indicador de WhatsApp disponible */}
          {room.hostWhatsApp?.enabled && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Reserva instantánea por WhatsApp</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {room.images && room.images.length > 0 ? (
              <RoomGallery images={room.images} />
            ) : (
              <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                <img src={room.image || "/placeholder.svg"} alt={room.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between pb-4 border-b mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Habitación en alojamiento entero</h2>
                  <p className="text-muted-foreground">Máximo 2 huéspedes • 1 cama • 1 baño</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-deepblue flex items-center justify-center text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="ml-2">
                    <p className="font-medium">Eliezer</p>
                    <p className="text-sm text-muted-foreground">Anfitrión desde 2017</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg mb-4">{room.description || "Sin descripción disponible"}</p>

                {room.province && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Ubicación</h3>
                    <p>
                      Esta habitación se encuentra en la provincia de <strong>{room.province}</strong>, en{" "}
                      {room.location}.
                    </p>
                  </div>
                )}

                {/* Información de WhatsApp si está habilitado */}
                {room.hostWhatsApp?.enabled && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium text-green-800">Reserva Rápida por WhatsApp</h3>
                    </div>
                    <p className="text-green-700 text-sm">
                      Esta habitación ofrece reserva instantánea por WhatsApp. Tu solicitud será enviada directamente a
                      los anfitriones para una respuesta rápida.
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-10">
                <RoomAmenities amenities={room.features} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="mb-4">
                  <RoomPricing room={room} showLabel={true} />
                </div>
                <BookingForm roomId={room.id} price={room.price} room={room} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RoomDetails
