"use client"

import { useState } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useDataStore } from "@/hooks/use-data-store"
import { Download, Upload, RefreshCw, FileCode } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const AdminConfig = () => {
  const { toast } = useToast()
  const { exportData, importData, resetToDefault, exportSourceFiles, lastUpdated } = useDataStore()
  const [importText, setImportText] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  const handleExport = () => {
    try {
      const jsonData = exportData()
      const blob = new Blob([jsonData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `estanciaplus_data_${new Date().toISOString().split("T")[0]}.json`
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: "Datos exportados",
        description: "Los datos han sido exportados correctamente",
      })
    } catch (error) {
      console.error("Error al exportar datos:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al exportar los datos",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    if (!importText.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduce datos JSON válidos",
        variant: "destructive",
      })
      return
    }

    try {
      const success = importData(importText)
      if (success) {
        toast({
          title: "Datos importados",
          description: "Los datos han sido importados correctamente",
        })
        setImportText("")
      } else {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al importar los datos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al importar datos:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al importar los datos",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setIsResetting(true)
    setTimeout(() => {
      resetToDefault()
      toast({
        title: "Datos restablecidos",
        description: "Los datos han sido restablecidos a los valores predeterminados",
      })
      setIsResetting(false)
    }, 1000)
  }

  const handleExportSourceFiles = () => {
    try {
      exportSourceFiles()

      // Mostrar instrucciones adicionales después de la exportación
      setTimeout(() => {
        toast({
          title: "Instrucciones importantes",
          description:
            "Para que los cambios sean permanentes, debes reemplazar los archivos originales en tu proyecto con los archivos descargados.",
          duration: 8000,
        })
      }, 1000)
    } catch (error) {
      console.error("Error al exportar archivos fuente:", error)
      toast({
        title: "Error",
        description: "No se pudieron exportar los archivos fuente.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Gestiona la configuración y los datos de tu plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="export-import">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="export-import">Exportar/Importar</TabsTrigger>
              <TabsTrigger value="source-files">Archivos Fuente</TabsTrigger>
              <TabsTrigger value="reset">Restablecer</TabsTrigger>
            </TabsList>

            <TabsContent value="export-import">
              <Card>
                <CardHeader>
                  <CardTitle>Exportar e Importar Datos</CardTitle>
                  <CardDescription>
                    Exporta tus datos para hacer una copia de seguridad o importa datos previamente exportados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Button onClick={handleExport} className="w-full bg-terracotta hover:bg-terracotta/90">
                      <Download className="mr-2 h-4 w-4" /> Exportar datos
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Descarga un archivo JSON con todos los datos actuales de habitaciones y servicios
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Pega aquí el JSON de datos para importar..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      rows={10}
                    />
                    <Button onClick={handleImport} className="w-full">
                      <Upload className="mr-2 h-4 w-4" /> Importar datos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="source-files">
              <Card>
                <CardHeader>
                  <CardTitle>Archivos de Código Fuente</CardTitle>
                  <CardDescription>
                    Exporta los archivos de código fuente actualizados para reemplazarlos en tu proyecto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTitle className="text-amber-800">Importante</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Los archivos exportados deben reemplazar los archivos originales en tu proyecto para que los
                      cambios sean permanentes.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <Button onClick={handleExportSourceFiles} className="w-full bg-terracotta hover:bg-terracotta/90">
                      <FileCode className="mr-2 h-4 w-4" /> Exportar archivos de código fuente
                    </Button>

                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-medium mb-2">Archivos que se exportarán:</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center">
                          <span className="mr-2 text-terracotta">•</span>
                          <code className="bg-muted-foreground/20 px-1 rounded">src/data/rooms.ts</code> - Datos de
                          habitaciones
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-terracotta">•</span>
                          <code className="bg-muted-foreground/20 px-1 rounded">src/data/services.ts</code> - Datos de
                          servicios
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Instrucciones:</h3>
                      <ol className="space-y-2 text-sm list-decimal pl-5">
                        <li>Exporta los archivos de código fuente haciendo clic en el botón de arriba.</li>
                        <li>Localiza los archivos descargados en tu dispositivo.</li>
                        <li>Reemplaza los archivos originales en tu proyecto con los archivos descargados.</li>
                        <li>
                          <strong>Importante:</strong> Los archivos deben reemplazar exactamente a:
                          <ul className="mt-1 space-y-1 list-disc pl-5">
                            <li>
                              <code className="bg-muted-foreground/20 px-1 rounded">src/data/rooms.ts</code>
                            </li>
                            <li>
                              <code className="bg-muted-foreground/20 px-1 rounded">src/data/services.ts</code>
                            </li>
                            <li>
                              <code className="bg-muted-foreground/20 px-1 rounded">src/data/provinces.ts</code>
                            </li>
                          </ul>
                        </li>
                        <li>Reinicia la aplicación para que los cambios surtan efecto.</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reset">
              <Card>
                <CardHeader>
                  <CardTitle>Restablecer Datos</CardTitle>
                  <CardDescription>
                    Restablece todos los datos a los valores predeterminados. Esta acción no se puede deshacer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-red-50 border-red-200 mb-4">
                    <AlertTitle className="text-red-800">Advertencia</AlertTitle>
                    <AlertDescription className="text-red-700">
                      Esta acción eliminará todas las habitaciones y servicios personalizados y los reemplazará por los
                      valores predeterminados. Esta acción no se puede deshacer.
                    </AlertDescription>
                  </Alert>

                  <Button variant="destructive" onClick={handleReset} className="w-full" disabled={isResetting}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
                    {isResetting ? "Restableciendo..." : "Restablecer a valores predeterminados"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
              <CardDescription>Información sobre la configuración actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">Última actualización:</h3>
                <p className="text-sm text-muted-foreground">
                  {lastUpdated ? lastUpdated.toLocaleString() : "No disponible"}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm">Exportación automática:</h3>
                <p className="text-sm text-muted-foreground">Activada. Los cambios se exportan automáticamente.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ayuda</CardTitle>
              <CardDescription>Información sobre cómo usar la configuración</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">Exportar/Importar:</h3>
                <p className="text-sm text-muted-foreground">
                  Usa esta opción para hacer copias de seguridad de tus datos o para transferirlos a otra instalación.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm">Archivos Fuente:</h3>
                <p className="text-sm text-muted-foreground">
                  Exporta los archivos de código fuente actualizados para reemplazarlos en tu proyecto y hacer que los
                  cambios sean permanentes.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm">Restablecer:</h3>
                <p className="text-sm text-muted-foreground">
                  Restablece todos los datos a los valores predeterminados. Útil si quieres empezar de nuevo.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleExportSourceFiles}>
                <FileCode className="mr-2 h-4 w-4" /> Exportar archivos fuente
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminConfig
