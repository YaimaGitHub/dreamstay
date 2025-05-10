"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useDataStore } from "@/hooks/use-data-store"
import { Upload, FileJson, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConfigLoaderProps {
  onConfigLoaded: () => void
  onSkip: () => void
}

const ConfigLoader = ({ onConfigLoaded, onSkip }: ConfigLoaderProps) => {
  const { importData } = useDataStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string
        const success = importData(jsonData)

        if (success) {
          toast({
            title: "Configuración cargada",
            description: "La configuración se ha cargado correctamente y se ha aplicado a todo el sitio.",
          })
          onConfigLoaded()
        } else {
          throw new Error("Formato de archivo inválido")
        }
      } catch (error) {
        toast({
          title: "Error al cargar la configuración",
          description: "El archivo seleccionado no es válido o está corrupto",
          variant: "destructive",
        })
        console.error("Error al cargar la configuración:", error)
        setIsLoading(false)
      }
    }

    reader.onerror = () => {
      toast({
        title: "Error al leer el archivo",
        description: "No se pudo leer el archivo seleccionado",
        variant: "destructive",
      })
      setIsLoading(false)
    }

    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cargar configuración</CardTitle>
            <Button variant="ghost" size="icon" onClick={onSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Carga un archivo de configuración JSON exportado desde el panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTitle>Información</AlertTitle>
            <AlertDescription>
              Si tienes un archivo de configuración exportado, puedes cargarlo aquí para aplicar esa configuración a
              todo el sitio. Si no tienes un archivo, puedes omitir este paso.
            </AlertDescription>
          </Alert>
          <div
            className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={handleFileSelect}
          >
            <div className="text-center">
              <FileJson className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">Seleccionar archivo</h3>
              <p className="mt-1 text-sm text-muted-foreground">Haz clic para seleccionar un archivo JSON</p>
              <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onSkip} disabled={isLoading}>
            Omitir
          </Button>
          <Button onClick={handleFileSelect} className="bg-terracotta hover:bg-terracotta/90" disabled={isLoading}>
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? "Cargando..." : "Cargar configuración"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ConfigLoader
