"use client"

import type { ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bed, Settings, FileJson, Home, LogOut } from "lucide-react"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
    {
      title: "Habitaciones",
      icon: <Bed className="h-5 w-5" />,
      path: "/admin/rooms",
    },
    {
      title: "Servicios",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/services",
    },
    {
      title: "Exportar/Importar",
      icon: <FileJson className="h-5 w-5" />,
      path: "/admin/config",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm hidden md:block">
        <div className="p-4">
          <h2 className="text-xl font-bold text-terracotta">EstanciaPlus</h2>
          <p className="text-sm text-muted-foreground">Panel de administración</p>
        </div>
        <Separator />
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === item.path ? "bg-terracotta hover:bg-terracotta/90" : "hover:bg-muted"
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
