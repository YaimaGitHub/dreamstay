export interface Room {
  id: number
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  features: string[]
  type: string
  area: number
  description?: string
  isAvailable: boolean
  reservedDates: {
    start: string
    end: string
  }[]
  images?: {
    id: number
    url: string
    alt: string
  }[]
  lastModified?: string
}

export interface Amenity {
  id: number
  name: string
  icon: string
  description: string // Description is required for RoomAmenities component
}

export interface RoomStore {
  rooms: Room[]
  addRoom: (room: Omit<Room, "id">) => void
  updateRoom: (room: Room) => void
  deleteRoom: (id: number) => void
  toggleRoomAvailability: (id: number) => void
  addReservedDates: (id: number, startDate: Date, endDate: Date) => void
}

export interface BookingFormProps {
  roomId: number
  price: number
}
