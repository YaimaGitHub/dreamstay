"use client"

import { useState } from "react"
import { useRoomStore } from "@/contexts/RoomStoreContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Save, X } from "lucide-react"
import { toast } from "sonner"

interface FilePathSelectorProps {
  onClose: () => void
  currentPath: string
}

export function FilePathSelector({ onClose, currentPath }: FilePathSelectorProps) {
  const { setFilePath } = useRoomStore()
  const [path, setPath] = useState(currentPath)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSelectDirectory = async () => {
    try {
      // Intentar abrir el selector de directorios
      const directoryHandle = await window.showDirectoryPicker({
        id: "salvaDirectory",
        mode: "readwrite",
      })

      // Obtener la ruta del directorio (esto es limitado en navegadores)
      setPath(`${directoryHandle.name}/salva`)
    } catch (error) {
      console.error("Error al seleccionar directorio:", error)
      toast.error("No se pudo seleccionar el directorio. Intente nuevamente.")
    }
  }

  const handleSave = async () => {
    if (!path) {
      toast.error("Por favor, ingrese una ruta válida")
      return
    }

    setIsProcessing(true)
    try {
      if (setFilePath) {
        const success = await setFilePath(path)
        if (success) {
          toast.success("Ubicación configurada correctamente")
          onClose()
        } else {
          toast.error("No se pudo configurar la ubicación. Intente nuevamente.")
        }
      } else {
        toast.error("No se pudo configurar la ubicación. Intente nuevamente.")
      }
    } catch (error) {
      console.error("Error al configurar ubicación:", error)
      toast.error("Error al configurar ubicación")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurar ubicación del archivo salva</CardTitle>
        <CardDescription>
          Seleccione la ubicación donde se guardará el archivo salva. Esta configuración solo puede ser modificada por
          el Administrador principal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-path">Ubicación del archivo</Label>
            <div className="flex gap-2">
              <Input
                id="file-path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="Seleccione o ingrese la ubicación del archivo"
                className="flex-1"
              />
              <Button variant="outline" onClick={handleSelectDirectory} type="button">
                <FolderOpen className="h-4 w-4 mr-2" />
                Explorar
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Notas importantes:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                La ubicación seleccionada debe ser accesible desde todos los dispositivos donde se utilizará la
                plataforma.
              </li>
              <li>
                Para sincronización entre dispositivos, se recomienda utilizar una carpeta en la nube (Google Drive,
                Dropbox, etc.).
              </li>
              <li>
                En modo sin conexión, los cambios se guardarán localmente y se sincronizarán cuando vuelva a estar en
                línea.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isProcessing}>
          <Save className="h-4 w-4 mr-2" />
          {isProcessing ? "Guardando..." : "Guardar configuración"}
        </Button>
      </CardFooter>
    </Card>
  )
}
