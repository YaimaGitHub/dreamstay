"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useDataStore } from "@/hooks/use-data-store"
import { Edit, Plus, Trash2, Eye, Download } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import RoomPreview from "@/components/admin/RoomPreview"

const AdminRooms = () => {
  const navigate = useNavigate()
  const { rooms, deleteRoom, toggleRoomAvailability, generateTypeScriptFiles, previewRoom } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [previewRoomId, setPreviewRoomId] = useState<number | null>(null)

  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.province && room.province.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDeleteRoom = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta habitación?")) {
      deleteRoom(id)
    }
  }

  const handleToggleAvailability = (id: number) => {
    toggleRoomAvailability(id)
  }

  const handleEditRoom = (id: number) => {
    navigate(`/admin/rooms/edit/${id}`)
  }

  const handlePreviewRoom = (id: number) => {
    setPreviewRoomId(id)
  }

  const closePreview = () => {
    setPreviewRoomId(null)
  }

  const roomToPreview = previewRoomId !== null ? previewRoom(previewRoomId) : null

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Habitaciones</h1>
          <p className="text-muted-foreground">Administra las habitaciones disponibles en tu plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-terracotta hover:bg-terracotta/90">
            <Link to="/admin/rooms/new">
              <Plus className="h-4 w-4 mr-2" />
              Nueva habitación
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={generateTypeScriptFiles}
            className="flex items-center"
            title="Descarga los archivos TypeScript actualizados para reemplazarlos en tu proyecto"
          >
            <Download className="h-4 w-4 mr-2" />
            Generar archivos TS
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Habitaciones</CardTitle>
          <CardDescription>
            Listado de todas las habitaciones disponibles en tu plataforma. Puedes editar, eliminar o cambiar el estado
            de disponibilidad. Los cambios se guardan automáticamente en la sesión actual, pero para hacerlos
            permanentes debes exportar los archivos TypeScript.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar por título, ubicación, tipo o provincia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Provincia</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No se encontraron habitaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.title}</TableCell>
                      <TableCell>{room.location}</TableCell>
                      <TableCell>{room.province || "-"}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>${room.price}/noche</TableCell>
                      <TableCell>
                        <Badge
                          variant={room.available !== false ? "default" : "destructive"}
                          className={room.available !== false ? "bg-green-500 hover:bg-green-600" : ""}
                          onClick={() => handleToggleAvailability(room.id)}
                        >
                          {room.available !== false ? "Disponible" : "No disponible"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {room.lastUpdated
                          ? format(new Date(room.lastUpdated), "dd/MM/yyyy HH:mm", { locale: es })
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePreviewRoom(room.id)}
                            title="Vista previa"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Vista previa</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room.id)} title="Editar">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-destructive"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredRooms.length} de {rooms.length} habitaciones
          </div>
        </CardFooter>
      </Card>

      {/* Modal de vista previa */}
      <Dialog open={previewRoomId !== null} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vista previa de habitación</DialogTitle>
            <DialogDescription>Así se verá la habitación con los cambios aplicados</DialogDescription>
          </DialogHeader>
          {roomToPreview && <RoomPreview room={roomToPreview} />}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default AdminRooms
