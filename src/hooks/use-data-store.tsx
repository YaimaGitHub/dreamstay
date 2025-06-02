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
        console.log("=== CRITICAL: Loading rooms data ===")
        console.log("Raw initial rooms data:", initialRoomsData)

        // Verificar cada habitación individualmente
        initialRoomsData.forEach((room, index) => {
          console.log(`\n--- Room ${index + 1} (ID: ${room.id}) ---`)
          console.log("Title:", room.title)
          console.log("Base price:", room.price)
          console.log("Raw pricing data:", room.pricing)
          console.log("Raw WhatsApp data:", room.hostWhatsApp)
          console.log("Raw reserved dates:", room.reservedDates)

          if (room.pricing) {
            console.log("✅ HAS PRICING CONFIG")
            if (room.pricing.nationalTourism) {
              console.log("  National Tourism:", room.pricing.nationalTourism)
              console.log("    Enabled:", room.pricing.nationalTourism.enabled)
              console.log("    Nightly rate:", room.pricing.nationalTourism.nightlyRate)
              console.log("    Hourly rate:", room.pricing.nationalTourism.hourlyRate)
            }
            if (room.pricing.internationalTourism) {
              console.log("  International Tourism:", room.pricing.internationalTourism)
              console.log("    Enabled:", room.pricing.internationalTourism.enabled)
              console.log("    Nightly rate:", room.pricing.internationalTourism.nightlyRate)
            }
          } else {
            console.log("❌ NO PRICING CONFIG")
          }

          if (room.hostWhatsApp) {
            console.log("✅ HAS WHATSAPP CONFIG")
            console.log("  Enabled:", room.hostWhatsApp.enabled)
            console.log("  Primary:", room.hostWhatsApp.primary)
            console.log("  Secondary:", room.hostWhatsApp.secondary)
            console.log("  Send to Primary:", room.hostWhatsApp.sendToPrimary)
            console.log("  Send to Secondary:", room.hostWhatsApp.sendToSecondary)
          } else {
            console.log("❌ NO WHATSAPP CONFIG")
          }

          if (room.reservedDates && room.reservedDates.length > 0) {
            console.log("✅ HAS RESERVED DATES")
            console.log("  Dates:", room.reservedDates)
          } else {
            console.log("❌ NO RESERVED DATES")
          }
        })

        // Process rooms with EXACT preservation of all data
        const loadedRooms = initialRoomsData.map((room) => {
          const processedRoom = {
            ...room,
            // Ensure all required fields are present
            lastModified: room.lastUpdated || new Date().toISOString(),
            available: room.available !== undefined ? room.available : true,
            isAvailable: room.available !== undefined ? room.available : true,
            // CRITICAL: Preserve reserved dates EXACTLY as they come from the file
            reservedDates: room.reservedDates ? [...room.reservedDates] : [],
            // CRITICAL: Preserve pricing data EXACTLY as it comes from the file
            pricing: room.pricing,
            // CRITICAL: Preserve WhatsApp configuration EXACTLY as it comes from the file
            hostWhatsApp: room.hostWhatsApp
              ? {
                  enabled: room.hostWhatsApp.enabled,
                  primary: room.hostWhatsApp.primary || "",
                  secondary: room.hostWhatsApp.secondary || "",
                  sendToPrimary: room.hostWhatsApp.sendToPrimary ?? true,
                  sendToSecondary: room.hostWhatsApp.sendToSecondary ?? false,
                }
              : undefined,
          }

          console.log(`\nProcessed room ${room.id}:`)
          console.log("  Final pricing:", processedRoom.pricing)
          console.log("  Final WhatsApp:", processedRoom.hostWhatsApp)
          console.log("  Final reserved dates:", processedRoom.reservedDates)

          return processedRoom
        })

        console.log("\n=== FINAL PROCESSED ROOMS ===")
        loadedRooms.forEach((room) => {
          if (room.pricing) {
            console.log(`Room ${room.id} - HAS PRICING:`, room.pricing)
          } else {
            console.log(`Room ${room.id} - NO PRICING`)
          }

          if (room.hostWhatsApp) {
            console.log(`Room ${room.id} - HAS WHATSAPP:`, room.hostWhatsApp)
          } else {
            console.log(`Room ${room.id} - NO WHATSAPP`)
          }

          if (room.reservedDates && room.reservedDates.length > 0) {
            console.log(`Room ${room.id} - HAS RESERVED DATES:`, room.reservedDates)
          } else {
            console.log(`Room ${room.id} - NO RESERVED DATES`)
          }
        })

        setRooms(loadedRooms)

        setServices(
          initialServicesData.map((service) => ({
            ...service,
            icon: undefined, // Remove React icons for storage
          })),
        )

        console.log(
          `\n✅ DATOS CARGADOS: ${initialRoomsData.length} habitaciones, ${initialServicesData.length} servicios`,
        )

        // Verify all data after setting state
        setTimeout(() => {
          console.log("\n=== VERIFICATION AFTER STATE UPDATE ===")
          loadedRooms.forEach((room) => {
            if (room.pricing) {
              console.log(`✅ Room ${room.id} - Pricing verified:`, room.pricing)
            }
            if (room.hostWhatsApp) {
              console.log(`✅ Room ${room.id} - WhatsApp verified:`, room.hostWhatsApp)
            }
            if (room.reservedDates && room.reservedDates.length > 0) {
              console.log(`✅ Room ${room.id} - Reserved dates verified:`, room.reservedDates)
            }
          })
        }, 100)

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

        console.log("=== ROOMS LOADING COMPLETED ===")
      } catch (error) {
        console.error("❌ ERROR AL CARGAR DATOS:", error)
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
    console.log("=== CRITICAL: Updating room ===")
    console.log("Room data received:", roomData)
    console.log("Room pricing received:", roomData.pricing)
    console.log("Room WhatsApp received:", roomData.hostWhatsApp)
    console.log("Room reserved dates received:", roomData.reservedDates)

    // Preserve ALL data EXACTLY as received
    const updatedRoom = {
      ...roomData,
      lastUpdated: new Date().toISOString(),
      // CRITICAL: Preserve pricing EXACTLY as received
      pricing: roomData.pricing,
      // CRITICAL: Preserve WhatsApp EXACTLY as received
      hostWhatsApp: roomData.hostWhatsApp,
      // CRITICAL: Preserve reserved dates EXACTLY as received
      reservedDates: roomData.reservedDates,
    }

    console.log("Final updated room:", updatedRoom)
    console.log("Final pricing structure:", updatedRoom.pricing)
    console.log("Final WhatsApp structure:", updatedRoom.hostWhatsApp)
    console.log("Final reserved dates structure:", updatedRoom.reservedDates)

    updateRoom(updatedRoom, rooms, setRooms, updateLastModified, setPendingChanges, autoExportSourceFilesWrapper)
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
