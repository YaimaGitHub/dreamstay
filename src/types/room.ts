export interface Room {
  id: number
  title: string
  description: string
  location: string
  price: number
  currency?: string
  rating: number
  reviews: number
  image?: string
  type: string
  area: number
  maxGuests: number
  beds: number
  bathrooms: number
  features: string[]
  isAvailable: boolean
  availableDates?: {
    from: Date
    to: Date
  }
  images: {
    id: number
    url: string
    alt: string
  }[]
}
