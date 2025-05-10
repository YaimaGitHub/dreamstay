export interface Room {
  id: number
  title: string
  type: string
  price: number
  capacity: number
  description: string
  image: string
  images: string[]
  features: string[]
  isAvailable: boolean
  reservedDates: {
    start: string
    end: string
  }[]
  lastModified: string
}

export interface RoomStore {
  rooms: Room[]
  addRoom: (room: Omit<Room, "id">) => void
  updateRoom: (room: Room) => void
  deleteRoom: (id: number) => void
  toggleRoomAvailability: (id: number) => void
  addReservedDates: (id: number, startDate: Date, endDate: Date) => void
  // Nuevas funciones para manejar el archivo salva.json
  exportData?: () => void
  importData?: () => Promise<boolean>
  saveToFile?: () => Promise<boolean>
  isAutoSaveEnabled?: boolean
}
