"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useConfig } from "@/contexts/ConfigContext"
import { Download, Upload, Save, AlertTriangle, Check } from "lucide-react"

const ExportImport = () => {
  const { exportConfig, importConfig, hasUnsavedChanges, saveChanges, lastSaved } = useConfig()
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    exportConfig()
  }

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const success = importConfig(content)

        if (success) {
          setImportStatus("success")
          setImportMessage("Configuración importada correctamente")
        } else {
          setImportStatus("error")
          setImportMessage("Error al importar la configuración")
        }

        // Limpiar el input de archivo
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        // Resetear el estado después de 5 segundos
        setTimeout(() => {
          setImportStatus("idle")
          setImportMessage("")
        }, 5000)
      } catch (error) {
        setImportStatus("error")
        setImportMessage("Error al leer el archivo")

        // Resetear el estado después de 5 segundos
        setTimeout(() => {
          setImportStatus("idle")
          setImportMessage("")
        }, 5000)
      }
    }

    reader.readAsText(file)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Nunca"
    return new Intl.DateTimeFormat("es", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Exportar / Importar Configuración</h1>
      </div>

      {hasUnsavedChanges && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Cambios sin guardar</AlertTitle>
          <AlertDescription className="text-amber-700">
            Tienes cambios pendientes que no se han guardado. Se recomienda guardar los cambios antes de exportar.
            <Button
              variant="outline"
              className="mt-2 border-amber-500 text-amber-600 hover:bg-amber-100"
              onClick={saveChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {importStatus === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Importación exitosa</AlertTitle>
          <AlertDescription className="text-green-700">{importMessage}</AlertDescription>
        </Alert>
      )}

      {importStatus === "error" && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error de importación</AlertTitle>
          <AlertDescription className="text-red-700">{importMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exportar Configuración</CardTitle>
            <CardDescription>Exporta toda la configuración actual a un archivo JSON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Al exportar la configuración, se generará un archivo JSON que contendrá:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Todas las habitaciones y sus detalles</li>
              <li>Precios, nombres, descripciones e imágenes</li>
              <li>Fechas de disponibilidad</li>
              <li>Configuración de características destacadas</li>
            </ul>
            <div className="text-sm text-muted-foreground mt-4">
              <p>Último guardado: {formatDate(lastSaved)}</p>
              {hasUnsavedChanges && (
                <p className="text-amber-600 mt-1">⚠️ Hay cambios sin guardar que no se incluirán en la exportación</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Exportar Configuración
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Importar Configuración</CardTitle>
            <CardDescription>Importa una configuración desde un archivo JSON previamente exportado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Al importar una configuración:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Se reemplazará toda la configuración actual</li>
              <li>Los cambios sin guardar se perderán</li>
              <li>La configuración se aplicará inmediatamente</li>
            </ul>
            <div className="text-sm text-muted-foreground mt-4">
              <p>Formatos aceptados: .JSON</p>
              <p>Tamaño máximo: 5MB</p>
            </div>
            <div className="mt-4">
              <Label htmlFor="config-file">Archivo de configuración</Label>
              <Input
                ref={fileInputRef}
                id="config-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex items-center mt-2">
                <Button onClick={handleImportClick} variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar archivo
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleImportClick} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Importar Configuración
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de uso</CardTitle>
          <CardDescription>Cómo utilizar el sistema de exportación e importación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Exportación</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Asegúrate de guardar todos los cambios antes de exportar</li>
              <li>Haz clic en "Exportar Configuración"</li>
              <li>Guarda el archivo JSON en un lugar seguro</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Importación</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Haz clic en "Seleccionar archivo" o "Importar Configuración"</li>
              <li>Selecciona un archivo JSON previamente exportado</li>
              <li>Confirma la importación cuando se te solicite</li>
              <li>Verifica que la configuración se haya importado correctamente</li>
            </ol>
          </div>
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Recuerda que al importar una configuración, se reemplazará toda la configuración actual. Asegúrate de
              exportar tu configuración actual antes de importar una nueva si deseas conservarla.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExportImport
