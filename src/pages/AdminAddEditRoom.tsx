"use client"

import AdminLayout from "@/components/AdminLayout"
import RoomForm from "@/components/admin/RoomForm"
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useDataStore } from "@/hooks/use-data-store"
import { useState, useEffect } from "react"

interface AdminAddEditRoomProps {
  mode: "add" | "edit"
}

const AdminAddEditRoom = ({ mode }: AdminAddEditRoomProps) => {
  const { id } = useParams<{ id: string }>()
  const { rooms } = useDataStore()
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const roomId = id ? Number.parseInt(id) : undefined
  const currentRoom = roomId ? rooms.find((room) => room.id === roomId) : undefined

  useEffect(() => {
    if (currentRoom && currentRoom.lastUpdated) {
      setLastUpdate(currentRoom.lastUpdated)
    }
  }, [currentRoom])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{mode === "add" ? "Agregar nueva habitación" : "Editar habitación"}</h1>
        <p className="text-muted-foreground">
          {mode === "add"
            ? "Complete el formulario para agregar una nueva habitación"
            : "Modifique los detalles de la habitación"}
        </p>
        {lastUpdate && mode === "edit" && (
          <div className="mt-2 text-sm text-muted-foreground">
            Última modificación:{" "}
            {format(new Date(lastUpdate), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es })}
          </div>
        )}
      </div>

      <RoomForm mode={mode} />
    </AdminLayout>
  )
}

export default AdminAddEditRoom
