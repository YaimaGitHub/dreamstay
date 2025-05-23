"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { roomsData as initialRoomsData } from "@/data/rooms"
import { allServices as initialServicesData } from "@/data/services"
import { cubanProvinces } from "@/data/provinces"
import { toast } from "@/components/ui/sonner"
import type { Room } from "@/types/room"
import type { Service } from "@/types/service"
import { addRoom, updateRoom, deleteRoom, toggleRoomAvailability } from "@/utils/room-operations"
import { addService, updateService, deleteService } from "@/utils/service-operations"
import { exportDataAsJson, importDataFromJson } from "@/utils/data-export-utils"
import { generateTypeScriptFiles as generateFiles, autoExportSourceFiles as autoExport } from "@/utils/ts-file-export"

interface DataStoreContextType {
  rooms: Room[]
  services: Service[]
  provinces: string[]
  addRoom: (room: Omit<Room, "id">) => void
  updateRoom: (roomData: Room) => void
  deleteRoom: (id: number) => void
  toggleRoomAvailability: (id: number) => void
  addService: (service: Omit<Service, "id">) => void
  updateService: (id: number, service: Partial<Service>) => void
  deleteService: (id: number) => void
  exportData: () => string
  importData: (jsonData: string) => boolean
  resetToDefault: () => void
  exportSourceFiles: () => Promise<boolean>
  lastUpdated: Date | null
  generateTypeScriptFiles: () => Promise<boolean>
  previewRoom: (id: number) => Room | undefined
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [provinces] = useState<string[]>(cubanProvinces)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({})

  // Initialize with default data
  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Always load data from the imported module files
        // This ensures we're using the most recent data from the TypeScript files
        setRooms(
          initialRoomsData.map((room) => ({
            ...room,
            // Ensure all required fields are present
            lastModified: room.lastUpdated || new Date().toISOString(),
            available: room.available !== undefined ? room.available : true,
            isAvailable: room.available !== undefined ? room.available : true,
            // Ensure reserved dates are maintained and in the correct format
            reservedDates: room.reservedDates ? [...room.reservedDates] : [],
          })),
        )

        setServices(
          initialServicesData.map((service) => ({
            ...service,
            icon: undefined, // Remove React icons for storage
          })),
        )

        console.log(
          `Datos cargados desde archivos fuente: ${initialRoomsData.length} habitaciones, ${initialServicesData.length} servicios`,
        )

        // Verify and log loaded reserved dates
        initialRoomsData.forEach((room) => {
          if (room.reservedDates && room.reservedDates.length > 0) {
            console.log(
              `Habitación ${room.id} - ${room.title}: ${room.reservedDates.length} fechas reservadas cargadas`,
            )
          }
        })

        // Set last updated date based on loaded data
        const lastUpdatedRoom = initialRoomsData.reduce(
          (latest, room) => {
            if (!room.lastUpdated) return latest
            const roomDate = new Date(room.lastUpdated)
            return !latest || roomDate > latest ? roomDate : latest
          },
          null as Date | null,
        )

        if (lastUpdatedRoom) {
          setLastUpdated(lastUpdatedRoom)
        } else {
          updateLastModified()
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast.error("Error al cargar los datos. Utilizando datos de muestra.")
        resetToDefault()
      } finally {
        setIsInitialized(true)
      }
    }

    loadRooms()
  }, [])

  // Function to update the last modified date
  const updateLastModified = () => {
    const now = new Date()
    setLastUpdated(now)
    return now
  }

  const autoExportSourceFilesWrapper = async () => {
    return await autoExport(rooms, services, provinces, () => generateFiles(rooms, services, provinces))
  }

  const resetToDefault = () => {
    setRooms(initialRoomsData)
    setServices(
      initialServicesData.map((service) => ({
        ...service,
        icon: undefined, // Remove React icons for storage
      })),
    )
    updateLastModified()
  }

  // Function to get a preview of a room
  const previewRoom = (id: number) => {
    const room = rooms.find((r) => r.id === id)
    if (!room) return undefined

    // If there are pending changes for this room, apply them to the preview
    if (pendingChanges[`room-${id}`]) {
      return { ...room, ...pendingChanges[`room-${id}`] }
    }

    return room
  }

  const handleAddRoom = (room: Omit<Room, "id">) => {
    addRoom(room, rooms, setRooms, updateLastModified, autoExportSourceFilesWrapper)
  }

  const handleUpdateRoom = (roomData: Room) => {
    updateRoom(roomData, rooms, setRooms, updateLastModified, setPendingChanges, autoExportSourceFilesWrapper)
  }

  const handleDeleteRoom = (id: number) => {
    deleteRoom(id, rooms, setRooms, updateLastModified, setPendingChanges, autoExportSourceFilesWrapper)
  }

  const handleToggleRoomAvailability = (id: number) => {
    toggleRoomAvailability(id, rooms, setRooms, updateLastModified, setPendingChanges, autoExportSourceFilesWrapper)
  }

  const handleAddService = (service: Omit<Service, "id">) => {
    addService(service, services, setServices, updateLastModified, autoExportSourceFilesWrapper)
  }

  const handleUpdateService = (id: number, service: Partial<Service>) => {
    updateService(id, service, services, setServices, updateLastModified, autoExportSourceFilesWrapper)
  }

  const handleDeleteService = (id: number) => {
    deleteService(id, services, setServices, updateLastModified, autoExportSourceFilesWrapper)
  }

  // Export all data as JSON
  const exportData = () => {
    return exportDataAsJson(rooms, services, lastUpdated)
  }

  // Import data from JSON
  const importData = (jsonData: string) => {
    return importDataFromJson(jsonData, setRooms, setServices, updateLastModified, autoExportSourceFilesWrapper)
  }

  // Function to export source files
  const exportSourceFiles = async (): Promise<boolean> => {
    try {
      // Generate TypeScript files
      const success = await generateFiles(rooms, services, provinces)

      if (success) {
        toast.success("Archivos de código fuente exportados correctamente", {
          description:
            "Los cambios se han guardado en los archivos TypeScript. Estos archivos deben reemplazar los originales en tu proyecto.",
        })

        // Show additional instructions
        setTimeout(() => {
          toast.info("Importante: Para que los cambios sean permanentes", {
            description:
              "Reemplaza los archivos originales en tu proyecto con los archivos descargados y reinicia la aplicación.",
            duration: 8000,
          })
        }, 1000)
      }

      return success
    } catch (error) {
      console.error("Error al exportar archivos de código fuente:", error)
      toast.error("Error al exportar los archivos de código fuente")
      return false
    }
  }

  // Generate TypeScript files
  const generateTypeScriptFiles = async (): Promise<boolean> => {
    return await generateFiles(rooms, services, provinces)
  }

  return (
    <DataStoreContext.Provider
      value={{
        rooms,
        services,
        provinces,
        addRoom: handleAddRoom,
        updateRoom: handleUpdateRoom,
        deleteRoom: handleDeleteRoom,
        toggleRoomAvailability: handleToggleRoomAvailability,
        addService: handleAddService,
        updateService: handleUpdateService,
        deleteService: handleDeleteService,
        exportData,
        importData,
        resetToDefault,
        exportSourceFiles,
        lastUpdated,
        generateTypeScriptFiles,
        previewRoom,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  )
}

export const useDataStore = () => {
  const context = useContext(DataStoreContext)
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider")
  }
  return context
}
