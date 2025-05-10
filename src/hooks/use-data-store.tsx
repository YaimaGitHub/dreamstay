"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { roomsData } from "@/data/rooms"
import { allServices } from "@/data/services"
import { toast } from "@/components/ui/sonner"

// Tipos de datos
export interface Room {
  id: number
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  features: string[]
  type: string
  area: number
  description?: string
  available?: boolean
  images?: Array<{
    id: number
    url: string
    alt: string
  }>
  amenities?: Array<{
    id: number
    name: string
    description: string
    icon?: React.ReactNode
  }>
}

export interface Service {
  id: number
  title: string
  description: string
  longDescription?: string
  price: number
  category: string
  icon?: React.ReactNode
  features?: string[]
}

interface DataStoreContextType {
  rooms: Room[]
  services: Service[]
  addRoom: (room: Omit<Room, "id">) => void
  updateRoom: (id: number, room: Partial<Room>) => void
  deleteRoom: (id: number) => void
  addService: (service: Omit<Service, "id">) => void
  updateService: (id: number, service: Partial<Service>) => void
  deleteService: (id: number) => void
  exportData: () => string
  importData: (jsonData: string) => boolean
  resetToDefault: () => void
  exportSourceFiles: () => void
  lastUpdated: Date | null
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Inicializar con datos por defecto
  useEffect(() => {
    resetToDefault()
    setIsInitialized(true)
  }, [])

  // Función para actualizar la fecha de última modificación
  const updateLastModified = () => {
    const now = new Date()
    setLastUpdated(now)
    return now
  }

  // Función para generar el código fuente de rooms.ts con el formato exacto requerido
  const generateRoomsSourceCode = (roomsData: Room[]) => {
    // Convertir las habitaciones a un formato que preserve la estructura original
    const formattedRooms = roomsData.map((room) => {
      // Crear una copia para no modificar el original
      const formattedRoom = { ...room }

      // Formatear las características como strings con comillas
      if (formattedRoom.features) {
        formattedRoom.features = formattedRoom.features.map((feature) => `"${feature}"`)
      }

      return formattedRoom
    })

    // Generar el código con el formato adecuado
    let code = `// Archivo generado automáticamente por el panel de administración
// Última actualización: ${new Date().toLocaleString()}

export const roomsData = [\n`

    formattedRooms.forEach((room, index) => {
      code += `  {\n`
      code += `    id: ${room.id},\n`
      code += `    title: "${room.title}",\n`
      code += `    location: "${room.location}",\n`
      code += `    price: ${room.price},\n`
      code += `    rating: ${room.rating},\n`
      code += `    reviews: ${room.reviews},\n`
      code += `    image: "${room.image}",\n`
      code += `    features: [${room.features?.join(", ") || ""}],\n`
      code += `    type: "${room.type}",\n`
      code += `    area: ${room.area},\n`

      if (room.description !== undefined) {
        code += `    description: "${room.description.replace(/"/g, '\\"')}",\n`
      }

      if (room.available !== undefined) {
        code += `    available: ${room.available},\n`
      }

      if (room.images && room.images.length > 0) {
        code += `    images: [\n`
        room.images.forEach((image, imgIndex) => {
          code += `      {\n`
          code += `        id: ${image.id},\n`
          code += `        url: "${image.url}",\n`
          code += `        alt: "${image.alt.replace(/"/g, '\\"')}"\n`
          code += `      }${imgIndex < room.images!.length - 1 ? "," : ""}\n`
        })
        code += `    ],\n`
      }

      if (room.amenities && room.amenities.length > 0) {
        code += `    amenities: [\n`
        room.amenities.forEach((amenity, amenityIndex) => {
          code += `      {\n`
          code += `        id: ${amenity.id},\n`
          code += `        name: "${amenity.name}",\n`
          code += `        description: "${amenity.description.replace(/"/g, '\\"')}"\n`
          code += `      }${amenityIndex < room.amenities!.length - 1 ? "," : ""}\n`
        })
        code += `    ],\n`
      }

      code += `  }${index < formattedRooms.length - 1 ? "," : ""}\n`
    })

    code += `];\n`
    return code
  }

  // Función para generar el código fuente de services.ts con el formato exacto requerido
  const generateServicesSourceCode = (servicesData: Service[]) => {
    // Convertir los servicios a un formato que preserve la estructura original
    const formattedServices = servicesData.map((service) => {
      // Crear una copia para no modificar el original
      const formattedService = { ...service }

      // Formatear las características como strings con comillas
      if (formattedService.features) {
        formattedService.features = formattedService.features.map((feature) => `"${feature}"`)
      }

      return formattedService
    })

    // Generar el código con el formato adecuado
    let code = `// Archivo generado automáticamente por el panel de administración
// Última actualización: ${new Date().toLocaleString()}

import { Utensils, Car, Wifi, MapPin } from 'lucide-react';

export const allServices = [\n`

    formattedServices.forEach((service, index) => {
      code += `  {\n`
      code += `    id: ${service.id},\n`
      code += `    title: "${service.title}",\n`
      code += `    description: "${service.description.replace(/"/g, '\\"')}",\n`

      if (service.longDescription !== undefined) {
        code += `    longDescription: "${service.longDescription.replace(/"/g, '\\"')}",\n`
      }

      code += `    price: ${service.price},\n`
      code += `    category: "${service.category}",\n`

      // Asignar un icono basado en la categoría
      code += `    icon: ${getIconForCategory(service.category)},\n`

      if (service.features && service.features.length > 0) {
        code += `    features: [${service.features.join(", ")}],\n`
      }

      code += `  }${index < formattedServices.length - 1 ? "," : ""}\n`
    })

    code += `];\n`
    return code
  }

