"use client"

import { useState, useEffect } from "react"
import { useRoomStore } from "@/contexts/RoomStoreContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  Upload,
  RefreshCw,
  Save,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileJson,
  History,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function ConfigurationManager() {
  const {
    exportData,
    importData,
    saveToFile,
    checkForChanges,
    syncStatus,
    lastModified,
    backupConfigurations,
    restoreFromBackup,
    autoSaveEnabled,
    toggleAutoSave,
  } = useRoomStore()

  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null)
  const [autoSaveProgress, setAutoSaveProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("general")

  // Configurar el progreso del autoguardado
  useEffect(() => {
    if (!autoSaveEnabled) return

    const interval = setInterval(() => {
      setAutoSaveProgress((prev) => {
        if (prev >= 100) {
          // Cuando llega a 100%, realizar el autoguardado
          handleAutoSave()
          return 0
        }
        return prev + 1
      })
    }, 300) // Actualizar cada 300ms para un ciclo de 30 segundos (100 * 300ms)

    return () => clearInterval(interval)
  }, [autoSaveEnabled])

  // Función para realizar el autoguardado
  const handleAutoSave = async () => {
    if (saveToFile) {
      try {
        await saveToFile()
        setLastAutoSave(new Date())
        console.log("Autoguardado completado:", new Date().toLocaleTimeString())
      } catch (error) {
        console.error("Error en autoguardado:", error)
      }
    }
  }

  // Verificar cambios periódicamente
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (checkForChanges) {
        setIsChecking(true)
        try {
          const hasChanges = await checkForChanges()
          if (hasChanges) {
            toast.success("Se han detectado cambios en el archivo salva.json y se han actualizado los datos")
          }
          setLastChecked(new Date())
        } catch (error) {
          console.error("Error al verificar cambios:", error)
        } finally {
          setIsChecking(false)
        }
      }
    }, 10000) // Verificar cada 10 segundos

    return () => clearInterval(intervalId)
  }, [checkForChanges])

  // Función para verificar cambios manualmente
  const handleCheckForChanges = async () => {
    if (checkForChanges) {
      setIsChecking(true)
      try {
        const hasChanges = await checkForChanges()
        if (hasChanges) {
          toast.success("Se han detectado cambios y se han actualizado los datos")
        } else {
          toast.info("No se detectaron cambios en el archivo salva.json")
        }
        setLastChecked(new Date())
      } catch (error) {
        console.error("Error al verificar cambios:", error)
        toast.error("Error al verificar cambios. Verifique los permisos del archivo.")
      } finally {
        setIsChecking(false)
      }
    } else {
      toast.error("La función de verificación de cambios no está disponible en este navegador.")
    }
  }

  // Función para exportar datos manualmente
  const handleExportData = () => {
    if (exportData) {
      try {
        const success = exportData()
        if (success) {
          toast.success("Datos exportados correctamente a salva.json")
        } else {
          toast.error("No se pudo exportar los datos. Intente nuevamente.")
        }
      } catch (error) {
        console.error("Error al exportar datos:", error)
        toast.error("Error al exportar datos. Intente nuevamente.")
      }
    } else {
      toast.error("La función de exportación no está disponible en este navegador.")
    }
  }

  // Función para importar datos manualmente
  const handleImportData = async () => {
    if (importData) {
      try {
        const success = await importData()
        if (success) {
          toast.success("Datos importados correctamente desde salva.json")
        } else {
          toast.error("No se pudo importar los datos. Verifique que el archivo sea válido.")
        }
      } catch (error) {
        console.error("Error al importar datos:", error)
        toast.error("Error al importar datos. Verifique los permisos del archivo.")
      }
    } else {
      toast.error("La función de importación no está disponible en este navegador.")
    }
  }

  // Función para guardar datos manualmente
  const handleSaveToFile = async () => {
    if (saveToFile) {
      try {
        const success = await saveToFile()
        if (success) {
          toast.success("Datos guardados correctamente en salva.json")
        } else {
          toast.error("No se pudo guardar los datos. Verifique los permisos del archivo.")
        }
      } catch (error) {
        console.error("Error al guardar datos:", error)
        toast.error("Error al guardar datos. Intente nuevamente.")
      }
    } else {
      toast.error("La función de guardado no está disponible en este navegador.")
    }
  }

  // Función para crear una copia de seguridad
  const handleCreateBackup = () => {
    if (backupConfigurations) {
      try {
        const backupName = `backup_${format(new Date(), "yyyyMMdd_HHmmss")}`
        const success = backupConfigurations(backupName)
        if (success) {
          toast.success(`Copia de seguridad "${backupName}" creada correctamente`)
        } else {
          toast.error("No se pudo crear la copia de seguridad. Intente nuevamente.")
        }
      } catch (error) {
        console.error("Error al crear copia de seguridad:", error)
        toast.error("Error al crear copia de seguridad. Intente nuevamente.")
      }
    } else {
      toast.error("La función de copia de seguridad no está disponible.")
    }
  }

  // Función para restaurar desde una copia de seguridad
  const handleRestoreBackup = (backupName: string) => {
    if (restoreFromBackup) {
      try {
        const success = restoreFromBackup(backupName)
        if (success) {
          toast.success(`Configuración restaurada desde "${backupName}"`)
        } else {
          toast.error("No se pudo restaurar la configuración. Intente nuevamente.")
        }
      } catch (error) {
        console.error("Error al restaurar configuración:", error)
        toast.error("Error al restaurar configuración. Intente nuevamente.")
      }
    } else {
      toast.error("La función de restauración no está disponible.")
    }
  }

  // Obtener el estado de sincronización
  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Sincronizando..."
      case "error":
        return "Error de sincronización"
      case "synced":
        return "Sincronizado"
      default:
        return "No sincronizado"
    }
  }

  // Formatear la fecha de última modificación
  const getLastModifiedText = () => {
    if (!lastModified) return "No disponible"

    return format(lastModified, "d 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es })
  }

  // Formatear la fecha de última verificación
  const getLastCheckedText = () => {
    if (!lastChecked) return "Nunca"

    return format(lastChecked, "HH:mm:ss", { locale: es })
  }

  // Formatear la fecha del último autoguardado
  const getLastAutoSaveText = () => {
    if (!lastAutoSave) return "Nunca"

    return format(lastAutoSave, "HH:mm:ss", { locale: es })
  }

  // Obtener el icono de estado
  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "synced":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-amber-500" />
    }
  }

  // Simulación de copias de seguridad (en una implementación real, esto vendría del contexto)
  const backups = [
    { name: "backup_20250510_090000", date: new Date(2025, 4, 10, 9, 0, 0), size: "45 KB" },
    { name: "backup_20250509_180000", date: new Date(2025, 4, 9, 18, 0, 0), size: "44 KB" },
    { name: "backup_20250508_120000", date: new Date(2025, 4, 8, 12, 0, 0), size: "43 KB" },
  ]

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-slate-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileJson className="h-5 w-5 text-blue-600" />
              Gestor de Configuración
            </CardTitle>
            <CardDescription>Administre la configuración de su plataforma</CardDescription>
          </div>
          <Badge
            variant={syncStatus === "synced" ? "default" : syncStatus === "syncing" ? "outline" : "destructive"}
            className="px-3 py-1 text-sm flex items-center gap-1"
          >
            {getSyncStatusIcon()}
            {getSyncStatusText()}
          </Badge>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="backups">Copias de seguridad</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="mt-0">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      Última modificación:
                    </span>
                    <span className="text-sm text-muted-foreground">{getLastModifiedText()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4 text-slate-500" />
                      Última verificación:
                    </span>
                    <span className="text-sm text-muted-foreground">{getLastCheckedText()}</span>
                  </div>
                  {autoSaveEnabled && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium flex items-center gap-1">
                        <Save className="h-4 w-4 text-slate-500" />
                        Último autoguardado:
                      </span>
                      <span className="text-sm text-muted-foreground">{getLastAutoSaveText()}</span>
                    </div>
                  )}
                </div>

                {autoSaveEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Próximo autoguardado:</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor((100 - autoSaveProgress) * 0.3)} segundos
                      </span>
                    </div>
                    <Progress value={autoSaveProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      El sistema guarda automáticamente los cambios cada 30 segundos
                    </p>
                  </div>
                )}
              </div>

              <Alert variant="outline" className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle>Información</AlertTitle>
                <AlertDescription>
                  Los cambios en las habitaciones se guardan automáticamente en el archivo salva.json. Puede exportar
                  manualmente la configuración o importar una configuración existente.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2 border-t pt-4 bg-slate-50">
            <Button variant="default" className="flex items-center gap-2" onClick={handleSaveToFile}>
              <Save className="h-4 w-4" />
              Guardar configuración
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              Exportar salva.json
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleImportData}>
              <Upload className="h-4 w-4" />
              Importar salva.json
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCheckForChanges}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
              Verificar cambios
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="backups" className="mt-0">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <History className="h-5 w-5 text-slate-600" />
                  Historial de copias de seguridad
                </h3>
                <Button size="sm" onClick={handleCreateBackup}>
                  Crear copia de seguridad
                </Button>
              </div>

              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left p-3 text-sm font-medium text-slate-600">Nombre</th>
                      <th className="text-left p-3 text-sm font-medium text-slate-600">Fecha</th>
                      <th className="text-left p-3 text-sm font-medium text-slate-600">Tamaño</th>
                      <th className="text-right p-3 text-sm font-medium text-slate-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.map((backup) => (
                      <tr key={backup.name} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="p-3 text-sm">{backup.name}</td>
                        <td className="p-3 text-sm">{format(backup.date, "d MMM yyyy, HH:mm", { locale: es })}</td>
                        <td className="p-3 text-sm">{backup.size}</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleRestoreBackup(backup.name)}>
                            Restaurar
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {backups.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          No hay copias de seguridad disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground">
                Las copias de seguridad se almacenan localmente en su navegador. Para una mayor seguridad, exporte
                regularmente la configuración.
              </p>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Autoguardado</h3>
                  <p className="text-sm text-muted-foreground">Guarda automáticamente los cambios cada 30 segundos</p>
                </div>
                <Button
                  variant={autoSaveEnabled ? "default" : "outline"}
                  onClick={() => toggleAutoSave && toggleAutoSave(!autoSaveEnabled)}
                >
                  {autoSaveEnabled ? "Desactivar" : "Activar"}
                </Button>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Verificación automática</h3>
                    <p className="text-sm text-muted-foreground">
                      Verifica cambios en el archivo salva.json cada 10 segundos
                    </p>
                  </div>
                  <Button variant="default">Activado</Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Ubicación del archivo</h3>
                    <p className="text-sm text-muted-foreground">
                      Ruta actual: <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">salva.json</code>
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleSaveToFile}>
                    Cambiar ubicación
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
