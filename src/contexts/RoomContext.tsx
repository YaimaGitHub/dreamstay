"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Room } from "@/types/room"

// Datos iniciales de habitaciones
const initialRooms: Room[] = [
  {
    id: 1,
    title: "Suite Premium",
    description:
      "Disfruta de una lujosa suite con vista panorámica a la ciudad. Esta espaciosa habitación cuenta con una cama king size, baño completo con bañera y ducha, y todas las comodidades que necesitas para una estancia perfecta.",
    location: "Centro de la ciudad",
    price: 120,
    currency: "USD",
    rating: 4.9,
    reviews: 124,
    type: "Suite",
    area: 35,
    maxGuests: 2,
    beds: 1,
    bathrooms: 1,
    features: ["Baño privado", "WiFi gratis", "Desayuno incluido"],
    isAvailable: true,
    availableDates: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: "Vista principal de la Suite Premium",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
        alt: "Baño de la habitación",
      },
    ],
  },
  {
    id: 2,
    title: "Habitación Confort",
    description:
      "Una habitación acogedora y confortable con todas las comodidades necesarias para una estancia agradable.",
    location: "Zona Turística",
    price: 85,
    currency: "USD",
    rating: 4.7,
    reviews: 95,
    type: "Estándar",
    area: 25,
    maxGuests: 2,
    beds: 1,
    bathrooms: 1,
    features: ["Baño privado", "WiFi gratis", "TV de pantalla plana"],
    isAvailable: true,
    availableDates: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        alt: "Habitación Confort",
      },
    ],
  },
  {
    id: 3,
    title: "Suite Ejecutiva",
    description:
      "Perfecta para viajeros de negocios, esta suite cuenta con un área de trabajo y todas las comodidades para una estancia productiva.",
    location: "Distrito Financiero",
    price: 150,
    currency: "USD",
    rating: 5.0,
    reviews: 87,
    type: "Suite",
    area: 40,
    maxGuests: 2,
    beds: 1,
    bathrooms: 1,
    features: ["Baño de lujo", "WiFi de alta velocidad", "Desayuno gourmet"],
    isAvailable: true,
    availableDates: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        alt: "Suite Ejecutiva",
      },
    ],
  },
]

// Clave para almacenar los datos en localStorage
const STORAGE_KEY = "estanciaplus_admin_data"

// Definir el tipo para el contexto
interface RoomContextType {
  rooms: Room[]
  addRoom: (room: Room) => void
  updateRoom: (room: Room) => void
  deleteRoom: (id: number) => void
  importRooms: (rooms: Room[]) => void
  checkAvailability: (roomId: number, checkIn: Date, checkOut: Date) => boolean
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: (value: boolean) => void
  saveChanges: () => void
  lastSaveTime: string | null
}

// Crear el contexto
const RoomContext = createContext<RoomContextType | undefined>(undefined)

// Proveedor del contexto
export const RoomProvider = ({ children }: { children: ReactNode }) => {
  // Cargar datos desde localStorage o usar datos iniciales
  const loadInitialData = (): Room[] => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Convertir las fechas de string a Date
        return parsedData.map((room: any) => ({
          ...room,
          availableDates: room.availableDates
            ? {
                from: new Date(room.availableDates.from),
                to: new Date(room.availableDates.to),
              }
            : undefined,
        }))
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
    return initialRooms
  }

  const [rooms, setRooms] = useState<Room[]>(loadInitialData)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<string | null>(localStorage.getItem("lastSaveTime") || null)

  // Añadir una nueva habitación
  const addRoom = (room: Room) => {
    setRooms((prevRooms) => [...prevRooms, room])
    setHasUnsavedChanges(true)
  }

  // Actualizar una habitación existente
  const updateRoom = (updatedRoom: Room) => {
    setRooms((prevRooms) => prevRooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)))
    setHasUnsavedChanges(true)
  }

  // Eliminar una habitación
  const deleteRoom = (id: number) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id))
    setHasUnsavedChanges(true)
  }

  // Importar habitaciones (reemplazar todas)
  const importRooms = (importedRooms: Room[]) => {
    setRooms(importedRooms)
    setHasUnsavedChanges(true)
  }

  // Guardar cambios en localStorage
  const saveChanges = () => {
    try {
      // Preparar datos para guardar (convertir fechas a formato ISO)
      const dataToSave = rooms.map((room) => ({
        ...room,
        availableDates: {
          from: room.availableDates?.from?.toISOString(),
          to: room.availableDates?.to?.toISOString(),
        },
      }))

      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))

      // Actualizar estado
      setHasUnsavedChanges(false)
      const currentTime = new Date().toLocaleString()
      setLastSaveTime(currentTime)
      localStorage.setItem("lastSaveTime", currentTime)

      return true
    } catch (error) {
      console.error("Error saving data:", error)
      return false
    }
  }

  // Verificar disponibilidad de una habitación
  const checkAvailability = (roomId: number, checkIn: Date, checkOut: Date) => {
    const room = rooms.find((r) => r.id === roomId)

    if (!room || !room.isAvailable) {
      return false
    }

    // Verificar si la habitación tiene fechas de disponibilidad definidas
    if (room.availableDates) {
      const { from, to } = room.availableDates

      // Verificar si las fechas solicitadas están dentro del rango de disponibilidad
      if (checkIn < from || checkOut > to) {
        return false
      }
    }

    // Aquí se podría añadir lógica adicional para verificar reservas existentes

    return true
  }

  return (
    <RoomContext.Provider
      value={{
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        importRooms,
        checkAvailability,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        saveChanges,
        lastSaveTime,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useRooms = () => {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRooms must be used within a RoomProvider")
  }
  return context
}
