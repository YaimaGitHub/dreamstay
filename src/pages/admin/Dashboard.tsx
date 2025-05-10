"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfig } from "@/contexts/ConfigContext"
import { useAuth } from "@/contexts/AuthContext"
import { Hotel, Calendar, Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const Dashboard = () => {
  const { rooms, hasUnsavedChanges, saveChanges, lastSaved } = useConfig()
  const { user } = useAuth()

  const featuredRooms = rooms.filter((room) => room.featured)
  const totalRooms = rooms.length

  const formatDate = (date: Date | null) => {
    if (!date) return "Nunca"
    return new Intl.DateTimeFormat("es", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Última actualización: {formatDate(new Date())}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Habitaciones</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
            <p className="text-xs text-muted-foreground">{featuredRooms.length} habitaciones destacadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado de Cambios</CardTitle>
            <Save className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasUnsavedChanges ? "Pendientes" : "Guardados"}</div>
            <p className="text-xs text-muted-foreground">Último guardado: {formatDate(lastSaved)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesión Actual</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.username}</div>
            <p className="text-xs text-muted-foreground">Administrador del sistema</p>
          </CardContent>
        </Card>
      </div>

      {hasUnsavedChanges && (
        <Alert className="bg-amber-50 border-amber-200">
          <Save className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Cambios sin guardar</AlertTitle>
          <AlertDescription className="text-amber-700">
            Tienes cambios pendientes que no se han guardado. Haz clic en "Guardar cambios" para persistir tus
            modificaciones.
            <Button
              variant="outline"
              className="mt-2 border-amber-500 text-amber-600 hover:bg-amber-100"
              onClick={saveChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido al Panel Administrativo</CardTitle>
            <CardDescription>Gestiona todas las habitaciones y configuraciones del hotel desde aquí</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Desde este panel puedes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestionar las habitaciones (añadir, editar, eliminar)</li>
              <li>Modificar precios, nombres, imágenes y disponibilidad</li>
              <li>Exportar e importar la configuración completa</li>
              <li>Ver y gestionar reservaciones</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Recuerda guardar los cambios después de realizar modificaciones.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/admin/rooms")}
            >
              <Hotel className="mr-2 h-4 w-4" />
              Gestionar Habitaciones
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/admin/reservations")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Ver Reservaciones
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/admin/export-import")}
            >
              <Save className="mr-2 h-4 w-4" />
              Exportar/Importar Configuración
            </Button>
            {hasUnsavedChanges && (
              <Button variant="default" className="w-full justify-start mt-4" onClick={saveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Todos los Cambios
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
