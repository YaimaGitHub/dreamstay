"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Bed, Bath, Home, Star, MessageCircle, CheckCircle } from "lucide-react"
import type { Room } from "@/types/room"
import { getInitials } from "@/utils/host-manager"

interface RoomSummaryProps {
  room: Room
}

const RoomSummary = ({ room }: RoomSummaryProps) => {
  const primaryHost = room.hosts?.find((host) => host.isPrimary)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Resumen de la Habitación
        </CardTitle>
        <CardDescription>Vista previa de cómo se mostrará la habitación en la plataforma</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información básica */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{room.title}</h3>
          <p className="text-muted-foreground">{room.location}</p>
          {room.description && <p className="text-sm text-muted-foreground">{room.description}</p>}
        </div>

        {/* Capacidad */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm">{room.capacity?.maxGuests || 4} huéspedes</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-purple-600" />
            <span className="text-sm">
              {room.capacity?.beds || 1} cama{(room.capacity?.beds || 1) > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-orange-600" />
            <span className="text-sm">
              {room.capacity?.bedrooms || 1} cuarto{(room.capacity?.bedrooms || 1) > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              {room.capacity?.bathrooms || 1} baño{(room.capacity?.bathrooms || 1) > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Tipo de alojamiento */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{room.accommodationType || "Habitación en alojamiento entero"}</Badge>
        </div>

        {/* Anfitriones */}
        <div className="space-y-3">
          <h4 className="font-medium">Anfitriones ({room.hosts?.length || 0})</h4>
          <div className="space-y-3">
            {room.hosts?.map((host) => (
              <div key={host.id} className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={host.avatar || "/placeholder.svg"} alt={host.name} />
                  <AvatarFallback className="bg-orange-100 text-orange-800">
                    {getInitials(host.name || "Anfitrión")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{host.name}</span>
                    {host.isPrimary && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Principal
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Anfitrión desde {host.hostSince}</p>
                  {host.bio && <p className="text-xs text-muted-foreground mt-1">{host.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp */}
        {room.hostWhatsApp?.enabled && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp Configurado
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {room.hostWhatsApp.primary && room.hostWhatsApp.sendToPrimary && (
                <p>✓ Notificaciones al anfitrión principal</p>
              )}
              {room.hostWhatsApp.secondary && room.hostWhatsApp.sendToSecondary && (
                <p>✓ Notificaciones al anfitrión secundario</p>
              )}
            </div>
          </div>
        )}

        {/* Precio */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">${room.price}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{room.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RoomSummary
