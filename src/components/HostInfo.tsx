import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Calendar } from "lucide-react"

interface HostInfoProps {
  host?: {
    name: string
    bio: string
    photo: string
    experience?: number
    contact?: string
  }
}

const HostInfo = ({ host }: HostInfoProps) => {
  if (!host || !host.name) return null

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="w-24 h-24 border-2 border-terracotta">
            <AvatarImage src={host.photo || "/placeholder.svg"} alt={`Foto de ${host.name}`} />
            <AvatarFallback className="bg-terracotta/20 text-terracotta">
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>

          <div className="space-y-3 flex-1">
            <div>
              <h3 className="text-xl font-semibold">Tu anfitrión: {host.name}</h3>
              {host.experience && host.experience > 0 && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {host.experience} {host.experience === 1 ? "año" : "años"} como anfitrión
                </p>
              )}
              {host.contact && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {host.contact}
                </p>
              )}
            </div>

            <div className="text-sm">
              <p className="leading-relaxed">{host.bio}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HostInfo
