"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { roomsData } from "@/data/rooms"
import { allServices } from "@/data/services"

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
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [services, setServices] = useState<Service[]>([])

  // Inicializar con datos por defecto
  useEffect(() => {
    resetToDefault()
  }, [])

  const resetToDefault = () => {
    setRooms(roomsData)
    setServices(
      allServices.map((service) => ({
        ...service,
        icon: undefined, // Eliminar los iconos React para el almacenamiento
      })),
    )
  }

  // Funciones para gestionar habitaciones
  const addRoom = (room: Omit<Room, "id">) => {
    const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1
    setRooms([...rooms, { ...room, id: newId }])
  }

  const updateRoom = (id: number, roomUpdate: Partial<Room>) => {
    setRooms(rooms.map((room) => (room.id === id ? { ...room, ...roomUpdate } : room)))
  }

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter((room) => room.id !== id))
  }

  // Funciones para gestionar servicios
  const addService = (service: Omit<Service, "id">) => {
    const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1
    setServices([...services, { ...service, id: newId }])
  }

  const updateService = (id: number, serviceUpdate: Partial<Service>) => {
    setServices(services.map((service) => (service.id === id ? { ...service, ...serviceUpdate } : service)))
  }

  const deleteService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
  }

  // Exportar todos los datos como JSON
  const exportData = () => {
    const data = {
      rooms,
      services,
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
