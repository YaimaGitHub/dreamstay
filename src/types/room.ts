export interface Room {
  id: number
  title: string
  type: string
  price: number
  capacity: number
  size: number
  image: string
  images: string[]
  description: string
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
  // Funciones para manejar el archivo salva.json
  exportData: () => void
  importData: () => Promise<boolean>
  saveToFile: () => Promise<boolean>
  checkForChanges: () => Promise<boolean>
  setFilePath?: (path: string) => Promise<boolean>
  syncStatus: "synced" | "syncing" | "error" | "offline"
  lastModified: Date | null
  filePath?: string
  isOnline?: boolean
}
