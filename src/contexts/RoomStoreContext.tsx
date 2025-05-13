
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Room, RoomStore } from "../types/room"
import { toast } from "@/components/ui/use-toast"
import { generateTypeScriptFiles } from "@/utils/ts-generation-utils"

// Sample initial rooms data
import { roomsData } from "../data/rooms"
import { allServices } from "../data/services"
import { FILE_NAME } from "@/utils/file-system-utils"

const RoomStoreContext = createContext<RoomStore | undefined>(undefined)

export const useRoomStore = () => {
  const context = useContext(RoomStoreContext)
  if (!context) {
    throw new Error("useRoomStore must be used within a RoomStoreProvider")
  }
  return context
}

export const RoomStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [fileHandle, setFileHandle] = useState<any | null>(null)

  // Load rooms from local file or use initial data
  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Siempre usar los datos de roomsData (fuente de verdad)
        const roomsWithModifiedDate = roomsData.map((room) => ({
          ...room,
          // Asegurar que todos los campos necesarios estén presentes
          lastModified: room.lastUpdated || new Date().toISOString(),
          available: room.available !== undefined ? room.available : true,
          isAvailable: room.available !== undefined ? room.available : true,
          // Asegurar que las fechas reservadas se mantengan y estén en el formato correcto
          reservedDates: room.reservedDates ? [...room.reservedDates] : [],
        }))

        setRooms(roomsWithModifiedDate as Room[])
        console.log(`Habitaciones cargadas desde archivo fuente:`, roomsWithModifiedDate.length)

        // Verificar y registrar las fechas reservadas cargadas
        roomsWithModifiedDate.forEach((room) => {
          if (room.reservedDates && room.reservedDates.length > 0) {
            console.log(
              `Habitación ${room.id} - ${room.title}: ${room.reservedDates.length} fechas reservadas cargadas`,
            )
          }
        })
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
        // En caso de error, usar datos iniciales
        setRooms(roomsData as Room[])
        toast({
          title: "Error al cargar",
          description: "Se produjo un error al cargar los datos. Utilizando datos de muestra.",
          variant: "destructive",
        })
      } finally {
        setIsLoaded(true)
      }
    }

    loadRooms()
  }, [])

  // Generate TypeScript files
  const generateTypeScriptFilesWrapper = (roomsData: Room[] = rooms) => {
    return generateTypeScriptFiles(roomsData, allServices, [])
  }

  // Save rooms to source files whenever they change
  useEffect(() => {
    const saveRooms = async () => {
      if (isLoaded && rooms.length > 0) {
        try {
          // Generate TypeScript files after saving data
          generateTypeScriptFilesWrapper(rooms)

          console.log(`Habitaciones guardadas en archivos fuente`)
        } catch (error) {
          console.error("Error al guardar habitaciones:", error)
          toast({
            title: "Error al guardar",
            description: "Se produjo un error al guardar los cambios.",
            variant: "destructive",
          })
        }
      }
    }

    // Only save when there are changes and data has already been loaded
    if (isLoaded && rooms.length > 0) {
      saveRooms()
    }
  }, [rooms, isLoaded])

  const updateRoom = (updatedRoom: Room) => {
    const now = new Date().toISOString()
    const roomWithTimestamp = {
      ...updatedRoom,
      lastModified: now,
      lastUpdated: now,
      // Ensure both availability fields are synchronized
      available: updatedRoom.available !== undefined ? updatedRoom.available : updatedRoom.isAvailable,
      isAvailable: updatedRoom.isAvailable !== undefined ? updatedRoom.isAvailable : updatedRoom.available,
    }

    // Update the room in the rooms array
    const updatedRooms = rooms.map((room) => (room.id === updatedRoom.id ? roomWithTimestamp : room))
    setRooms(updatedRooms)

    // Force immediate generation of TypeScript files
    setTimeout(() => {
      generateTypeScriptFilesWrapper(updatedRooms)
      console.log(`Room ${updatedRoom.id} updated at ${now}`)
    }, 100)
  }

  const deleteRoom = (id: number) => {
    const updatedRooms = rooms.filter((room) => room.id !== id)
    setRooms(updatedRooms)

    // Force immediate generation of TypeScript files
    setTimeout(() => {
      generateTypeScriptFilesWrapper(updatedRooms)
      console.log(`Room ${id} deleted`)
    }, 100)
  }

  const toggleRoomAvailability = (id: number) => {
    const now = new Date().toISOString()
    const updatedRooms = rooms.map((room) =>
      room.id === id
        ? {
            ...room,
            available: !room.available,
            isAvailable: !room.available,
            lastModified: now,
            lastUpdated: now,
          }
        : room,
    )

    setRooms(updatedRooms)

    // Generate TypeScript files after toggling availability
    setTimeout(() => {
      generateTypeScriptFilesWrapper(updatedRooms)
      console.log(`Room ${id} availability toggled`)
    }, 100)
  }

  const addReservedDates = (id: number, startDate: Date, endDate: Date) => {
    const now = new Date().toISOString()
    const updatedRooms = rooms.map((room) => {
      if (room.id === id) {
        const reservedDates = room.reservedDates || []
        return {
          ...room,
          reservedDates: [
            ...reservedDates,
            {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          ],
          lastModified: now,
          lastUpdated: now,
        }
      }
      return room
    })

    setRooms(updatedRooms)

    // Generate TypeScript files after adding reserved dates
    setTimeout(() => {
      generateTypeScriptFilesWrapper(updatedRooms)
      console.log(`Reserved dates added to room ${id}`)
    }, 100)
  }

  const addRoom = (room: Omit<Room, "id">) => {
    const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1
    const now = new Date().toISOString()
    const newRoom = {
      ...room,
      id: newId,
      lastModified: now,
      lastUpdated: now,
      available: room.available !== undefined ? room.available : true,
      isAvailable: room.isAvailable !== undefined ? room.isAvailable : room.available !== undefined ? room.available : true,
    }

    const updatedRooms = [...rooms, newRoom as Room]
    setRooms(updatedRooms)

    // Generate TypeScript files after adding a new room
    setTimeout(() => {
      generateTypeScriptFilesWrapper(updatedRooms)
      console.log(`New room added with id ${newId}`)
    }, 100)
  }

  const value: RoomStore = {
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    toggleRoomAvailability,
    addReservedDates,
  }

  return <RoomStoreContext.Provider value={value}>{children}</RoomStoreContext.Provider>
}
