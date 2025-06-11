import type { Room } from "@/types/room"
import { generateRoomsSourceCode } from "./source-code-generator"

// Operations for managing rooms
export const addRoom = (
  room: Omit<Room, "id">,
  rooms: Room[],
  setRooms: (rooms: Room[]) => void,
  updateLastModified: () => Date,
  autoExportSourceFilesWrapper: () => boolean,
) => {
  const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1
  const now = new Date().toISOString()
  const newRoom = {
    ...room,
    id: newId,
    lastUpdated: now,
  }

  const newRooms = [...rooms, newRoom]
  setRooms(newRooms)
  updateLastModified()

  // Update the source code directly
  const roomsSourceCode = generateRoomsSourceCode(newRooms)
  console.log("Código fuente actualizado con nueva habitación:", newId)
  console.log(roomsSourceCode.substring(0, 200) + "...")

  autoExportSourceFilesWrapper()
}

export const updateRoom = (
  roomData: Room,
  rooms: Room[],
  setRooms: (rooms: Room[]) => void,
  updateLastModified: () => Date,
  setPendingChanges: (setter: (prev: Record<string, any>) => Record<string, any>) => void,
  autoExportSourceFilesWrapper: () => boolean,
) => {
  const now = new Date().toISOString()
  const newRooms = rooms.map((room) => {
    if (room.id === roomData.id) {
      // Ensure all properties are properly updated
      const updatedRoom = {
        ...room,
        ...roomData,
        // Make sure these critical fields are always present
        available: roomData.available !== undefined ? roomData.available : roomData.isAvailable,
        isAvailable: roomData.isAvailable !== undefined ? roomData.isAvailable : roomData.available,
        lastUpdated: now,
        // Ensure province and reservedDates are preserved
        province: roomData.province || room.province,
        reservedDates: roomData.reservedDates || room.reservedDates,
        // CRITICAL: Preserve hosts data
        hosts: roomData.hosts || room.hosts,
        // CRITICAL: Preserve capacity data
        capacity: roomData.capacity || room.capacity,
        // CRITICAL: Preserve pricing data
        pricing: roomData.pricing || room.pricing,
        // CRITICAL: Preserve WhatsApp data
        hostWhatsApp: roomData.hostWhatsApp || room.hostWhatsApp,
      }

      // Save pending changes
      setPendingChanges((prev) => ({
        ...prev,
        [`room-${room.id}`]: updatedRoom,
      }))

      return updatedRoom
    }
    return room
  })

  setRooms(newRooms)
  const timestamp = updateLastModified()

  // Update source code directly
  const roomsSourceCode = generateRoomsSourceCode(newRooms)
  console.log(`Código fuente actualizado para habitación ${roomData.id} a las ${timestamp.toISOString()}`)
  console.log(roomsSourceCode.substring(0, 200) + "...")

  // Force immediate export of source files
  setTimeout(() => {
    autoExportSourceFilesWrapper()

    // Log confirmation of update
    console.log(`Room ${roomData.id} updated at ${timestamp.toISOString()}`)
  }, 100)
}

export const deleteRoom = (
  id: number,
  rooms: Room[],
  setRooms: (rooms: Room[]) => void,
  updateLastModified: () => Date,
  setPendingChanges: (setter: (prev: Record<string, any>) => Record<string, any>) => void,
  autoExportSourceFilesWrapper: () => boolean,
) => {
  const newRooms = rooms.filter((room) => room.id !== id)
  setRooms(newRooms)
  updateLastModified()

  // Update source code directly
  const roomsSourceCode = generateRoomsSourceCode(newRooms)
  console.log(`Código fuente actualizado después de eliminar habitación ${id}`)
  console.log(roomsSourceCode.substring(0, 200) + "...")

  autoExportSourceFilesWrapper()

  // Remove pending changes for this room
  setPendingChanges((prev) => {
    const newPending = { ...prev }
    delete newPending[`room-${id}`]
    return newPending
  })
}

export const toggleRoomAvailability = (
  id: number,
  rooms: Room[],
  setRooms: (rooms: Room[]) => void,
  updateLastModified: () => Date,
  setPendingChanges: (setter: (prev: Record<string, any>) => Record<string, any>) => void,
  autoExportSourceFilesWrapper: () => boolean,
) => {
  const newRooms = rooms.map((room) => {
    if (room.id === id) {
      const now = new Date().toISOString()
      const updatedRoom = {
        ...room,
        available: room.available === false ? true : false,
        isAvailable: room.available === false ? true : false,
        lastUpdated: now,
      }

      // Save pending changes
      setPendingChanges((prev) => ({
        ...prev,
        [`room-${room.id}`]: updatedRoom,
      }))

      return updatedRoom
    }
    return room
  })

  setRooms(newRooms)
  updateLastModified()

  // Update source code directly
  const roomsSourceCode = generateRoomsSourceCode(newRooms)
  console.log(`Código fuente actualizado después de cambiar disponibilidad de habitación ${id}`)
  console.log(roomsSourceCode.substring(0, 200) + "...")

  autoExportSourceFilesWrapper()
}
