import { useRoomStore } from "@/contexts/RoomStoreContext"
import { Loader2 } from "lucide-react"

export function LoadingOverlay() {
  const { isLoading } = useRoomStore()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <h3 className="text-lg font-medium">Cargando datos</h3>
        <p className="text-sm text-muted-foreground mt-2">Cargando configuración desde el archivo salva.json...</p>
      </div>
    </div>
  )
}
