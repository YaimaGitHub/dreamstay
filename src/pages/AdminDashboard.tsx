"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bed, Settings, FileJson, LogOut, Home, Users, Calendar, RefreshCw } from "lucide-react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useDataStore } from "@/hooks/use-data-store"
import { Badge } from "@/components/ui/badge"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { logout } = useAdminAuth()
  const { rooms, services, lastUpdated } = useDataStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      navigate("/admin/login")
    }, 500)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "No disponible"
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  const stats = [
    {
      title: "Habitaciones",
      value: rooms.length,
      icon: <Bed className="h-8 w-8 text-terracotta" />,
      description: "Total de habitaciones",
      link: "/admin/rooms",
    },
    {
      title: "Servicios",
      value: services.length,
      icon: <Settings className="h-8 w-8 text-terracotta" />,
      description: "Servicios disponibles",
      link: "/admin/services",
    },
    {
      title: "Configuración",
      value: "Exportar/Importar",
      icon: <FileJson className="h-8 w-8 text-terracotta" />,
      description: "Gestionar configuración",
      link: "/admin/config",
    },
  ]

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona todos los aspectos de tu plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Ver sitio
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10"
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-terracotta" />
                <span className="font-medium">Última actualización:</span>
                <span>{formatDate(lastUpdated)}</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Guardado automático activado
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <CardDescription>{stat.description}</CardDescription>
              <Button
                variant="outline"
                className="w-full mt-4 border-terracotta text-terracotta hover:bg-terracotta/10"
                onClick={() => navigate(stat.link)}
              >
                Gestionar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Actividad reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-terracotta pl-4 py-1">
                <p className="font-medium">Actualización de precios</p>
                <p className="text-sm text-muted-foreground">Hace 2 días</p>
              </div>
              <div className="border-l-4 border-terracotta pl-4 py-1">
                <p className="font-medium">Nueva habitación añadida</p>
                <p className="text-sm text-muted-foreground">Hace 5 días</p>
              </div>
              <div className="border-l-4 border-terracotta pl-4 py-1">
                <p className="font-medium">Configuración exportada</p>
                <p className="text-sm text-muted-foreground">Hace 1 semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Accesos rápidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-terracotta text-terracotta hover:bg-terracotta/10"
                onClick={() => navigate("/admin/rooms/new")}
              >
                <Bed className="h-6 w-6" />
                <span>Nueva habitación</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-terracotta text-terracotta hover:bg-terracotta/10"
                onClick={() => navigate("/admin/services/new")}
              >
                <Settings className="h-6 w-6" />
                <span>Nuevo servicio</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-terracotta text-terracotta hover:bg-terracotta/10"
                onClick={() => navigate("/admin/config")}
              >
                <FileJson className="h-6 w-6" />
                <span>Exportar datos</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-terracotta text-terracotta hover:bg-terracotta/10"
                onClick={() => navigate("/admin/config")}
              >
                <FileJson className="h-6 w-6" />
                <span>Importar datos</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
