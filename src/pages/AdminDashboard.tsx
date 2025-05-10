"use client"

import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataStore } from "@/hooks/use-data-store"
import SiteConfigStatus from "@/components/SiteConfigStatus"
import { Bed, Utensils, Clock, Users } from "lucide-react"

const AdminDashboard = () => {
  const { rooms, services, lastUpdated } = useDataStore()

  // Calcular estadísticas
  const totalRooms = rooms.length
  const availableRooms = rooms.filter((room) => room.available !== false).length
  const totalServices = services.length

  // Formatear fecha
  const formatDate = (date: Date | null) => {
    if (!date) return "Nunca"
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración de Estancia Plus</p>
      </div>

      <SiteConfigStatus />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Habitaciones</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              {availableRooms} disponibles, {totalRooms - availableRooms} no disponibles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Servicios</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">
              {services.filter((s) => s.category === "gastronomía").length} de gastronomía,{" "}
              {services.filter((s) => s.category === "transporte").length} de transporte
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Actualización</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(lastUpdated).split(",")[0]}</div>
            <p className="text-xs text-muted-foreground">{formatDate(lastUpdated).split(",")[1]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Administradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Administrador principal</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Estadísticas</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
              <CardDescription>
                Resumen de la configuración actual del sistema y últimas actualizaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Estado de la Configuración</h3>
                <p className="text-sm text-muted-foreground">
                  La configuración actual del sistema está basada en{" "}
                  {
                    {
                      default: "los valores predeterminados",
                      localStorage: "datos guardados localmente",
                      file: "un archivo de configuración importado",
                    }[useDataStore().configSource]
                  }
                  .
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Última Actualización</h3>
                <p className="text-sm text-muted-foreground">
                  La última actualización del sistema fue realizada el {formatDate(lastUpdated)}.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Resumen de Contenido</h3>
                <p className="text-sm text-muted-foreground">
                  El sistema actualmente gestiona {totalRooms} habitaciones y {totalServices} servicios.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas del Sistema</CardTitle>
              <CardDescription>Análisis detallado del contenido y uso del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Distribución de Habitaciones</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-sm font-medium">Por tipo</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        {Object.entries(
                          rooms.reduce(
                            (acc, room) => {
                              acc[room.type] = (acc[room.type] || 0) + 1
                              return acc
                            },
                            {} as Record<string, number>,
                          ),
                        ).map(([type, count]) => (
                          <li key={type}>
                            {type}: {count}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-sm font-medium">Por disponibilidad</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        <li>Disponibles: {availableRooms}</li>
                        <li>No disponibles: {totalRooms - availableRooms}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Distribución de Servicios</h3>
                  <div className="bg-muted p-2 rounded">
                    <p className="text-sm font-medium">Por categoría</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      {Object.entries(
                        services.reduce(
                          (acc, service) => {
                            acc[service.category] = (acc[service.category] || 0) + 1
                            return acc
                          },
                          {} as Record<string, number>,
                        ),
                      ).map(([category, count]) => (
                        <li key={category}>
                          {category}: {count}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

export default AdminDashboard
