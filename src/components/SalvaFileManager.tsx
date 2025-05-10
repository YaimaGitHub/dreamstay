"use client"

import { useState, useEffect } from "react"
import { useRoomStore } from "@/contexts/RoomStoreContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, RefreshCw, Save } from "lucide-react"
import { toast } from "sonner"

export function SalvaFileManager() {
  const { exportData, importData, saveToFile, checkForChanges, syncStatus, lastModified } = useRoomStore()
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

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
        exportData()
        toast.success("Datos exportados correctamente a salva.json")
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

    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(lastModified)
  }

  // Formatear la fecha de última verificación
  const getLastCheckedText = () => {
    if (!lastChecked) return "Nunca"

    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(lastChecked)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archivo salva.json</CardTitle>
        <CardDescription>Gestión del archivo de datos de la plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Estado:</span>
            <Badge variant={syncStatus === "synced" ? "default" : syncStatus === "syncing" ? "outline" : "destructive"}>
              {getSyncStatusText()}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Última modificación:</span>
            <span className="text-sm text-muted-foreground">{getLastModifiedText()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Última verificación:</span>
            <span className="text-sm text-muted-foreground">{getLastCheckedText()}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Los cambios se sincronizan automáticamente y se verifican cada 10 segundos en todos los dispositivos.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={handleSaveToFile}>
          <Save className="h-4 w-4" />
          Guardar
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleImportData}>
          <Upload className="h-4 w-4" />
          Importar
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
    </Card>
  )
}
