"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Room } from "@/types/room"
import { useToast } from "@/hooks/use-toast"

// Definir la interfaz para el contexto de configuración
interface ConfigContextType {
  rooms: Room[]
  hasUnsavedChanges: boolean
  setRooms: (rooms: Room[]) => void
  addRoom: (room: Room) => void
  updateRoom: (id: string, updatedRoom: Room) => void
  deleteRoom: (id: string) => void
  saveChanges: () => void
  exportConfig: () => void
  importConfig: (configData: string) => boolean
  lastSaved: Date | null
}

// Crear el contexto
const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

// Datos iniciales de habitaciones (se pueden cargar desde un archivo estático si es necesario)
const initialRooms: Room[] = [
  {
    id: "1",
    name: "Suite Deluxe",
    description: "Una habitación espaciosa con vistas al mar",
    price: 200,
    currency: "USD",
    capacity: 2,
    size: 40,
    images: ["/images/rooms/deluxe-1.jpg", "/images/rooms/deluxe-2.jpg", "/images/rooms/deluxe-3.jpg"],
    amenities: ["TV", "WiFi", "Minibar", "Aire acondicionado"],
    availableDates: {
      start: new Date().toISOString(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    },
    featured: true,
  },
  {
    id: "2",
    name: "Habitación Estándar",
    description: "Cómoda habitación con todas las comodidades básicas",
    price: 120,
    currency: "USD",
    capacity: 2,
    size: 30,
    images: ["/images/rooms/standard-1.jpg", "/images/rooms/standard-2.jpg"],
    amenities: ["TV", "WiFi", "Aire acondicionado"],
    availableDates: {
      start: new Date().toISOString(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    },
    featured: false,
  },
]

// Nombre del archivo de configuración en localStorage
const CONFIG_STORAGE_KEY = "hotelRoomsConfig"

// Proveedor del contexto de configuración
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRoomsState] = useState<Room[]>(initialRooms)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig)
        if (parsedConfig.rooms && Array.isArray(parsedConfig.rooms)) {
          setRoomsState(parsedConfig.rooms)
          if (parsedConfig.lastSaved) {
            setLastSaved(new Date(parsedConfig.lastSaved))
          }
          setHasUnsavedChanges(false)
        }
      } catch (error) {
        console.error("Error parsing stored config:", error)
      }
    }
  }, [])

  // Función para actualizar las habitaciones
  const setRooms = (newRooms: Room[]) => {
    setRoomsState(newRooms)
    setHasUnsavedChanges(true)
  }

  // Función para añadir una habitación
  const addRoom = (room: Room) => {
    setRoomsState((prevRooms) => [...prevRooms, room])
    setHasUnsavedChanges(true)
  }

  // Función para actualizar una habitación
  const updateRoom = (id: string, updatedRoom: Room) => {
    setRoomsState((prevRooms) => prevRooms.map((room) => (room.id === id ? updatedRoom : room)))
    setHasUnsavedChanges(true)
  }

  // Función para eliminar una habitación
  const deleteRoom = (id: string) => {
    setRoomsState((prevRooms) => prevRooms.filter((room) => room.id !== id))
    setHasUnsavedChanges(true)
  }

  // Función para guardar cambios en localStorage
  const saveChanges = () => {
    const now = new Date()
    const configData = {
      rooms,
      lastSaved: now.toISOString(),
    }

    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configData))
    setLastSaved(now)
    setHasUnsavedChanges(false)

    toast({
      title: "Cambios guardados",
      description: `Configuración guardada correctamente: ${now.toLocaleString()}`,
    })
  }

  // Función para exportar la configuración a un archivo
  const exportConfig = () => {
    const now = new Date()
    const configData = {
      rooms,
      exportDate: now.toISOString(),
      version: "1.0",
    }

    const dataStr = JSON.stringify(configData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `estanciaplus_config_${now.toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Configuración exportada",
      description: `Archivo generado: ${exportFileDefaultName}`,
    })
  }

  // Función para importar la configuración desde un archivo
  const importConfig = (configData: string): boolean => {
    try {
      const parsedConfig = JSON.parse(configData)

      if (!parsedConfig.rooms || !Array.isArray(parsedConfig.rooms)) {
        toast({
          title: "Error de importación",
          description: "El archivo no contiene datos de habitaciones válidos",
          variant: "destructive",
        })
        return false
      }

      // Validar cada habitación
      const validRooms = parsedConfig.rooms.every((room: any) => room.id && room.name && typeof room.price === "number")

      if (!validRooms) {
        toast({
          title: "Error de importación",
          description: "Algunas habitaciones en el archivo no son válidas",
          variant: "destructive",
        })
        return false
      }

      // Actualizar las habitaciones
      setRoomsState(parsedConfig.rooms)

      // Guardar inmediatamente la configuración importada
      const now = new Date()
      const newConfigData = {
        rooms: parsedConfig.rooms,
        lastSaved: now.toISOString(),
      }

      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfigData))
      setLastSaved(now)
      setHasUnsavedChanges(false)

      toast({
        title: "Importación exitosa",
        description: `Se importaron ${parsedConfig.rooms.length} habitaciones`,
      })

      return true
    } catch (error) {
      console.error("Error importing config:", error)
      toast({
        title: "Error de importación",
        description: "El archivo no es un JSON válido",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <ConfigContext.Provider
      value={{
        rooms,
        hasUnsavedChanges,
        setRooms,
        addRoom,
        updateRoom,
        deleteRoom,
        saveChanges,
        exportConfig,
        importConfig,
        lastSaved,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

// Hook personalizado para usar el contexto de configuración
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error("useConfig debe ser usado dentro de un ConfigProvider")
  }
  return context
}
