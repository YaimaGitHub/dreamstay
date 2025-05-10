import type React from "react"
import * as LucideIcons from "lucide-react"

// Función para obtener un componente de icono por su nombre
export function getIconByName(iconName: string): React.ComponentType<any> | null {
  if (iconName in LucideIcons) {
    return LucideIcons[iconName as keyof typeof LucideIcons]
  }
  return null
}
