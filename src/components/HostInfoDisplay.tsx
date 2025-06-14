"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { getInitials, sanitizeImageUrl, validateHostInfo } from "@/utils/host-manager"
import { CalendarDays } from "lucide-react"

interface HostInfoDisplayProps {
  host: {
    name?: string
    since?: number
    photo?: string
    hostSince?: string
    avatar?: string
    bio?: string
    isPrimary?: boolean
    id?: number
  }
  variant?: "compact" | "full"
}

const HostInfoDisplay = ({ host, variant = "full" }: HostInfoDisplayProps) => {
  // Validar y completar información del anfitrión
  const validatedHost = validateHostInfo(host)
  const currentYear = new Date().getFullYear()

  // Calcular años como anfitrión
  const hostSinceYear = validatedHost.hostSince
    ? Number.parseInt(validatedHost.hostSince)
    : validatedHost.since || currentYear

  const yearsAsHost = currentYear - hostSinceYear

  // Sanitizar URL de la foto
  const photoUrl = sanitizeImageUrl(validatedHost.photo || validatedHost.avatar)

  if (variant === "compact") {
    return (
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={photoUrl || "/placeholder.svg"} alt={validatedHost.name} />
          <AvatarFallback className="bg-terracotta/20">{getInitials(validatedHost.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{validatedHost.name}</p>
          <p className="text-xs text-muted-foreground">
            Anfitrión desde {validatedHost.hostSince || validatedHost.since}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={photoUrl || "/placeholder.svg"} alt={validatedHost.name} />
            <AvatarFallback className="bg-terracotta/20 text-lg">{getInitials(validatedHost.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold">Anfitrión: {validatedHost.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-1 h-4 w-4" />
              <span>
                Anfitrión desde {validatedHost.hostSince || validatedHost.since} ({yearsAsHost}{" "}
                {yearsAsHost === 1 ? "año" : "años"})
              </span>
            </div>
            {validatedHost.bio && <p className="text-sm text-muted-foreground mt-2">{validatedHost.bio}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HostInfoDisplay
