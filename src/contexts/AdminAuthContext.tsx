"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AdminAuthContextType {
  isAuthenticated: boolean
  isAdministrador: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  currentUser: string | null
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  // Check if admin is logged in on initial load
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth")
    const username = localStorage.getItem("adminUsername")
    if (adminAuth === "true" && username) {
      setIsAuthenticated(true)
      setCurrentUser(username)
    }
  }, [])

  const login = (username: string, password: string) => {
    // Simple authentication - in a real app, use proper authentication
    if (username === "Administrador" && password === "root") {
      setIsAuthenticated(true)
      setCurrentUser(username)
      localStorage.setItem("adminAuth", "true")
      localStorage.setItem("adminUsername", username)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUsername")
  }

  // Verificar si el usuario actual es el Administrador principal
  const isAdministrador = currentUser === "Administrador"

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isAdministrador, login, logout, currentUser }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
