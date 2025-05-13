"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Lock, User } from "lucide-react"
import { useAdminAuth } from "@/hooks/use-admin-auth"

const AdminLogin = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login } = useAdminAuth()
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Verificar credenciales (usuario: Administrador, contraseña: root)
    if (credentials.username === "Administrador" && credentials.password === "root") {
      setTimeout(() => {
        login()
        toast({
          title: "Acceso concedido",
          description: "Bienvenido al panel de administración",
        })
        navigate("/admin/dashboard")
        setIsLoading(false)
      }, 1000)
    } else {
      setTimeout(() => {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas. Inténtalo de nuevo.",
          variant: "destructive",
        })
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Panel de Administración</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al panel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  name="username"
                  placeholder="Nombre de usuario"
                  value={credentials.username}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  value={credentials.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta/90" disabled={isLoading}>
              {isLoading ? "Verificando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <p className="text-sm text-muted-foreground">Acceso restringido solo para personal autorizado</p>
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            Volver a la página de inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AdminLogin
