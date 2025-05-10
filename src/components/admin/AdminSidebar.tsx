"use client"

import type React from "react"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"
import { useConfig } from "@/contexts/ConfigContext"
import { Home, Hotel, Calendar, FileJson, LogOut, Save, User } from "lucide-react"

interface AdminSidebarProps {
  onNavigate?: (path: string) => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate }) => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { hasUnsavedChanges, saveChanges } = useConfig()

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      navigate(path)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  const handleSaveChanges = (e: React.MouseEvent) => {
    e.preventDefault()
    saveChanges()
  }

  return (
    <div className="w-64 bg-white shadow-md h-full flex flex-col">
      <div className="p-4 bg-primary text-primary-foreground">
        <h2 className="text-xl font-bold">Panel Administrativo</h2>
        <div className="flex items-center mt-2 text-sm">
          <User size={16} className="mr-2" />
          <span>{user?.username || "Administrador"}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation("/admin/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation("/admin/rooms")}>
            <Hotel className="mr-2 h-4 w-4" />
            Habitaciones
            {hasUnsavedChanges && (
              <span className="ml-2 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">*</span>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation("/admin/reservations")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Reservaciones
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation("/admin/export-import")}
          >
            <FileJson className="mr-2 h-4 w-4" />
            Exportar/Importar
          </Button>
        </nav>
      </div>

      <div className="p-4 border-t">
        {hasUnsavedChanges && (
          <Button
            variant="outline"
            className="w-full justify-start mb-2 border-amber-500 text-amber-600 hover:bg-amber-50"
            onClick={handleSaveChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        )}
        <Separator className="my-2" />
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
