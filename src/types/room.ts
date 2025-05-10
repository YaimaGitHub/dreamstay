export interface Room {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  features: string[]
  images: string[]
  bookedDates: Date[]
}

export interface BookingFormData {
  fullName: string
  age: number
  gender: "male" | "female" | "other"
  checkIn: Date
  checkOut: Date
  arrivalDate: Date
  needsPickup: boolean
  flightNumber?: string
  email: string
  phone: string
  comments?: string
  adults: number
  children: number
  babies: number
  paymentMethod: "cash" | "transfer"
  currency?: string
}
