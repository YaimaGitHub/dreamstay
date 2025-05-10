"use client"
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { useRoomStore } from "@/contexts/RoomStoreContext"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash, Download, Upload, Save, RefreshCw, FolderOpen, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { FilePathSelector } from "@/components/admin/FilePathSelector"

const AdminDashboard = () => {
  const { isAuthenticated, logout, isAdministrador, currentUser } = useAdminAuth()
  const {
    rooms,
    toggleRoomAvailability,
    deleteRoom,
    exportData,
    importData,
    saveToFile,
    checkForChanges,
    syncStatus,
    lastModified,
    filePath,
    isOnline,
  } = useRoomStore()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(false)
  const [showPathSelector, setShowPathSelector] = useState(false)

  // Configurar verificación periódica de cambios
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (checkForChanges && isOnline) {
        const hasChanges = await checkForChanges()
        if (hasChanges) {
          toast.success("Se han detectado cambios en el archivo salva y se han actualizado los datos")
        }
      }
    }, 10000) // Verificar cada 10 segundos

    return () => clearInterval(intervalId)
  }, [checkForChanges, isOnline])

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/admin/login")
    return null
  }

  const handleToggleAvailability = (id: number) => {
    toggleRoomAvailability(id)
    toast.success("Estado de disponibilidad actualizado")
  }

  const handleDelete = (id: number) => {
    if (window.confirm("¿Está seguro de eliminar esta habitación? Esta acción no se puede deshacer.")) {
      deleteRoom(id)
      toast.success("Habitación eliminada correctamente")
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/admin/edit-room/${id}`)
  }

  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada correctamente")
    navigate("/")
  }

  // Función para exportar datos manualmente
  const handleExportData = () => {
    if (exportData) {
      exportData()
      toast.success("Datos exportados correctamente a archivo salva")
    } else {
      toast.error("No se pudo exportar los datos. Intente nuevamente.")
    }
  }

  // Función para importar datos manualmente
  const handleImportData = async () => {
    if (importData) {
      const success = await importData()
      if (success) {
        toast.success("Datos importados correctamente desde archivo salva")
      } else {
        toast.error("No se pudo importar los datos. Intente nuevamente.")
      }
    } else {
      toast.error("No se pudo importar los datos. Intente nuevamente.")
    }
  }

  // Función para guardar datos manualmente en el archivo salva
  const handleSaveToFile = async () => {
    if (saveToFile) {
      const success = await saveToFile()
      if (success) {
        toast.success("Datos guardados correctamente en archivo salva")
      } else {
        toast.error("No se pudo guardar los datos. Intente nuevamente.")
      }
    } else {
      toast.error("No se pudo guardar los datos. Intente nuevamente.")
    }
  }

  // Función para verificar cambios manualmente
  const handleCheckForChanges = async () => {
    if (checkForChanges) {
      setIsChecking(true)
      try {
        const hasChanges = await checkForChanges()
        if (hasChanges) {
          toast.success("Se han detectado cambios y se han actualizado los datos")
        } else {
          toast.info("No se detectaron cambios en el archivo salva")
        }
      } catch (error) {
        toast.error("Error al verificar cambios")
      } finally {
        setIsChecking(false)
      }
    } else {
      toast.error("No se pudo verificar cambios. Intente nuevamente.")
    }
  }

  // Obtener el estado de sincronización
  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Sincronizando..."
      case "error":
        return "Error de sincronización"
      case "offline":
        return "Modo sin conexión"
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel Administrativo</h1>
            {currentUser && (
              <p className="text-sm text-muted-foreground">
                Usuario: <span className="font-medium">{currentUser}</span>
                {isAdministrador && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Administrador Principal
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Gestión del archivo salva</h2>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Estado:</span>{" "}
                  <span
                    className={`${
                      syncStatus === "synced"
                        ? "text-green-600"
                        : syncStatus === "syncing"
                          ? "text-amber-600"
                          : syncStatus === "offline"
                            ? "text-blue-600"
                            : "text-red-600"
                    } flex items-center gap-1`}
                  >
                    {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    {getSyncStatusText()}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Última modificación:</span>{" "}
                  <span className="text-muted-foreground">{getLastModifiedText()}</span>
                </p>
                {filePath && (
                  <p className="text-sm">
                    <span className="font-medium">Archivo:</span>{" "}
                    <span className="text-muted-foreground">{filePath}</span>
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {isOnline
                    ? "Los cambios se sincronizan automáticamente y se verifican cada 10 segundos"
                    : "Modo sin conexión: los cambios se guardarán localmente y se sincronizarán cuando vuelva a estar en línea"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
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
                disabled={isChecking || !isOnline}
              >
                <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
                Verificar cambios
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowPathSelector(true)}
                disabled={!isAdministrador}
              >
                <FolderOpen className="h-4 w-4" />
                Configurar ubicación
              </Button>
            </div>
          </div>

          {/* Selector de ubicación del archivo */}
          {showPathSelector && (
            <FilePathSelector onClose={() => setShowPathSelector(false)} currentPath={filePath || ""} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gestión de Habitaciones</h2>
            <Button className="bg-terracotta hover:bg-terracotta/90" onClick={() => navigate("/admin/add-room")}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar habitación
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.id}</TableCell>
                    <TableCell>
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img
                          src={room.image || "/placeholder.svg"}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{room.title}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>${room.price}/noche</TableCell>
                    <TableCell>
                      <Badge className={room.isAvailable ? "bg-green-500" : "bg-red-500"}>
                        {room.isAvailable ? "Disponible" : "No disponible"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(room.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleAvailability(room.id)}>
                          {room.isAvailable ? "Deshabilitar" : "Habilitar"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(room.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium">Total de habitaciones</h3>
              <p className="text-3xl font-bold">{rooms.length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium">Habitaciones disponibles</h3>
              <p className="text-3xl font-bold">{rooms.filter((r) => r.isAvailable).length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium">Habitaciones ocupadas</h3>
              <p className="text-3xl font-bold">{rooms.filter((r) => !r.isAvailable).length}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashboard
