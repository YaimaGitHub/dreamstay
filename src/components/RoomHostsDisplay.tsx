import { User, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HostInfo } from "@/types/room"

interface RoomHostsDisplayProps {
  hosts?: HostInfo[]
  className?: string
}

const RoomHostsDisplay = ({ hosts, className = "" }: RoomHostsDisplayProps) => {
  // Si no hay anfitriones configurados, mostrar un anfitrión por defecto
  const defaultHost: HostInfo = {
    id: 0,
    name: "Eliezer",
    hostSince: "2017",
    bio: "Anfitrión experimentado con años de experiencia en hospitalidad",
    isPrimary: true,
  }

  const displayHosts = hosts && hosts.length > 0 ? hosts : [defaultHost]

  // Encontrar el anfitrión principal
  const primaryHost = displayHosts.find((host) => host.isPrimary) || displayHosts[0]

  // Filtrar coanfitriones (todos excepto el principal)
  const coHosts = displayHosts.filter((host) => host.id !== primaryHost.id)

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold">Anfitrión</h2>

      {/* Anfitrión Principal */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-3 border-b">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500">Anfitrión Principal</Badge>
            <span className="text-sm text-muted-foreground">Anfitrión desde {primaryHost.hostSince}</span>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {primaryHost.avatar ? (
                <img
                  src={primaryHost.avatar || "/placeholder.svg"}
                  alt={primaryHost.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{primaryHost.name}</h3>
              {primaryHost.bio && <p className="text-muted-foreground mt-1">{primaryHost.bio}</p>}

              {primaryHost.phone && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                    <a href={`tel:${primaryHost.phone}`}>
                      <Phone className="h-4 w-4" />
                      <span>Llamar</span>
                    </a>
                  </Button>

                  <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                    <a
                      href={`https://wa.me/${primaryHost.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coanfitriones */}
      {coHosts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Coanfitriones</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {coHosts.map((host) => (
              <Card key={host.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {host.avatar ? (
                      <img
                        src={host.avatar || "/placeholder.svg"}
                        alt={host.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{host.name}</h4>
                      <span className="text-xs text-muted-foreground">Desde {host.hostSince}</span>
                    </div>

                    {host.phone && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" asChild>
                          <a href={`tel:${host.phone}`}>
                            <Phone className="h-3 w-3 mr-1" />
                            <span>Llamar</span>
                          </a>
                        </Button>

                        <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" asChild>
                          <a
                            href={`https://wa.me/${host.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span>WhatsApp</span>
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomHostsDisplay
