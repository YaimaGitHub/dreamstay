"use client"

import { useRoomStore } from "@/contexts/RoomStoreContext"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Wifi, WifiOff, CloudOff, CloudIcon as CloudSync, CloudIcon as CloudDone, AlertTriangle } from "lucide-react"

export function SyncStatusIndicator() {
  const { syncStatus, isOnline, lastModified } = useRoomStore()

  // Obtener el estado de sincronización
  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Sincronizando..."
      case "error":
        return "Error de sincronización"
      case "offline":
        return "Modo sin conexión"
      case "synced":
        return "Sincronizado"
      default:
        return "No sincronizado"
    }
  }

  // Obtener el icono según el estado
  const getSyncIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <CloudSync className="h-3 w-3 animate-spin" />
      case "error":
        return <AlertTriangle className="h-3 w-3" />
      case "offline":
        return <CloudOff className="h-3 w-3" />
      case "synced":
        return <CloudDone className="h-3 w-3" />
      default:
        return <CloudOff className="h-3 w-3" />
    }
  }

  // Formatear la fecha de última modificación
  const getLastModifiedText = () => {
    if (!lastModified) return "No disponible"

    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(lastModified)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${
              syncStatus === "synced"
                ? "bg-green-50 text-green-700 border-green-200"
                : syncStatus === "syncing"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : syncStatus === "offline"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {getSyncIcon()}
            <span className="text-xs">{getSyncStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <p>
              <span className="font-medium">Estado:</span> {getSyncStatusText()}
            </p>
            <p>
              <span className="font-medium">Conexión:</span> {isOnline ? "En línea" : "Sin conexión"}
            </p>
            <p>
              <span className="font-medium">Última modificación:</span> {getLastModifiedText()}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
