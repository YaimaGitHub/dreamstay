"use client"

import type React from "react"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"
import { useAuth } from "@/contexts/AuthContext"
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
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const { hasUnsavedChanges, saveChanges } = useConfig()
  const navigate = useNavigate()
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login")
    }
  }, [isAuthenticated, navigate])

  // Manejar navegación con cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  // Función para manejar la navegación interna
  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
      setPendingNavigation(path)
    } else {
      navigate(path)
    }
  }

  // Función para guardar y continuar
  const handleSaveAndContinue = () => {
    saveChanges()
    setShowUnsavedDialog(false)
    if (pendingNavigation) {
      navigate(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  // Función para descartar cambios
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false)
    if (pendingNavigation) {
      navigate(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onNavigate={handleNavigation} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>

      {/* Diálogo de cambios sin guardar */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambios sin guardar</AlertDialogTitle>
            <AlertDialogDescription>Tienes cambios sin guardar. ¿Qué deseas hacer?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges} className="bg-destructive text-destructive-foreground">
              Descartar cambios
            </AlertDialogAction>
            <AlertDialogAction onClick={handleSaveAndContinue}>Guardar y continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminLayout
