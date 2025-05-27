import type { Room } from "@/types/room"
import { toast } from "@/components/ui/sonner"

export const addRoom = (
  room: Omit<Room, "id">,
  rooms: Room[],
  setRooms: (rooms: Room[]) => void,
  updateLastModified: () => Date,
  autoExportSourceFiles: () => Promise<boolean>,
) => {
  try {
    // Generate new ID
    const newId = Math.max(...rooms.map((r) => r.id), 0) + 1

    const newRoom: Room = {
      ...room,
      id: newId,
      lastUpdated: new Date().toISOString(),
      available: true,
      isAvailable: true,
      reservedDates: room.reservedDates || [],
      // Asegurar que whatsappNumber esté presente
      whatsappNumber: room.whatsappNumber || "",
    }

    const updatedRooms = [...rooms, newRoom]
    setRooms(updatedRooms)
    updateLastModified()

    console.log("Habitación agregada:", newRoom)

    // Auto-export source files
    autoExportSourceFiles().then((success) => {
      if (success) {
        console.log("Archivos TypeScript actualizados automáticamente")
      }
    })

    toast.success("Habitación agregada correctamente", {
      description: `La habitación "${newRoom.title}" ha sido agregada con ID ${newId}`,
    })
  } catch (error) {
    console.error("Error al agregar habitación:", error)
    toast.error("Error al agregar la habitación")
  }
}

export const updateRoom = (
  roomData: Room,
  rooms: Room[],
  setRooms: (rooms: Room[]) => void,
  updateLastModified: () => Date,
  setPendingChanges: (changes: Record<string, any>) => void,
  autoExportSourceFiles: () => Promise<boolean>,
) => {
  try {
    const updatedRoom: Room = {
      ...roomData,
      lastUpdated: new Date().toISOString(),
      // Asegurar que whatsappNumber esté presente
      whatsappNumber: roomData.whatsappNumber || "",
    }

    const updatedRooms = rooms.map((room) => (room.id === roomData.id ? updatedRoom : room))
    setRooms(updatedRooms)
    updateLastModified()

    // Clear pending changes for this room
    setPendingChanges((prev) => {
      const newChanges = { ...prev }
      delete newChanges[`room-${roomData.id}`]
      return newChanges
    })

    console.log("Habitación actualizada:", updatedRoom)

    // Auto-export source files
    autoExportSourceFiles().then((success) => {
      if (success) {
        console.log("Archivos TypeScript actualizados automáticamente")
      }
    })

    toast.success("Habitación actualizada correctamente", {
      description: `Los cambios en "${updatedRoom.title}" han sido guardados`,
    })
  } catch (error) {
    console.error("Error al actualizar habitación:", error)
    toast.error("Error al actualizar la habitación")
  }
}

export const deleteRoom = (
  id: number,
  rooms: Room[],
  setRooms: (rooms: Room[]) => void,
  updateLastModified: () => Date,
  setPendingChanges: (changes: Record<string, any>) => void,
  autoExportSourceFiles: () => Promise<boolean>,
) => {
  try {
    const roomToDelete = rooms.find((room) => room.id === id)
    if (!roomToDelete) {
      toast.error("Habitación no encontrada")
      return
    }

    const updatedRooms = rooms.filter((room) => room.id !== id)
    setRooms(updatedRooms)
    updateLastModified()

    // Clear pending changes for this room
    setPendingChanges((prev) => {
      const newChanges = { ...prev }
      delete newChanges[`room-${id}`]
      return newChanges
    })

    console.log("Habitación eliminada:", roomToDelete)

    // Auto-export source files
    autoExportSourceFiles().then((success) => {
      if (success) {
        console.log("Archivos TypeScript actualizados automáticamente")
      }
    })

    toast.success("Habitación eliminada correctamente", {
      description: `La habitación "${roomToDelete.title}" ha sido eliminada`,
    })
  } catch (error) {
    console.error("Error al eliminar habitación:", error)
    toast.error("Error al eliminar la habitación")
  }
}

export const toggleRoomAvailability = (
  id: number,
  rooms: Room[],
  setRooms: (rooms: Room[]) => void,
  updateLastModified: () => Date,
  setPendingChanges: (changes: Record<string, any>) => void,
  autoExportSourceFiles: () => Promise<boolean>,
) => {
  try {
    const updatedRooms = rooms.map((room) => {
      if (room.id === id) {
        const updatedRoom = {
          ...room,
          available: !room.available,
          isAvailable: !room.available,
          lastUpdated: new Date().toISOString(),
        }
        return updatedRoom
      }
      return room
    })

    setRooms(updatedRooms)
    updateLastModified()

    const room = updatedRooms.find((r) => r.id === id)
    const status = room?.available ? "disponible" : "no disponible"

    // Clear pending changes for this room
    setPendingChanges((prev) => {
      const newChanges = { ...prev }
      delete newChanges[`room-${id}`]
      return newChanges
    })

    console.log(`Disponibilidad de habitación ${id} cambiada a: ${status}`)

    // Auto-export source files
    autoExportSourceFiles().then((success) => {
      if (success) {
        console.log("Archivos TypeScript actualizados automáticamente")
      }
    })

    toast.success("Disponibilidad actualizada", {
      description: `La habitación ahora está ${status}`,
    })
  } catch (error) {
    console.error("Error al cambiar disponibilidad:", error)
    toast.error("Error al cambiar la disponibilidad")
  }
}
