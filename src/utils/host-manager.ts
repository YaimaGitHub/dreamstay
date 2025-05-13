/**
 * Utilidades para manejar la información del anfitrión
 */

// Obtener iniciales de un nombre
export const getInitials = (name: string): string => {
  if (!name) return "AN"

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Sanitizar URL de imagen para asegurar que sea HTTPS
export const sanitizeImageUrl = (url: string | undefined): string => {
  if (!url) return ""

  // Si es una imagen en base64, devolverla tal cual
  if (url.startsWith("data:image/")) {
    return url
  }

  // Convertir HTTP a HTTPS
  if (url.startsWith("http:")) {
    return url.replace("http:", "https:")
  }

  // Si es una ruta relativa, asegurarse de que comience con /
  if (!url.startsWith("http") && !url.startsWith("/")) {
    return `/${url}`
  }

  return url
}

// Obtener información predeterminada del anfitrión
export const getDefaultHostInfo = () => {
  return {
    name: "Anfitrión",
    since: new Date().getFullYear() - 3,
    photo: "",
  }
}

// Validar y completar información del anfitrión
export const validateHostInfo = (host: any) => {
  const defaultHost = getDefaultHostInfo()

  if (!host) return defaultHost

  return {
    name: host.name || defaultHost.name,
    since: host.since || defaultHost.since,
    photo: sanitizeImageUrl(host.photo) || "",
  }
}
