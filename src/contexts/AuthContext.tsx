"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Definir la interfaz para el contexto de autenticación
interface AuthContextType {
  isAuthenticated: boolean
  user: { username: string } | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Credenciales fijas del administrador
const ADMIN_USERNAME = "Administrador"
const ADMIN_PASSWORD = "root"

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const { toast } = useToast()

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const storedAuth = localStorage.getItem("adminAuth")
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        if (authData.isAuthenticated && authData.user) {
          setIsAuthenticated(true)
          setUser(authData.user)
        }
      } catch (error) {
        console.error("Error parsing auth data:", error)
        localStorage.removeItem("adminAuth")
      }
    }
  }, [])

  // Función para iniciar sesión
  const login = (username: string, password: string): boolean => {
    // Verificar credenciales
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const userData = { username }
      setUser(userData)
      setIsAuthenticated(true)

      // Guardar sesión en localStorage
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({
          isAuthenticated: true,
          user: userData,
        }),
      )

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${username}`,
      })

      return true
    } else {
      toast({
        title: "Error de autenticación",
        description: "Credenciales incorrectas",
        variant: "destructive",
      })
      return false
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("adminAuth")
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
