"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Trash2, UserPlus, Star, User } from "lucide-react"
import type { HostInfo } from "@/types/room"
import { getInitials } from "@/utils/host-manager"

interface HostsManagerProps {
  hosts: HostInfo[]
  onChange: (hosts: HostInfo[]) => void
}

const HostsManager = ({ hosts, onChange }: HostsManagerProps) => {
  const [localHosts, setLocalHosts] = useState<HostInfo[]>(hosts || [])
  const [previewImages, setPreviewImages] = useState<Record<number, string>>({})

  // Sincronizar hosts locales con props cuando cambian
  useEffect(() => {
    setLocalHosts(hosts || [])

    // Inicializar previewImages con avatares existentes
    const initialPreviews: Record<number, string> = {}
    hosts?.forEach((host) => {
      if (host.avatar) {
        initialPreviews[host.id] = host.avatar
      }
    })
    setPreviewImages(initialPreviews)
  }, [hosts])

  // Añadir un nuevo anfitrión
  const handleAddHost = () => {
    const newHost: HostInfo = {
      id: Date.now(),
      name: "",
      hostSince: new Date().getFullYear().toString(),
      bio: "",
      isPrimary: localHosts.length === 0, // El primer anfitrión es primario por defecto
    }
    const updatedHosts = [...localHosts, newHost]
    setLocalHosts(updatedHosts)
    onChange(updatedHosts)
  }

  // Eliminar un anfitrión
  const handleRemoveHost = (id: number) => {
    const updatedHosts = localHosts.filter((host) => host.id !== id)

    // Si eliminamos el anfitrión primario, asignar otro como primario
    if (updatedHosts.length > 0 && !updatedHosts.some((h) => h.isPrimary)) {
      updatedHosts[0].isPrimary = true
    }

    setLocalHosts(updatedHosts)
    onChange(updatedHosts)
  }

  // Actualizar un campo de un anfitrión
  const handleUpdateHost = (id: number, field: keyof HostInfo, value: string | boolean) => {
    const updatedHosts = localHosts.map((host) => {
      if (host.id === id) {
        return { ...host, [field]: value }
      }
      return host
    })
    setLocalHosts(updatedHosts)
    onChange(updatedHosts)
  }

  // Manejar cambio de imagen
  const handleImageChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar los 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewImages((prev) => ({ ...prev, [id]: base64String }))
        handleUpdateHost(id, "avatar", base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  // Establecer un anfitrión como primario
  const handleSetPrimary = (id: number) => {
    const updatedHosts = localHosts.map((host) => ({
      ...host,
      isPrimary: host.id === id,
    }))
    setLocalHosts(updatedHosts)
    onChange(updatedHosts)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Anfitriones ({localHosts.length})</h3>
        <Button onClick={handleAddHost} variant="outline" className="flex items-center gap-2 border-dashed">
          <UserPlus className="h-4 w-4" />
          Añadir Anfitrión
        </Button>
      </div>

      {localHosts.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg bg-muted/30">
          <User className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No hay anfitriones configurados</p>
          <p className="text-sm text-muted-foreground mb-4">Añade al menos un anfitrión para esta habitación</p>
          <Button onClick={handleAddHost} variant="secondary" className="mx-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Añadir Primer Anfitrión
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {localHosts.map((host) => (
            <Card
              key={host.id}
              className={`overflow-hidden ${host.isPrimary ? "border-orange-300 bg-orange-50/30" : ""}`}
            >
              {host.isPrimary && (
                <div className="bg-orange-100 text-orange-800 px-4 py-1 flex items-center gap-2">
                  <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                  <span className="text-xs font-medium">Anfitrión Principal</span>
                </div>
              )}
              <CardContent className="p-4 pt-5">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Columna de Avatar */}
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="w-24 h-24 border-2 border-muted">
                      <AvatarImage src={previewImages[host.id] || host.avatar} alt={host.name || "Anfitrión"} />
                      <AvatarFallback className="text-2xl bg-orange-100 text-orange-800">
                        {getInitials(host.name || "Anfitrión")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(host.id, e)}
                        className="text-xs w-full cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-center">Máx. 5MB</p>
                    </div>

                    {!host.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => handleSetPrimary(host.id)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Hacer Principal
                      </Button>
                    )}
                  </div>

                  {/* Columna de Información */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`host-name-${host.id}`}>Nombre del Anfitrión</Label>
                        <Input
                          id={`host-name-${host.id}`}
                          value={host.name || ""}
                          onChange={(e) => handleUpdateHost(host.id, "name", e.target.value)}
                          placeholder="Nombre del anfitrión"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`host-since-${host.id}`}>Anfitrión desde (año)</Label>
                        <Input
                          id={`host-since-${host.id}`}
                          value={host.hostSince || ""}
                          onChange={(e) => handleUpdateHost(host.id, "hostSince", e.target.value)}
                          placeholder="2023"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`host-bio-${host.id}`}>Biografía (opcional)</Label>
                      <Textarea
                        id={`host-bio-${host.id}`}
                        value={host.bio || ""}
                        onChange={(e) => handleUpdateHost(host.id, "bio", e.target.value)}
                        placeholder="Breve descripción sobre el anfitrión..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`host-primary-${host.id}`}
                          checked={host.isPrimary || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleSetPrimary(host.id)
                            }
                          }}
                          disabled={host.isPrimary}
                        />
                        <Label htmlFor={`host-primary-${host.id}`} className="text-sm">
                          Anfitrión principal
                        </Label>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveHost(host.id)}
                        disabled={localHosts.length === 1} // No permitir eliminar si es el único anfitrión
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default HostsManager
