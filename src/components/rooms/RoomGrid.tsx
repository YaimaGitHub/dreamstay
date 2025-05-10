import RoomCard from "./RoomCard"
import type { Room } from "@/types/room"

interface RoomGridProps {
  rooms: Room[]
}

const RoomGrid = ({ rooms }: RoomGridProps) => {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No se encontraron habitaciones</h3>
        <p className="text-muted-foreground">Intenta con otros filtros de búsqueda</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  )
}

export default RoomGrid
