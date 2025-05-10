export interface Room {
  id: number
  title: string
  type: string
  description: string
  price: number
  capacity: number
  size: number
  image: string
  images: string[]
  features: string[]
  isAvailable: boolean
  reservedDates: {
    start: string
    end: string
  }[]
  lastModified?: string
}

export interface RoomStore {
  rooms: Room[]
  addRoom: (room: Omit<Room, "id">) => void
  updateRoom: (room: Room) => void
  deleteRoom: (id: number) => void
  toggleRoomAvailability: (id: number) => void
  addReservedDates: (id: number, startDate: Date, endDate: Date) => void
  exportData: () => boolean
  importData: () => Promise<boolean>
  saveToFile: () => Promise<boolean>
  checkForChanges: () => Promise<boolean>
  syncStatus: "synced" | "syncing" | "error"
  lastModified: Date | null
  isOnline?: boolean
  setFilePath?: (path: string) => Promise<boolean>
}
