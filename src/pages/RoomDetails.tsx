"use client"

import { useParams, useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RoomGallery from "@/components/RoomGallery"
import BookingForm from "@/components/BookingForm"
import RoomAmenities from "@/components/RoomAmenities"
import { Star, MapPin, MessageCircle, ArrowLeft, Home, Users, Bed, Bath, Calendar } from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import type { Room, HostInfo } from "@/types/room"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/utils/host-manager"
import { Card, CardContent } from "@/components/ui/card"

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
        console.log("Room details loaded:", foundRoom)
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
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Función para formatear la información de capacidad
  const formatCapacityInfo = () => {
    // Asegurarse de que capacity existe y tiene valores por defecto si no
    const capacity = room.capacity || { maxGuests: 4, beds: 1, bedrooms: 1, bathrooms: 1 }
    const accommodationType = room.accommodationType || "Habitación en alojamiento entero"

    const parts = [
      `Máximo ${capacity.maxGuests} huéspedes`,
      `${capacity.beds} cama${capacity.beds > 1 ? "s" : ""}`,
      `${capacity.bedrooms} habitación${capacity.bedrooms > 1 ? "es" : ""}`,
      `${capacity.bathrooms} baño${capacity.bathrooms > 1 ? "s" : ""}`,
    ]

    return {
      accommodationType,
      details: parts.join(" • "),
    }
  }

  // Obtener el anfitrión principal
  const getPrimaryHost = (): HostInfo | undefined => {
    if (!room.hosts || room.hosts.length === 0) {
      return {
        id: 0,
        name: "Anfitrión",
        hostSince: new Date().getFullYear().toString(),
        bio: "Anfitrión experimentado con años de experiencia en hospitalidad",
        isPrimary: true,
      }
    }

    return room.hosts.find((host) => host.isPrimary) || room.hosts[0]
  }

  // Obtener anfitriones secundarios
  const getCoHosts = (): HostInfo[] => {
    if (!room.hosts || room.hosts.length <= 1) {
      return []
    }

    return room.hosts.filter((host) => !host.isPrimary)
  }

  const capacityInfo = formatCapacityInfo()
  const primaryHost = getPrimaryHost()
  const coHosts = getCoHosts()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Navegación de regreso */}
        <div className="mb-6 animate-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hover:bg-orange-50 hover:border-orange-200">
              <Link to="/habitaciones" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Regresar a habitaciones</span>
                <span className="sm:hidden">Regresar</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-orange-50">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-orange-600">
                Inicio
              </Link>{" "}
              /{" "}
              <Link to="/habitaciones" className="hover:text-orange-600">
                Habitaciones
              </Link>{" "}
              / <span className="font-medium">{room.title}</span>
            </div>
          </div>
        </div>

        <div className="animate-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl font-bold mb-2">{room.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-orange-400 text-orange-400 mr-1" />
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-in slide-in-from-left-4 duration-700 delay-200">
            {room.images && room.images.length > 0 ? (
              <RoomGallery images={room.images} />
            ) : (
              <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                <img
                  src={room.image || "/placeholder.svg?height=400&width=600"}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mt-8">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 via-white to-orange-50 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-2">
                          <Home className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{capacityInfo.accommodationType}</h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                          <Users className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">{room.capacity?.maxGuests || 4} huéspedes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                          <Bed className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {room.capacity?.beds || 1} cama{(room.capacity?.beds || 1) > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                          <Bath className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">
                            {room.capacity?.bathrooms || 1} baño{(room.capacity?.bathrooms || 1) > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block ml-6">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full shadow-lg">
                        <span className="font-bold text-lg">{room.area} m²</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información del anfitrión */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Conoce a tu anfitrión</h2>
                </div>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                          <AvatarImage src={primaryHost?.avatar || "/placeholder.svg"} alt={primaryHost?.name} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xl font-bold">
                            {getInitials(primaryHost?.name || "Anfitrión")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{primaryHost?.name || "Anfitrión"}</h3>
                          <div className="flex items-center text-orange-700 font-medium">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>
                              Anfitrión desde {primaryHost?.hostSince || new Date().getFullYear()}
                              {primaryHost?.hostSince &&
                              new Date().getFullYear() - Number.parseInt(primaryHost.hostSince) > 0
                                ? ` • ${new Date().getFullYear() - Number.parseInt(primaryHost.hostSince)} años de experiencia`
                                : " • Nuevo anfitrión"}
                            </span>
                          </div>
                        </div>
                        {primaryHost?.bio && (
                          <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-4">
                            <p className="text-gray-700 leading-relaxed">{primaryHost.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mostrar anfitriones adicionales si existen */}
                {coHosts.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Equipo de anfitriones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coHosts.map((host) => (
                        <Card
                          key={host.id}
                          className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border-2 border-orange-200">
                                <AvatarImage src={host.avatar || "/placeholder.svg"} alt={host.name} />
                                <AvatarFallback className="bg-gradient-to-br from-orange-300 to-orange-500 text-white font-semibold">
                                  {getInitials(host.name || "Anfitrión")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{host.name}</p>
                                <p className="text-sm text-orange-600 font-medium">
                                  Desde {host.hostSince || new Date().getFullYear()}
                                </p>
                              </div>
                            </div>
                            {host.bio && (
                              <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">{host.bio}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Acerca de este alojamiento */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Acerca de este alojamiento</h2>
                </div>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                  <CardContent className="p-8">
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line font-light">
                        {room.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detalles del alojamiento */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Detalles del alojamiento</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="p-6 text-center">
                      <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Users className="h-8 w-8 text-orange-600 mx-auto" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{room.capacity?.maxGuests || 4}</p>
                      <p className="text-sm font-medium text-orange-700">Huéspedes máximo</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6 text-center">
                      <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Bed className="h-8 w-8 text-blue-600 mx-auto" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{room.capacity?.beds || 1}</p>
                      <p className="text-sm font-medium text-blue-700">
                        Cama{(room.capacity?.beds || 1) > 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-6 text-center">
                      <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Home className="h-8 w-8 text-green-600 mx-auto" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{room.capacity?.bedrooms || 1}</p>
                      <p className="text-sm font-medium text-green-700">
                        Habitación{(room.capacity?.bedrooms || 1) > 1 ? "es" : ""}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6 text-center">
                      <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Bath className="h-8 w-8 text-purple-600 mx-auto" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{room.capacity?.bathrooms || 1}</p>
                      <p className="text-sm font-medium text-purple-700">
                        Baño{(room.capacity?.bathrooms || 1) > 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Servicios/Características */}
              {room.features && room.features.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Lo que ofrece este lugar</h2>
                  </div>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-8">
                      <RoomAmenities features={room.features} />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 animate-in slide-in-from-right-4 duration-700 delay-300">
            <div className="sticky top-24">
              <BookingForm room={room} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RoomDetails
