
import { useRoomStore } from "@/contexts/RoomStoreContext"
import { Room } from "@/types/room"
import { toast } from "@/components/ui/sonner"
import { generateTypeScriptFiles } from "@/utils/ts-generation-utils"

// This hook provides exports of utility functions for use in other components
export function useRoomStoreExports() {
  const { rooms, addRoom, updateRoom, deleteRoom, toggleRoomAvailability } = useRoomStore()
  
  // Helper function to export and show toast
  const exportWithToast = () => {
    toast.success("Generando archivos TypeScript...", {
      description: "Los archivos se descargarán automáticamente",
    })
    
    return generateTypeScriptFiles(rooms, [], [])
  }
  
  // Preview room with any pending changes
  const previewRoom = (id: number) => {
    return rooms.find((r) => r.id === id)
  }
  
  return {
    exportSourceFiles: exportWithToast,
    generateTypeScriptFiles: exportWithToast,
    previewRoom,
  }
}
