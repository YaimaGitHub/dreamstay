"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { roomsData as initialRoomsData } from "@/data/rooms"
import { allServices as initialServicesData } from "@/data/services"
import { cubanProvinces } from "@/data/provinces"
import { toast } from "@/components/ui/sonner"
import type { Room } from "@/types/room"
import type { Service } from "@/types/service"
import { generateTypeScriptFiles } from "@/utils/ts-file-export"

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
  setRooms: (rooms: Room[]) => void
  setServices: (services: Service[]) => void
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRoomsState] = useState<Room[]>([])
  const [services, setServicesState] = useState<Service[]>([])
  const [provinces] = useState<string[]>(cubanProvinces)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar datos desde los archivos fuente al inicializar (SIN localStorage)
  useEffect(() => {
    const loadSourceData = () => {
      try {
        console.log("🔄 Cargando datos ÚNICAMENTE desde archivos fuente...")

        // Cargar habitaciones desde rooms.ts con TODOS los campos
        const processedRooms = initialRoomsData.map((room) => {
          const processedRoom = {
            ...room,
            // Asegurar que TODOS los campos estén presentes
            id: room.id,
            title: room.title || "Habitación sin título",
            description: room.description || "",
            location: room.location || "",
            province: room.province || "",
            price: room.price || 0,
            rating: room.rating || 4.5,
            reviews: room.reviews || 0,
            image: room.image || "",
            features: room.features || [],
            type: room.type || "Estándar",
            area: room.area || 25,
            available: room.available !== undefined ? room.available : true,
            isAvailable: room.available !== undefined ? room.available : true,
            lastModified: room.lastUpdated || new Date().toISOString(),
            lastUpdated: room.lastUpdated || new Date().toISOString(),
            // CAMPOS CRÍTICOS que deben cargarse
            whatsappNumber: room.whatsappNumber || "", // WhatsApp del anfitrión
            reservedDates: room.reservedDates ? [...room.reservedDates] : [], // Fechas reservadas
            images: room.images || [],
          }

          // Log detallado de cada habitación cargada
          console.log(`📋 Habitación ${processedRoom.id} cargada:`, {
            title: processedRoom.title,
            whatsappNumber: processedRoom.whatsappNumber,
            reservedDatesCount: processedRoom.reservedDates.length,
            available: processedRoom.available,
            isAvailable: processedRoom.isAvailable,
          })

          // Log específico para campos críticos
          if (processedRoom.whatsappNumber) {
            console.log(`📱 Habitación ${processedRoom.id}: WhatsApp ${processedRoom.whatsappNumber}`)
          }

          if (processedRoom.reservedDates.length > 0) {
            console.log(`📅 Habitación ${processedRoom.id}: ${processedRoom.reservedDates.length} fechas reservadas`)
            processedRoom.reservedDates.forEach((date, index) => {
              console.log(`  📅 Fecha ${index + 1}: ${date.start} - ${date.end}`)
            })
          }

          return processedRoom
        })

        setRoomsState(processedRooms)

        // Cargar servicios desde services.ts
        const processedServices = initialServicesData.map((service) => ({
          ...service,
          icon: undefined,
        }))

        setServicesState(processedServices)

        console.log(
          `✅ Datos cargados desde archivos fuente: ${processedRooms.length} habitaciones, ${processedServices.length} servicios`,
        )

        // Establecer fecha de última actualización
        const lastUpdatedRoom = processedRooms.reduce(
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
        console.error("❌ Error al cargar datos desde archivos fuente:", error)
        toast.error("Error al cargar los datos desde archivos fuente")
      } finally {
        setIsInitialized(true)
      }
    }

    loadSourceData()
  }, [])

  // Función para actualizar la fecha de última modificación
  const updateLastModified = () => {
    const now = new Date()
    setLastUpdated(now)
    return now
  }

  // Función para generar y descargar automáticamente los archivos TypeScript
  const autoGenerateAndDownloadFiles = async (updatedRooms: Room[], updatedServices: Service[]) => {
    try {
      console.log("🚀 GENERANDO AUTOMÁTICAMENTE archivos TypeScript...")
      console.log(`📊 Datos a exportar: ${updatedRooms.length} habitaciones, ${updatedServices.length} servicios`)

      // Log detallado de los datos que se van a exportar
      updatedRooms.forEach((room) => {
        console.log(`📋 Exportando habitación ${room.id}:`, {
          title: room.title,
          whatsappNumber: room.whatsappNumber,
          reservedDatesCount: room.reservedDates?.length || 0,
          available: room.available,
          isAvailable: room.isAvailable,
        })
      })

      // Generar y descargar archivos TypeScript inmediatamente
      const success = await generateTypeScriptFiles(updatedRooms, updatedServices, provinces)

      if (success) {
        console.log("✅ Archivos TypeScript generados y descargados automáticamente")
        toast.success("🎉 Cambios guardados y archivos generados", {
          description: `Los archivos TypeScript han sido descargados automáticamente con ${updatedRooms.length} habitaciones y ${updatedServices.length} servicios`,
          duration: 6000,
        })

        // Mostrar instrucciones críticas
        setTimeout(() => {
          toast.info("🚨 IMPORTANTE: Reemplaza los archivos", {
            description:
              "Reemplaza los archivos descargados en src/data/ y reinicia la aplicación para aplicar los cambios",
            duration: 10000,
          })
        }, 2000)
      }

      return success
    } catch (error) {
      console.error("❌ Error en generación automática:", error)
      toast.error("Error al generar archivos automáticamente")
      return false
    }
  }

  const setRooms = async (newRooms: Room[]) => {
    console.log("🔄 Actualizando habitaciones:", newRooms.length)
    setRoomsState(newRooms)
    updateLastModified()
    // Generar archivos automáticamente
    await autoGenerateAndDownloadFiles(newRooms, services)
  }

  const setServices = async (newServices: Service[]) => {
    console.log("🔄 Actualizando servicios:", newServices.length)
    setServicesState(newServices)
    updateLastModified()
    // Generar archivos automáticamente
    await autoGenerateAndDownloadFiles(rooms, newServices)
  }

  const handleAddRoom = async (room: Omit<Room, "id">) => {
    console.log("➕ AGREGANDO nueva habitación...")
    const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1
    const now = new Date().toISOString()
    const newRoom: Room = {
      ...room,
      id: newId,
      lastUpdated: now,
      available: room.available !== undefined ? room.available : true,
      isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
      reservedDates: room.reservedDates || [],
      images: room.images || [],
      whatsappNumber: room.whatsappNumber || "", // Asegurar que se incluya
    }

    const updatedRooms = [...rooms, newRoom]
    setRoomsState(updatedRooms)
    updateLastModified()

    console.log("📝 Nueva habitación creada:", newRoom)

    // Generar y descargar archivos TypeScript automáticamente
    await autoGenerateAndDownloadFiles(updatedRooms, services)

    console.log("✅ Habitación agregada y archivos TypeScript generados")
  }

  const handleUpdateRoom = async (roomData: Room) => {
    console.log("✏️ ACTUALIZANDO habitación existente...")
    console.log("📝 Datos recibidos para actualización:", {
      id: roomData.id,
      title: roomData.title,
      whatsappNumber: roomData.whatsappNumber,
      reservedDatesCount: roomData.reservedDates?.length || 0,
      available: roomData.available,
      isAvailable: roomData.isAvailable,
    })

    const now = new Date().toISOString()
    const updatedRoom = {
      ...roomData,
      lastUpdated: now,
      available: roomData.available !== undefined ? roomData.available : roomData.isAvailable,
      isAvailable: roomData.isAvailable !== undefined ? roomData.isAvailable : roomData.available,
      // Asegurar que TODOS los campos críticos se preserven
      whatsappNumber: roomData.whatsappNumber || "",
      reservedDates: roomData.reservedDates || [],
      images: roomData.images || [],
    }

    const updatedRooms = rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))

    setRoomsState(updatedRooms)
    updateLastModified()

    console.log("📝 Habitación actualizada:", updatedRoom)

    // Generar y descargar archivos TypeScript automáticamente
    await autoGenerateAndDownloadFiles(updatedRooms, services)

    console.log("✅ Habitación actualizada y archivos TypeScript generados")
  }

  const handleDeleteRoom = async (id: number) => {
    console.log("🗑️ ELIMINANDO habitación:", id)
    const updatedRooms = rooms.filter((room) => room.id !== id)
    setRoomsState(updatedRooms)
    updateLastModified()

    // Generar y descargar archivos TypeScript automáticamente
    await autoGenerateAndDownloadFiles(updatedRooms, services)

    console.log("✅ Habitación eliminada y archivos TypeScript generados")
  }

  const handleToggleRoomAvailability = async (id: number) => {
    console.log("🔄 CAMBIANDO disponibilidad de habitación:", id)
    const now = new Date().toISOString()
    const updatedRooms = rooms.map((room) =>
      room.id === id
        ? {
            ...room,
            available: !room.available,
            isAvailable: !room.available,
            lastUpdated: now,
          }
        : room,
    )

    setRoomsState(updatedRooms)
    updateLastModified()

    // Generar y descargar archivos TypeScript automáticamente
    await autoGenerateAndDownloadFiles(updatedRooms, services)

    console.log("✅ Disponibilidad cambiada y archivos TypeScript generados")
  }

  const handleAddService = async (service: Omit<Service, "id">) => {
    console.log("➕ AGREGANDO nuevo servicio...")
    const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1
    const now = new Date().toISOString()
    const newService: Service = {
      ...service,
      id: newId,
      lastUpdated: now,
      available: service.available !== undefined ? service.available : true,
    }

    const updatedServices = [...services, newService]
    setServicesState(updatedServices)
    updateLastModified()

    // Generar y descargar archivos TypeScript automáticamente
    await autoGenerateAndDownloadFiles(rooms, updatedServices)

    console.log("✅ Servicio agregado y archivos TypeScript generados")
  }

  const handleUpdateService = async (id: number, service: Partial<Service>) => {
    console.log("✏️ ACTUALIZANDO servicio:", id)
    const now = new Date().toISOString()
    const updatedServices = services.map((s) => (s.id === id ? { ...s, ...service, lastUpdated: now } : s))

    setServicesState(updatedServices)
    updateLastModified()

    // Generar y descargar archivos TypeScript automáticamente
    await autoGenerateAndDownloadFiles(rooms, updatedServices)

    console.log("✅ Servicio actualizado y archivos TypeScript generados")
  }

  const handleDeleteService = async (id: number) => {
    console.log("🗑️ ELIMINANDO servicio:", id)
    const updatedServices = services.filter((service) => service.id !== id)
    setServicesState(updatedServices)
    updateLastModified()

    // Generar y descargar archivos TypeScript automáticamente
    await autoGenerateAndDownloadFiles(rooms, updatedServices)

    console.log("✅ Servicio eliminado y archivos TypeScript generados")
  }

  // Exportar todos los datos como JSON
  const exportData = () => {
    const data = {
      rooms,
      services,
      provinces,
      lastUpdated: lastUpdated?.toISOString() || new Date().toISOString(),
      version: "1.0.0",
    }
    return JSON.stringify(data, null, 2)
  }

  // Importar datos desde JSON y generar archivos automáticamente
  const importData = async (jsonData: string): Promise<boolean> => {
    try {
      console.log("📥 IMPORTANDO datos desde JSON...")
      const data = JSON.parse(jsonData)

      let updatedRooms = rooms
      let updatedServices = services

      if (data.rooms && Array.isArray(data.rooms)) {
        console.log(`Importando ${data.rooms.length} habitaciones`)
        // Asegurar que todos los campos se preserven al importar
        const processedRooms = data.rooms.map((room: any) => ({
          ...room,
          whatsappNumber: room.whatsappNumber || "",
          reservedDates: room.reservedDates || [],
          images: room.images || [],
          available: room.available !== undefined ? room.available : true,
          isAvailable: room.isAvailable !== undefined ? room.isAvailable : room.available,
        }))
        setRoomsState(processedRooms)
        updatedRooms = processedRooms
      }

      if (data.services && Array.isArray(data.services)) {
        console.log(`Importando ${data.services.length} servicios`)
        setServicesState(data.services)
        updatedServices = data.services
      }

      updateLastModified()

      // Generar y descargar archivos TypeScript automáticamente
      await autoGenerateAndDownloadFiles(updatedRooms, updatedServices)

      console.log("✅ Datos importados y archivos TypeScript generados")
      return true
    } catch (error) {
      console.error("❌ Error al importar datos:", error)
      toast.error("Error al importar datos", {
        description: "El formato del archivo no es válido",
      })
      return false
    }
  }

  const resetToDefault = async () => {
    console.log("🔄 RESTABLECIENDO a valores por defecto...")
    setRoomsState(initialRoomsData)
    setServicesState(initialServicesData.map((service) => ({ ...service, icon: undefined })))
    updateLastModified()

    // Generar y descargar archivos TypeScript automáticamente
    await autoGenerateAndDownloadFiles(initialRoomsData, initialServicesData)

    console.log("✅ Datos restablecidos y archivos TypeScript generados")
  }

  // Función para exportar archivos TypeScript manualmente
  const exportSourceFiles = async (): Promise<boolean> => {
    try {
      console.log("📁 Exportando archivos TypeScript manualmente...")

      const success = await generateTypeScriptFiles(rooms, services, provinces)

      if (success) {
        toast.success("Archivos TypeScript exportados manualmente", {
          description: "Los archivos se han descargado correctamente",
          duration: 6000,
        })
      }

      return success
    } catch (error) {
      console.error("❌ Error al exportar archivos TypeScript:", error)
      toast.error("Error al exportar los archivos TypeScript")
      return false
    }
  }

  // Generar archivos TypeScript
  const generateTypeScriptFilesManual = async (): Promise<boolean> => {
    return await generateTypeScriptFiles(rooms, services, provinces)
  }

  // Función para obtener vista previa de una habitación con TODOS los datos
  const previewRoom = (id: number) => {
    const room = rooms.find((r) => r.id === id)
    if (!room) return undefined

    console.log(`🔍 Vista previa de habitación ${id}:`, {
      title: room.title,
      whatsappNumber: room.whatsappNumber,
      reservedDatesCount: room.reservedDates?.length || 0,
      available: room.available,
      isAvailable: room.isAvailable,
    })

    return room
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
        generateTypeScriptFiles: generateTypeScriptFilesManual,
        previewRoom,
        setRooms,
        setServices,
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
