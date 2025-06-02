"use client"

import RoomCard from "./RoomCard"
import type { Room } from "@/types/room"
import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface RoomGridProps {
  rooms: Room[]
}

const RoomGrid = ({ rooms }: RoomGridProps) => {
  const [showOnlyWhatsApp, setShowOnlyWhatsApp] = useState(false)

  // Filtrar habitaciones según el filtro de WhatsApp
  const filteredRooms = showOnlyWhatsApp ? rooms.filter((room) => room.hostWhatsApp?.enabled) : rooms

  if (filteredRooms.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">
          {showOnlyWhatsApp ? "No se encontraron habitaciones con WhatsApp" : "No se encontraron habitaciones"}
        </h3>
        <p className="text-muted-foreground">
          {showOnlyWhatsApp ? "Intenta desactivar el filtro de WhatsApp" : "Intenta con otros filtros de búsqueda"}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Filtro de WhatsApp */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Checkbox id="whatsapp-filter" checked={showOnlyWhatsApp} onCheckedChange={setShowOnlyWhatsApp} />
          <label
            htmlFor="whatsapp-filter"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <MessageCircle className="h-4 w-4 text-green-600" />
            Solo habitaciones con WhatsApp
          </label>
        </div>

        {/* Contador de habitaciones con WhatsApp */}
        <div className="text-sm text-muted-foreground">
          {rooms.filter((room) => room.hostWhatsApp?.enabled).length} de {rooms.length} habitaciones tienen WhatsApp
        </div>
      </div>

      {/* Grid de habitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  )
}

export default RoomGrid
