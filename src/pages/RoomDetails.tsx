"use client"

import { useParams, useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RoomGallery from "@/components/RoomGallery"
import BookingForm from "@/components/BookingForm"
import RoomAmenities, { sampleAmenities } from "@/components/RoomAmenities"
import AdditionalServices, { sampleServices } from "@/components/AdditionalServices"
import { Star, User, MapPin } from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { rooms } = useDataStore()

  // Buscar la habitación por ID
  const roomData = rooms.find((room) => room.id === Number(id))

  // Si no se encuentra la habitación, redirigir a la lista de habitaciones
  if (!roomData) {
    // Usar setTimeout para evitar problemas con el renderizado
    setTimeout(() => navigate("/habitaciones"), 0)
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">{roomData.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-terracotta text-terracotta mr-1" />
            <span className="font-medium mr-1">{roomData.rating}</span>
            <span className="text-muted-foreground">({roomData.reviews} reseñas)</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{roomData.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RoomGallery
              images={
                roomData.images || [
                  {
                    id: 1,
                    url: roomData.image,
                    alt: `Vista principal de ${roomData.title}`,
                  },
                ]
              }
            />

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
                    <p className="font-medium">María González</p>
                    <p className="text-sm text-muted-foreground">Anfitrión desde 2019</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg mb-4">
                  {roomData.description ||
                    "Una habitación confortable y acogedora, perfecta para viajeros que buscan calidad a buen precio. Cuenta con todas las comodidades esenciales para una estancia agradable."}
                </p>
              </div>

              <div className="mb-10">
                <RoomAmenities amenities={roomData.amenities || sampleAmenities} />
              </div>

              <div className="mb-8">
                <AdditionalServices services={sampleServices} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingForm roomId={roomData.id} price={roomData.price} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RoomDetails
