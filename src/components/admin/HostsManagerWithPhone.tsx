"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Star, Phone, MessageCircle, Upload, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { HostInfo } from "@/types/room"
import { getInitials } from "@/utils/host-manager"

interface HostsManagerWithPhoneProps {
  hosts: HostInfo[]
  onHostsChange: (hosts: HostInfo[]) => void
}

const HostsManagerWithPhone: React.FC<HostsManagerWithPhoneProps> = ({ hosts, onHostsChange }) => {
  const [editingHost, setEditingHost] = useState<HostInfo | null>(null)
  const [isAddingHost, setIsAddingHost] = useState(false)

  const validatePhoneNumber = (phone: string): boolean => {
    // Formato cubano: +53 5XXXXXXX o 5XXXXXXX
    const cubanPhoneRegex = /^(\+53\s?)?5\d{7}$/
    return cubanPhoneRegex.test(phone.replace(/\s/g, ""))
  }

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.startsWith("535")) {
      return `+53 ${cleaned.substring(2)}`
    } else if (cleaned.startsWith("5") && cleaned.length === 8) {
      return `+53 ${cleaned}`
    }
    return phone
  }

  const handleAddHost = () => {
    const newHost: HostInfo = {
      id: Date.now(),
      name: "",
      hostSince: new Date().getFullYear().toString(),
      bio: "",
      isPrimary: hosts.length === 0,
      phone: "",
      avatar: "",
    }
    setEditingHost(newHost)
    setIsAddingHost(true)
  }

  const handleSaveHost = (host: HostInfo) => {
    if (!host.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del anfitrión es requerido",
        variant: "destructive",
      })
      return
    }

    if (host.phone && !validatePhoneNumber(host.phone)) {
      toast({
        title: "Error",
        description: "El número de teléfono debe tener formato cubano (+53 5XXXXXXX)",
        variant: "destructive",
      })
      return
    }

    const formattedHost = {
      ...host,
      phone: host.phone ? formatPhoneNumber(host.phone) : "",
    }

    if (isAddingHost) {
      onHostsChange([...hosts, formattedHost])
    } else {
      onHostsChange(hosts.map((h) => (h.id === host.id ? formattedHost : h)))
    }

    setEditingHost(null)
    setIsAddingHost(false)
    toast({
      title: "Éxito",
      description: isAddingHost ? "Anfitrión agregado correctamente" : "Anfitrión actualizado correctamente",
    })
  }

  const handleDeleteHost = (hostId: number) => {
    const hostToDelete = hosts.find((h) => h.id === hostId)
    if (hostToDelete?.isPrimary && hosts.length > 1) {
      // Si eliminamos el anfitrión principal, hacer principal al siguiente
      const remainingHosts = hosts.filter((h) => h.id !== hostId)
      remainingHosts[0].isPrimary = true
      onHostsChange(remainingHosts)
    } else {
      onHostsChange(hosts.filter((h) => h.id !== hostId))
    }

    toast({
      title: "Éxito",
      description: "Anfitrión eliminado correctamente",
    })
  }

  const handleSetPrimary = (hostId: number) => {
    onHostsChange(
      hosts.map((h) => ({
        ...h,
        isPrimary: h.id === hostId,
      })),
    )
    toast({
      title: "Éxito",
      description: "Anfitrión principal actualizado",
    })
  }

  const handleImageUpload = (file: File, host: HostInfo) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no puede ser mayor a 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const updatedHost = {
        ...host,
        avatar: e.target?.result as string,
      }
      setEditingHost(updatedHost)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Anfitriones ({hosts.length})
          </div>
          <Button onClick={handleAddHost} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Anfitrión
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay anfitriones configurados</p>
            <p className="text-sm">Agrega al menos un anfitrión para la habitación</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hosts.map((host) => (
              <div key={host.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={host.avatar || "/placeholder.svg"} alt={host.name} />
                  <AvatarFallback>{getInitials(host.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{host.name}</h4>
                    {host.isPrimary && (
                      <Badge variant="default" className="bg-orange-100 text-orange-800">
                        <Star className="h-3 w-3 mr-1" />
                        Principal
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Anfitrión desde {host.hostSince}</p>
                  {host.phone && (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-3 w-3" />
                      <span className="text-sm">{host.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {host.phone && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => window.open(`tel:${host.phone}`)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://wa.me/${host.phone.replace(/\D/g, "")}`)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {!host.isPrimary && (
                    <Button variant="outline" size="sm" onClick={() => handleSetPrimary(host.id)}>
                      <Star className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingHost(host)
                      setIsAddingHost(false)
                    }}
                  >
                    Editar
                  </Button>

                  {hosts.length > 1 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar anfitrión?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El anfitrión será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteHost(host.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de edición */}
        {editingHost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">{isAddingHost ? "Agregar Anfitrión" : "Editar Anfitrión"}</h3>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={editingHost.avatar || "/placeholder.svg"} alt={editingHost.name} />
                    <AvatarFallback>{getInitials(editingHost.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted/50">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Subir foto</span>
                      </div>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, editingHost)
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Máx. 5MB</p>
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <Label htmlFor="host-name">Nombre *</Label>
                  <Input
                    id="host-name"
                    value={editingHost.name}
                    onChange={(e) => setEditingHost({ ...editingHost, name: e.target.value })}
                    placeholder="Nombre del anfitrión"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <Label htmlFor="host-phone">Número de Móvil</Label>
                  <Input
                    id="host-phone"
                    value={editingHost.phone || ""}
                    onChange={(e) => setEditingHost({ ...editingHost, phone: e.target.value })}
                    placeholder="+53 5XXXXXXX"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Formato: +53 5XXXXXXX o 5XXXXXXX</p>
                </div>

                {/* Año desde que es anfitrión */}
                <div>
                  <Label htmlFor="host-since">Anfitrión desde</Label>
                  <Input
                    id="host-since"
                    type="number"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={editingHost.hostSince}
                    onChange={(e) => setEditingHost({ ...editingHost, hostSince: e.target.value })}
                  />
                </div>

                {/* Biografía */}
                <div>
                  <Label htmlFor="host-bio">Biografía</Label>
                  <Textarea
                    id="host-bio"
                    value={editingHost.bio || ""}
                    onChange={(e) => setEditingHost({ ...editingHost, bio: e.target.value })}
                    placeholder="Cuéntanos sobre el anfitrión..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingHost(null)
                    setIsAddingHost(false)
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={() => handleSaveHost(editingHost)}>{isAddingHost ? "Agregar" : "Guardar"}</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default HostsManagerWithPhone
