"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useConfig } from "@/contexts/ConfigContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Save, AlertTriangle } from "lucide-react"

const RoomManagement = () => {
  const { rooms, deleteRoom, hasUnsavedChanges, saveChanges } = useConfig()
  const navigate = useNavigate()
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)

  const handleAddRoom = () => {
    navigate("/admin/rooms/new")
  }

  const handleEditRoom = (id: string) => {
    navigate(`/admin/rooms/edit/${id}`)
  }

  const handleDeleteClick = (id: string) => {
    setRoomToDelete(id)
  }

  const confirmDelete = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete)
      setRoomToDelete(null)
    }
  }

  const cancelDelete = () => {
    setRoomToDelete(null)
  }

  const formatCurrency = (price: number, currency: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency || "USD",
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Habitaciones</h1>
        <Button onClick={handleAddRoom}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Habitación
        </Button>
      </div>

      {hasUnsavedChanges && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Cambios sin guardar</AlertTitle>
          <AlertDescription className="text-amber-700 flex justify-between items-center">
            <span>Tienes cambios pendientes que no se han guardado.</span>
            <Button
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-100"
              onClick={saveChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Habitaciones</CardTitle>
          <CardDescription>Gestiona todas las habitaciones disponibles en el hotel</CardDescription>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No hay habitaciones disponibles. Añade una nueva habitación para comenzar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{formatCurrency(room.price, room.currency)}</TableCell>
                    <TableCell>{room.capacity} personas</TableCell>
                    <TableCell>
                      {room.featured ? (
                        <Badge variant="default">Destacada</Badge>
                      ) : (
                        <Badge variant="outline">Normal</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room.id)} title="Editar">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(room.id)} title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </AlertDialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Total: {rooms.length} habitaciones</div>
          {hasUnsavedChanges && (
            <Button variant="outline" onClick={saveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={roomToDelete !== null} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción eliminará la habitación y no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default RoomManagement
