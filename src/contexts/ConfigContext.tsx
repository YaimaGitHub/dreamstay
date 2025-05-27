"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Room } from "@/types/room"
import { useToast } from "@/hooks/use-toast"
import { useDataStore } from "@/hooks/use-data-store"

// Definir la interfaz para el contexto de configuración
interface ConfigContextType {
  rooms: Room[]
  hasUnsavedChanges: boolean
  setRooms: (rooms: Room[]) => void
  addRoom: (room: Room) => void
  updateRoom: (id: string, updatedRoom: Room) => void
  deleteRoom: (id: string) => void
  saveChanges: () => Promise<void>
  exportConfig: () => void
  importConfig: (configData: string) => boolean
  lastSaved: Date | null
}

// Crear el contexto
const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

// Proveedor del contexto de configuración
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    rooms: dataStoreRooms,
    updateRoom: updateDataStoreRoom,
    addRoom: addDataStoreRoom,
    deleteRoom: deleteDataStoreRoom,
    exportSourceFiles,
    lastUpdated,
  } = useDataStore()

  const [rooms, setRoomsState] = useState<Room[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  // Sincronizar con el DataStore al cargar
  useEffect(() => {
    if (dataStoreRooms && dataStoreRooms.length > 0) {
      console.log("Sincronizando habitaciones desde DataStore:", dataStoreRooms)
      setRoomsState(dataStoreRooms)
      setLastSaved(lastUpdated)
      setHasUnsavedChanges(false)
    }
  }, [dataStoreRooms, lastUpdated])

  // Función para actualizar las habitaciones
  const setRooms = (newRooms: Room[]) => {
    console.log("Actualizando habitaciones:", newRooms)
    setRoomsState(newRooms)
    setHasUnsavedChanges(true)
  }

  // Función para añadir una habitación
  const addRoom = (room: Room) => {
    console.log("Agregando habitación:", room)
    const roomWithId = {
      ...room,
      id: typeof room.id === "string" ? Number.parseInt(room.id) : room.id,
    }
    addDataStoreRoom(roomWithId)
    setHasUnsavedChanges(true)
  }

  // Función para actualizar una habitación
  const updateRoom = (id: string, updatedRoom: Room) => {
    console.log("Actualizando habitación:", id, updatedRoom)
    const roomWithCorrectId = {
      ...updatedRoom,
      id: typeof updatedRoom.id === "string" ? Number.parseInt(updatedRoom.id) : updatedRoom.id,
    }
    updateDataStoreRoom(roomWithCorrectId)
    setHasUnsavedChanges(true)
  }

  // Función para eliminar una habitación
  const deleteRoom = (id: string) => {
    console.log("Eliminando habitación:", id)
    const numericId = typeof id === "string" ? Number.parseInt(id) : id
    deleteDataStoreRoom(numericId)
    setHasUnsavedChanges(true)
  }

  // Función para guardar cambios en archivos TypeScript
  const saveChanges = async () => {
    try {
      console.log("Guardando cambios en archivos TypeScript...")

      // Exportar archivos TypeScript actualizados
      const success = await exportSourceFiles()

      if (success) {
        const now = new Date()
        setLastSaved(now)
        setHasUnsavedChanges(false)

        console.log("Cambios guardados en archivos TypeScript:", now)

        toast({
          title: "Cambios guardados",
          description: `Configuración guardada en archivos TypeScript: ${now.toLocaleString()}`,
        })
      } else {
        throw new Error("No se pudieron guardar los archivos TypeScript")
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error)
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios en los archivos TypeScript",
        variant: "destructive",
      })
    }
  }

  // Auto-guardar cuando hay cambios (opcional)
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(async () => {
        await saveChanges()
      }, 10000) // Auto-guardar después de 10 segundos

      return () => clearTimeout(autoSaveTimer)
    }
  }, [hasUnsavedChanges])

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

      // Asegurar que cada habitación tenga whatsappNumber
      const roomsWithWhatsApp = parsedConfig.rooms.map((room: any) => ({
        ...room,
        whatsappNumber: room.whatsappNumber || "",
      }))

      // Actualizar las habitaciones
      setRoomsState(roomsWithWhatsApp)
      setHasUnsavedChanges(true)

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
