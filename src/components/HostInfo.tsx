import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HostInfoProps {
  name: string
  since: number
  photo?: string
}

const HostInfo = ({ name, since, photo }: HostInfoProps) => {
  const yearsAsHost = new Date().getFullYear() - since
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="flex items-center space-x-4 p-5 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md animate-fadeIn">
      <div className="transition-transform duration-300 hover:scale-110">
        <Avatar className="h-16 w-16 border-2 border-terracotta/20">
          <AvatarImage src={photo || "/placeholder.svg"} alt={name} />
          <AvatarFallback className="bg-terracotta/10 text-terracotta">{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h3 className="text-lg font-medium">Anfitrión: {name}</h3>
        <p className="text-sm text-muted-foreground opacity-0 animate-fadeIn">
          Anfitrión desde {since} {yearsAsHost > 0 && `(${yearsAsHost} ${yearsAsHost === 1 ? "año" : "años"})`}
        </p>
      </div>
    </div>
  )
}

export default HostInfo
