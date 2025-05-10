import type { Room } from "@/types/room"
import { Gallery } from "./room/Gallery"
import { RoomInfo } from "./room/RoomInfo"
import { BookingCard } from "./room/BookingCard"

interface RoomDetailProps {
  room: Room
}

export function RoomDetail({ room }: RoomDetailProps) {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Images and details */}
        <div className="md:col-span-2 space-y-6">
          {/* Image gallery */}
          <Gallery room={room} />

          {/* Room details */}
          <RoomInfo room={room} />
        </div>

        {/* Booking */}
        <div>
          <BookingCard room={room} />
        </div>
      </div>
    </div>
  )
}
