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
  lastUpdated: Date | null
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

// Claves para localStorage
const STORAGE_KEYS = {
  ROOMS: "estanciaplus_rooms",
  SERVICES: "estanciaplus_services",
  LAST_UPDATED: "estanciaplus_last_updated",
}

export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        // Intentar cargar habitaciones
        const storedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS)
        if (storedRooms) {
          setRooms(JSON.parse(storedRooms))
        } else {
          setRooms(roomsData)
        }

        // Intentar cargar servicios
        const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES)
        if (storedServices) {
          setServices(JSON.parse(storedServices))
        } else {
          setServices(
            allServices.map((service) => ({
              ...service,
              icon: undefined, // Eliminar los iconos React para el almacenamiento
            })),
          )
        }

        // Cargar fecha de última actualización
        const storedLastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED)
        if (storedLastUpdated) {
          setLastUpdated(new Date(storedLastUpdated))
        }
      } catch (error) {
        console.error("Error al cargar datos desde localStorage:", error)
        resetToDefault()
      }
      setIsInitialized(true)
    }

    loadFromStorage()
  }, [])

  // Guardar cambios en localStorage cuando se actualicen los datos
  useEffect(() => {
    if (!isInitialized) return

    const saveToStorage = () => {
      try {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms))
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))

        const now = new Date()
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, now.toISOString())
        setLastUpdated(now)
      } catch (error) {
        console.error("Error al guardar datos en localStorage:", error)
      }
    }

    saveToStorage()
  }, [rooms, services, isInitialized])

  const resetToDefault = () => {
    setRooms(roomsData)
    setServices(
      allServices.map((service) => ({
        ...service,
        icon: undefined, // Eliminar los iconos React para el almacenamiento
      })),
    )

    // Limpiar localStorage
    localStorage.removeItem(STORAGE_KEYS.ROOMS)
    localStorage.removeItem(STORAGE_KEYS.SERVICES)
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATED)

    const now = new Date()
    setLastUpdated(now)
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
      lastUpdated: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  // Importar datos desde JSON
  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData)
      if (data.rooms && Array.isArray(data.rooms)) {
        setRooms(data.rooms)
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(data.rooms))
      }
      if (data.services && Array.isArray(data.services)) {
        setServices(data.services)
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data.services))
      }

      const now = new Date()
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, now.toISOString())
      setLastUpdated(now)

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