  // Función auxiliar para asignar iconos basados en la categoría
  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "gastronomía":
        return "Utensils"
      case "transporte":
        return "Car"
      case "comodidades":
        return "Wifi"
      case "experiencias":
        return "MapPin"
      default:
        return "Wifi"
    }
  }

  // Función para exportar archivos de código fuente
  const exportSourceFiles = () => {
    try {
      // Generar código fuente para rooms.ts
      const roomsSourceCode = generateRoomsSourceCode(rooms)
      const roomsBlob = new Blob([roomsSourceCode], { type: "text/plain" })
      const roomsUrl = URL.createObjectURL(roomsBlob)

      // Generar código fuente para services.ts
      const servicesSourceCode = generateServicesSourceCode(services)
      const servicesBlob = new Blob([servicesSourceCode], { type: "text/plain" })
      const servicesUrl = URL.createObjectURL(servicesBlob)

      // Crear enlaces para descargar los archivos
      const roomsLink = document.createElement("a")
      roomsLink.href = roomsUrl
      roomsLink.download = "rooms.ts"
      roomsLink.style.display = "none"

      const servicesLink = document.createElement("a")
      servicesLink.href = servicesUrl
      servicesLink.download = "services.ts"
      servicesLink.style.display = "none"

      // Añadir enlaces al DOM y hacer clic en ellos
      document.body.appendChild(roomsLink)
      document.body.appendChild(servicesLink)

      roomsLink.click()
      setTimeout(() => {
        servicesLink.click()

        // Limpiar
        document.body.removeChild(roomsLink)
        document.body.removeChild(servicesLink)
        URL.revokeObjectURL(roomsUrl)
        URL.revokeObjectURL(servicesUrl)
      }, 100)

      toast.success("Archivos de código fuente exportados correctamente")
    } catch (error) {
      console.error("Error al exportar archivos de código fuente:", error)
      toast.error("Error al exportar los archivos de código fuente")
    }
  }

  // Función para exportar y actualizar archivos de código fuente automáticamente
  const autoExportSourceFiles = () => {
    try {
      exportSourceFiles()
      toast.success("Cambios guardados y archivos de código fuente actualizados")
    } catch (error) {
      console.error("Error al actualizar archivos de código fuente:", error)
      toast.error("Error al actualizar los archivos de código fuente")
    }
  }

  const resetToDefault = () => {
    setRooms(roomsData)
    setServices(
      allServices.map((service) => ({
        ...service,
        icon: undefined, // Eliminar los iconos React para el almacenamiento
      })),
    )
    updateLastModified()
  }

  // Funciones para gestionar habitaciones
  const addRoom = (room: Omit<Room, "id">) => {
    const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1
    const newRooms = [...rooms, { ...room, id: newId }]
    setRooms(newRooms)
    updateLastModified()
    autoExportSourceFiles()
  }

  const updateRoom = (id: number, roomUpdate: Partial<Room>) => {
    const newRooms = rooms.map((room) => (room.id === id ? { ...room, ...roomUpdate } : room))
    setRooms(newRooms)
    updateLastModified()
    autoExportSourceFiles()
  }

  const deleteRoom = (id: number) => {
    const newRooms = rooms.filter((room) => room.id !== id)
    setRooms(newRooms)
    updateLastModified()
    autoExportSourceFiles()
  }

  // Funciones para gestionar servicios
  const addService = (service: Omit<Service, "id">) => {
    const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1
    const newServices = [...services, { ...service, id: newId }]
    setServices(newServices)
    updateLastModified()
    autoExportSourceFiles()
  }

  const updateService = (id: number, serviceUpdate: Partial<Service>) => {
    const newServices = services.map((service) => (service.id === id ? { ...service, ...serviceUpdate } : service))
    setServices(newServices)
    updateLastModified()
    autoExportSourceFiles()
  }

  const deleteService = (id: number) => {
    const newServices = services.filter((service) => service.id !== id)
    setServices(newServices)
    updateLastModified()
    autoExportSourceFiles()
  }

  // Exportar todos los datos como JSON
  const exportData = () => {
    const data = {
      rooms,
      services,
      lastUpdated: lastUpdated?.toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  // Importar datos desde JSON
  const importData = (jsonData: string) => {
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

  return (
    <DataStoreContext.Provider
      value={{
        rooms,
        services,
        addRoom,
        updateRoom,
        deleteRoom,
        addService,
        updateService,
        deleteService,
        exportData,
        importData,
        resetToDefault,
        exportSourceFiles,
        lastUpdated,
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
