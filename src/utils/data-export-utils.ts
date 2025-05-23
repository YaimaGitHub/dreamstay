import type { Room } from "@/types/room"
import type { Service } from "@/types/service"

// Function to export all data as JSON
export const exportDataAsJson = (rooms: Room[], services: Service[], lastUpdated: Date | null) => {
  const data = {
    rooms,
    services,
    lastUpdated: lastUpdated?.toISOString(),
  }
  return JSON.stringify(data, null, 2)
}

// Function to import data from JSON
export const importDataFromJson = (
  jsonData: string,
  setRooms: (rooms: Room[]) => void,
  setServices: (services: Service[]) => void,
  updateLastModified: () => Date,
  autoExportSourceFiles: () => boolean,
): boolean => {
  try {
    const data = JSON.parse(jsonData)
    if (data.rooms && Array.isArray(data.rooms)) {
      setRooms(data.rooms)
    }
    if (data.services && Array.isArray(data.services)) {
      setServices(data.services)
    }

    updateLastModified()
    autoExportSourceFiles()

    return true
  } catch (error) {
    console.error("Error al importar datos:", error)
    return false
  }
}
