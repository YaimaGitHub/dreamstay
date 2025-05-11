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
  available?: boolean // Para compatibilidad con use-data-store.tsx
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
  lastUpdated?: string // Propiedad añadida para tracking de cambios
}

export interface Amenity {
  id: number
  name: string
  icon: string | JSX.Element
  description: string
}

export interface RoomStore {
  rooms: Room[]
  addRoom: (room: Omit<Room, "id">) => void
  updateRoom: (id: number, room: Partial<Room>) => void
  deleteRoom: (id: number) => void
  toggleRoomAvailability: (id: number) => void
  addReservedDates: (id: number, startDate: Date, endDate: Date) => void
}

export interface BookingFormProps {
  roomId: number
  price: number
}
