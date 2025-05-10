"use client"

import type React from "react"

import { useState, useRef } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useDataStore } from "@/hooks/use-data-store"
import { Download, Upload, RefreshCw, FileJson, Share2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import SiteConfigStatus from "@/components/SiteConfigStatus"

const AdminConfig = () => {
  const { toast } = useToast()
  const { exportData, importData, resetToDefault, lastUpdated, configSource } = useDataStore()
  const [activeTab, setActiveTab] = useState("export")
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatDate = (date: Date | null) => {
    if (!date) return "Nunca"
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  const handleExport = () => {
    setIsExporting(true)

    try {
      // Generar el JSON
      const jsonData = exportData()

      // Crear un blob con el JSON
      const blob = new Blob([jsonData], { type: "application/json" })

      // Crear una URL para el blob
      const url = URL.createObjectURL(blob)

      // Crear un elemento <a> para descargar el archivo
      const a = document.createElement("a")
      a.href = url
      a.download = `estanciaplus_config_${new Date().toISOString().split("T")[0]}.json`

      // Simular un clic en el enlace para iniciar la descarga
      document.body.appendChild(a)
      a.click()

      // Limpiar
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Exportación completada",
        description: "La configuración ha sido exportada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "Ha ocurrido un error al exportar la configuración",
        variant: "destructive",
      })
      console.error("Error al exportar:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string
        const success = importData(jsonData)

        if (success) {
          toast({
            title: "Importación completada",
            description:
              "La configuración ha sido importada correctamente. Los cambios se reflejarán en todo el sitio.",
          })
        } else {
          throw new Error("Formato de archivo inválido")
        }
      } catch (error) {
        toast({
          title: "Error al importar",
          description: "El archivo seleccionado no es válido o está corrupto",
          variant: "destructive",
        })
        console.error("Error al importar:", error)
      } finally {
        setIsImporting(false)
        // Limpiar el input de archivo
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }

    reader.onerror = () => {
      toast({
        title: "Error al leer el archivo",
        description: "No se pudo leer el archivo seleccionado",
        variant: "destructive",
      })
      setIsImporting(false)
      // Limpiar el input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    reader.readAsText(file)
  }

  const handleReset = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas restablecer toda la configuración a los valores predeterminados? Esta acción no se puede deshacer.",
      )
    ) {
      setIsResetting(true)

      setTimeout(() => {
        resetToDefault()
        toast({
          title: "Configuración restablecida",
          description:
            "La configuración ha sido restablecida a los valores predeterminados. Los cambios se reflejarán en todo el sitio.",
        })
        setIsResetting(false)
      }, 1000)
    }
  }

  const handleShareConfig = () => {
    // Implementación futura: compartir configuración entre dispositivos
    toast({
      title: "Función en desarrollo",
      description: "La función para compartir configuración entre dispositivos estará disponible próximamente.",
    })
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Exportar/Importar Configuración</h1>
        <p className="text-muted-foreground">Gestiona la configuración de tu plataforma</p>
      </div>

      <SiteConfigStatus />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="export">Exportar</TabsTrigger>
          <TabsTrigger value="import">Importar</TabsTrigger>
          <TabsTrigger value="share">Compartir</TabsTrigger>
          <TabsTrigger value="reset">Restablecer</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Exportar configuración</CardTitle>
              <CardDescription>
                Descarga un archivo JSON con toda la configuración actual de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTitle>Información</AlertTitle>
                <AlertDescription>
                  El archivo de configuración exportado contiene todas las habitaciones, servicios y ajustes actuales.
                  Puedes usar este archivo para cargar la configuración en otro dispositivo o como copia de seguridad.
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <FileJson className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">Archivo de configuración</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    El archivo incluirá todas las habitaciones, servicios y configuraciones
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleExport}
                className="w-full bg-terracotta hover:bg-terracotta/90"
                disabled={isExporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exportando..." : "Exportar configuración"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Importar configuración</CardTitle>
              <CardDescription>Carga un archivo JSON con la configuración que deseas importar</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Al importar una configuración, se reemplazarán todos los datos actuales. Asegúrate de hacer una copia
                  de seguridad antes de continuar. Los cambios se reflejarán inmediatamente en todo el sitio.
                </AlertDescription>
              </Alert>
              <div
                className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleImportClick}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">Seleccionar archivo</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Haz clic para seleccionar un archivo JSON</p>
                  <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileChange} className="hidden" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleImportClick}
                className="w-full bg-terracotta hover:bg-terracotta/90"
                disabled={isImporting}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? "Importando..." : "Importar configuración"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="share">
          <Card>
            <CardHeader>
              <CardTitle>Compartir configuración</CardTitle>
              <CardDescription>Comparte tu configuración entre dispositivos</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTitle>Información</AlertTitle>
                <AlertDescription>
                  Esta función te permite compartir tu configuración actual con otros dispositivos sin necesidad de
                  exportar e importar manualmente archivos JSON.
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Share2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">Compartir configuración</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Comparte tu configuración actual con otros dispositivos
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleShareConfig}
                className="w-full bg-terracotta hover:bg-terracotta/90"
                disabled={true}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartir configuración (Próximamente)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reset">
          <Card>
            <CardHeader>
              <CardTitle>Restablecer configuración</CardTitle>
              <CardDescription>Restablece toda la configuración a los valores predeterminados</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6" variant="destructive">
                <AlertTitle>Advertencia</AlertTitle>
                <AlertDescription>
                  Esta acción eliminará todas las habitaciones y servicios personalizados y restablecerá la
                  configuración a los valores predeterminados. Esta acción no se puede deshacer. Los cambios se
                  reflejarán inmediatamente en todo el sitio.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={handleReset} variant="destructive" className="w-full" disabled={isResetting}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {isResetting ? "Restableciendo..." : "Restablecer a valores predeterminados"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

export default AdminConfig
