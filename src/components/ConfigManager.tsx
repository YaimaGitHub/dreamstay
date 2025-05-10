"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Settings, AlertTriangle } from "lucide-react"
import { configManager } from "@/lib/config"
import { useToast } from "@/hooks/use-toast"

const ConfigManager = () => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función para exportar la configuración
  const handleExport = () => {
    const configData = configManager.exportConfig()
    const blob = new Blob([configData], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `estanciaplus-config-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()

    // Limpieza
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)

    toast({
      title: "Configuración exportada",
      description: "La configuración ha sido exportada correctamente.",
    })
  }

  // Función para importar la configuración
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null)
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const success = configManager.importConfig(content)

        if (success) {
          toast({
            title: "Configuración importada",
            description:
              "La configuración ha sido importada correctamente. La página se recargará para aplicar los cambios.",
          })

          // Cerrar el diálogo
          setIsOpen(false)

          // Recargar la página para aplicar los cambios
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        } else {
          setImportError("El archivo no contiene una configuración válida.")
        }
      } catch (error) {
        setImportError("Error al procesar el archivo. Asegúrate de que es un archivo JSON válido.")
        console.error("Error al importar:", error)
      }
    }

    reader.onerror = () => {
      setImportError("Error al leer el archivo.")
    }

    reader.readAsText(file)

    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = ""
  }

  // Función para restablecer la configuración
  const handleReset = () => {
    configManager.resetConfig()
    toast({
      title: "Configuración restablecida",
      description:
        "La configuración ha sido restablecida a los valores predeterminados. La página se recargará para aplicar los cambios.",
    })

    // Cerrar el diálogo
    setIsOpen(false)

    // Recargar la página para aplicar los cambios
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configuración</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gestión de configuración</DialogTitle>
            <DialogDescription>Exporta o importa la configuración completa de la plataforma.</DialogDescription>
          </DialogHeader>

          {importError && (
            <Alert variant="destructive" className="my-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Button onClick={handleExport} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar configuración
              </Button>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />

              <Button onClick={handleImportClick} variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Importar configuración
              </Button>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="destructive" onClick={handleReset}>
              Restablecer valores predeterminados
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ConfigManager
