"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, Eye, Trash2, Save, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FaviconManagerProps {
  onFaviconChange?: (faviconData: string) => void
}

const FaviconManager = ({ onFaviconChange }: FaviconManagerProps) => {
  const [currentFavicon, setCurrentFavicon] = useState<string>("")
  const [previewFavicon, setPreviewFavicon] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Cargar favicon actual al montar el componente
  useState(() => {
    const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (existingFavicon) {
      setCurrentFavicon(existingFavicon.href)
      setPreviewFavicon(existingFavicon.href)
    }
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg+xml", "image/x-icon"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Por favor selecciona un archivo PNG, JPG, GIF, SVG o ICO.",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 1MB)
    if (file.size > 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo debe ser menor a 1MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Convertir archivo a base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewFavicon(result)
        setIsUploading(false)

        toast({
          title: "Favicon cargado",
          description: "El favicon se ha cargado correctamente. Haz clic en 'Aplicar' para guardarlo.",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      toast({
        title: "Error al cargar archivo",
        description: "No se pudo cargar el archivo. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const applyFavicon = () => {
    if (!previewFavicon) return

    try {
      // Actualizar favicon en el DOM
      let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement

      if (!faviconLink) {
        faviconLink = document.createElement("link")
        faviconLink.rel = "icon"
        document.head.appendChild(faviconLink)
      }

      faviconLink.href = previewFavicon
      setCurrentFavicon(previewFavicon)

      // Guardar en localStorage para persistencia
      localStorage.setItem("customFavicon", previewFavicon)

      // Notificar al componente padre
      onFaviconChange?.(previewFavicon)

      // Generar código fuente para descargar
      generateFaviconSourceCode(previewFavicon)

      toast({
        title: "Favicon aplicado",
        description: "El favicon se ha aplicado correctamente y se ha guardado el código fuente.",
      })
    } catch (error) {
      toast({
        title: "Error al aplicar favicon",
        description: "No se pudo aplicar el favicon. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const generateFaviconSourceCode = (faviconData: string) => {
    // Generar el código HTML para el favicon
    const faviconCode = `<!-- Favicon personalizado generado automáticamente -->
<link rel="icon" type="image/x-icon" href="${faviconData}" />
<link rel="apple-touch-icon" href="${faviconData}" />
<meta name="msapplication-TileImage" content="${faviconData}" />

<!-- Código JavaScript para cargar favicon dinámicamente -->
<script>
  // Cargar favicon personalizado si existe
  const customFavicon = localStorage.getItem('customFavicon');
  if (customFavicon) {
    const faviconLink = document.querySelector('link[rel="icon"]') || document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.href = customFavicon;
    if (!document.querySelector('link[rel="icon"]')) {
      document.head.appendChild(faviconLink);
    }
  }
</script>`

    // Crear archivo para descargar
    const blob = new Blob([faviconCode], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "favicon-code.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetFavicon = () => {
    const defaultFavicon = "/favicon.ico"

    const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (faviconLink) {
      faviconLink.href = defaultFavicon
    }

    setCurrentFavicon(defaultFavicon)
    setPreviewFavicon(defaultFavicon)
    localStorage.removeItem("customFavicon")

    toast({
      title: "Favicon restablecido",
      description: "Se ha restablecido el favicon por defecto.",
    })
  }

  const downloadCurrentFavicon = () => {
    if (!currentFavicon) return

    const a = document.createElement("a")
    a.href = currentFavicon
    a.download = "favicon"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Gestor de Favicon
        </CardTitle>
        <CardDescription>
          Personaliza el favicon de tu plataforma. Se generará automáticamente el código fuente para implementarlo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vista previa actual */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded border flex items-center justify-center">
              {currentFavicon ? (
                <img src={currentFavicon || "/placeholder.svg"} alt="Favicon actual" className="w-6 h-6" />
              ) : (
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Favicon Actual</p>
              <p className="text-xs text-muted-foreground">{currentFavicon ? "Personalizado" : "Por defecto"}</p>
            </div>
          </div>
          <Badge variant={currentFavicon ? "default" : "secondary"}>{currentFavicon ? "Activo" : "Por defecto"}</Badge>
        </div>

        {/* Subir nuevo favicon */}
        <div className="space-y-4">
          <Label htmlFor="favicon-upload">Subir Nuevo Favicon</Label>
          <div className="flex items-center gap-4">
            <Input
              id="favicon-upload"
              type="file"
              accept="image/*,.ico"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="flex-1"
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Cargando..." : "Seleccionar"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Formatos soportados: PNG, JPG, GIF, SVG, ICO. Tamaño máximo: 1MB. Recomendado: 32x32px o 16x16px.
          </p>
        </div>

        {/* Vista previa del nuevo favicon */}
        {previewFavicon && previewFavicon !== currentFavicon && (
          <div className="p-4 border border-dashed border-orange-200 rounded-lg bg-orange-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded border flex items-center justify-center">
                  <img src={previewFavicon || "/placeholder.svg"} alt="Vista previa" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">Vista Previa</p>
                  <p className="text-xs text-muted-foreground">Nuevo favicon listo para aplicar</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={applyFavicon} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadCurrentFavicon} variant="outline" size="sm" disabled={!currentFavicon}>
            <Download className="h-4 w-4 mr-2" />
            Descargar Actual
          </Button>
          <Button
            onClick={() => generateFaviconSourceCode(currentFavicon)}
            variant="outline"
            size="sm"
            disabled={!currentFavicon}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Código
          </Button>
          <Button onClick={resetFavicon} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• El favicon se guarda automáticamente en el código fuente de la plataforma</p>
          <p>• Se genera código HTML y JavaScript para implementación</p>
          <p>• Compatible con todos los navegadores modernos</p>
          <p>• Se mantiene persistente entre sesiones</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default FaviconManager
