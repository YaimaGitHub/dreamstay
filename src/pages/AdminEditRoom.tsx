
"use client"

import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RoomForm from "@/components/admin/RoomForm"
import { useDataStore } from "@/hooks/use-data-store"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Calendar } from "lucide-react"

const AdminEditRoom = () => {
  const { isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { rooms, generateTypeScriptFiles } = useDataStore()
  const [refreshKey, setRefreshKey] = useState(0)

  const roomId = id ? Number.parseInt(id) : undefined
  const room = roomId ? rooms.find((room) => room.id === roomId) : undefined

  // Ensure we're always showing the latest data
  useEffect(() => {
    if (roomId && room) {
      console.log(`Loaded room ${roomId} with data:`, {
        province: room.province,
        reservedDates: room.reservedDates,
        lastModified: room.lastUpdated || "unknown",
        lastUpdated: room.lastUpdated || "unknown",
      })

      // Log reserved dates for debugging
      if (room.reservedDates && room.reservedDates.length > 0) {
        console.log(`Habitación ${roomId} tiene ${room.reservedDates.length} fechas reservadas:`)
        room.reservedDates.forEach((date, index) => {
          console.log(
            `  ${index + 1}. Desde: ${new Date(date.start).toLocaleDateString()} hasta: ${new Date(date.end).toLocaleDateString()}`,
          )
        })
      } else {
        console.log(`Habitación ${roomId} no tiene fechas reservadas`)
      }
    }
  }, [roomId, room, refreshKey])

  // Add a refresh function
  const refreshRoomData = () => {
    // This will force a re-render with the latest data
    setRefreshKey((prev) => prev + 1)
    console.log(`Refreshing room data for room ${roomId}`)
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/admin/login")
    return null
  }

  // Redirect if room not found
  if (roomId && !room) {
    navigate("/admin/dashboard")
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Editar habitación</h1>
              <p className="text-muted-foreground">Modifique los detalles de la habitación</p>
              {room?.lastUpdated && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Última modificación:{" "}
                  {format(new Date(room.lastUpdated), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es })}
                </div>
              )}
              {room?.lastUpdated && room.lastUpdated !== room.lastUpdated && (
                <div className="mt-1 text-sm text-green-600">
                  Actualizado:{" "}
                  {format(new Date(room.lastUpdated), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es })}
                </div>
              )}
              {room?.province && <div className="mt-1 text-sm text-blue-600">Provincia: {room.province}</div>}
              {room?.reservedDates && room.reservedDates.length > 0 && (
                <div className="mt-1 text-sm text-orange-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Fechas reservadas: {room.reservedDates.length}
                  <span className="ml-1 text-xs">
                    (Las fechas reservadas se cargan automáticamente desde el archivo rooms.ts)
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refreshRoomData} className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={generateTypeScriptFiles}
                className="flex items-center gap-1 bg-terracotta hover:bg-terracotta/90"
              >
                <Download className="h-4 w-4" />
                Generar archivos TS
              </Button>
            </div>
          </div>
        </div>

        <RoomForm key={refreshKey} mode="edit" />
      </main>
      <Footer />
    </div>
  )
}

export default AdminEditRoom
