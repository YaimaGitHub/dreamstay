import { useDataStore } from "@/hooks/use-data-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileJson, RefreshCw, Database } from "lucide-react"

const SiteConfigStatus = () => {
  const { configSource, lastUpdated } = useDataStore()

  const formatDate = (date: Date | null) => {
    if (!date) return "Nunca"
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  let icon = <Database className="h-4 w-4" />
  let title = "Configuración predeterminada"
  let description = "El sitio está utilizando la configuración predeterminada."
  let variant: "default" | "destructive" | null = null

  if (configSource === "localStorage") {
    icon = <RefreshCw className="h-4 w-4" />
    title = "Configuración local"
    description = `El sitio está utilizando la configuración guardada localmente. Última actualización: ${formatDate(
      lastUpdated,
    )}`
  } else if (configSource === "file") {
    icon = <FileJson className="h-4 w-4" />
    title = "Configuración importada"
    description = `El sitio está utilizando la configuración importada desde un archivo. Última actualización: ${formatDate(
      lastUpdated,
    )}`
    variant = "default"
  }

  return (
    <Alert variant={variant} className="mb-6">
      <div className="flex items-center gap-2">
        {icon}
        <AlertTitle>{title}</AlertTitle>
      </div>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

export default SiteConfigStatus
