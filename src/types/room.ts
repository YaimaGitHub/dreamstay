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
  reloadFromFile: () => Promise<boolean>
  syncStatus: "synced" | "syncing" | "error"
  lastModified: Date | null
  isOnline?: boolean
  isLoading?: boolean
  loadError?: string | null
  savedFilePath?: string | null
  setFilePath?: (path: string) => Promise<boolean>

  // Nuevas funcionalidades
  backupConfigurations?: (backupName: string) => boolean
  restoreFromBackup?: (backupName: string) => boolean
  getBackupsList?: () => Array<{ name: string; date: Date; size: string }>
  autoSaveEnabled?: boolean
  toggleAutoSave?: (enabled: boolean) => void
}

export interface ConfigBackup {
  name: string
  date: Date
  data: Room[]
  size: string
}
