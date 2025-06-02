import type React from "react"

export interface PricingOption {
  enabled: boolean
  price: number
}

export interface TourismPricing {
  enabled: boolean
  nightlyRate: PricingOption
  hourlyRate?: PricingOption
}

export interface RoomPricing {
  nationalTourism?: TourismPricing
  internationalTourism?: TourismPricing
}

export interface Room {
  id: number
  title: string
  location: string
  province?: string
  price: number // Precio base (se mantiene para compatibilidad)
  rating: number
  reviews: number
  image: string
  features: string[]
  type: string
  area: number
  description?: string
  available?: boolean
  isAvailable?: boolean
  lastModified?: string
  lastUpdated?: string
  pricing?: RoomPricing
  images?: Array<{
    id: number
    url: string
    alt: string
  }>
  amenities?: Array<{
    id: number
    name: string
    description: string
    icon?: React.ReactNode
  }>
  reservedDates?: Array<{
    start: string
    end: string
  }>
  hostWhatsApp?: {
    primary: string
    secondary?: string
    enabled: boolean
    sendToPrimary?: boolean
    sendToSecondary?: boolean
  }
}

export interface RoomStore {
  rooms: Room[]
  addRoom: (room: Omit<Room, "id">) => void
  updateRoom: (room: Room) => void
  deleteRoom: (id: number) => void
  toggleRoomAvailability: (id: number) => void
  addReservedDates: (id: number, startDate: Date, endDate: Date) => void
}

export interface Amenity {
  id?: number
  title: string
  description: string
  icon?: string
}
