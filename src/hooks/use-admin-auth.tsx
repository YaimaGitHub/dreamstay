
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    const adminSession = sessionStorage.getItem("admin_session")
    if (adminSession) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = () => {
    sessionStorage.setItem("admin_session", "true")
    setIsAuthenticated(true)
  }

  const logout = () => {
    sessionStorage.removeItem("admin_session")
    setIsAuthenticated(false)
  }

  return <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
