"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Navbar } from "@/components/Navbar"
import { LanguageCurrencyHeader } from "@/components/LanguageCurrencyHeader"
import { Footer } from "@/components/Footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import AvailabilityManager from "@/components/admin/AvailabilityManager"

export default function AdminPanel() {
  const { t } = useTranslation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Credenciales de ejemplo (en un caso real, esto estaría en el servidor)
  const validUsername = "admin"
  const validPassword = "admin123"

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === validUsername && password === validPassword) {
      setIsLoggedIn(true)
      setError("")
    } else {
      setError(t("admin.invalidCredentials") || "Credenciales inválidas")
    }
  }

  return (
    <>
      <LanguageCurrencyHeader />
      <Navbar />
      <main className="container mx-auto py-10 px-4 min-h-[calc(100vh-200px)]">
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.loginTitle") || "Acceso Administrador"}</CardTitle>
                <CardDescription>
                  {t("admin.loginDescription") || "Ingresa tus credenciales para acceder al panel de administración"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">{t("admin.username") || "Usuario"}</Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">{t("admin.password") || "Contraseña"}</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit">{t("admin.login") || "Iniciar sesión"}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{t("admin.panelTitle") || "Panel de Administración"}</h1>
              <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
                {t("admin.logout") || "Cerrar sesión"}
              </Button>
            </div>

            <Tabs defaultValue="availability">
              <TabsList className="mb-4">
                <TabsTrigger value="availability">{t("admin.availabilityTab") || "Disponibilidad"}</TabsTrigger>
                <TabsTrigger value="rooms">{t("admin.roomsTab") || "Habitaciones"}</TabsTrigger>
                <TabsTrigger value="bookings">{t("admin.bookingsTab") || "Reservas"}</TabsTrigger>
                <TabsTrigger value="settings">{t("admin.settingsTab") || "Configuración"}</TabsTrigger>
              </TabsList>

              <TabsContent value="availability" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.availabilityManager") || "Gestor de Disponibilidad"}</CardTitle>
                    <CardDescription>
                      {t("admin.availabilityDescription") ||
                        "Gestiona las fechas disponibles y no disponibles para tus habitaciones"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvailabilityManager />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rooms" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.roomsManager") || "Gestor de Habitaciones"}</CardTitle>
                    <CardDescription>
                      {t("admin.roomsDescription") || "Administra las habitaciones disponibles"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{t("admin.comingSoon") || "Próximamente"}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.bookingsManager") || "Gestor de Reservas"}</CardTitle>
                    <CardDescription>
                      {t("admin.bookingsDescription") || "Administra las reservas realizadas"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{t("admin.comingSoon") || "Próximamente"}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.settingsManager") || "Configuración"}</CardTitle>
                    <CardDescription>
                      {t("admin.settingsDescription") || "Configura los ajustes de tu plataforma"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{t("admin.comingSoon") || "Próximamente"}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
