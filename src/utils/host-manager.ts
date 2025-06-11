// Función para obtener las iniciales de un nombre
export const getInitials = (name?: string): string => {
  if (!name) return "?"

  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

// Función para sanitizar URLs de imágenes
export const sanitizeImageUrl = (url?: string): string => {
  if (!url) return ""

  // Si la URL ya es absoluta, devolverla tal cual
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // Si es una ruta relativa, asegurarse de que comience con /
  if (!url.startsWith("/")) {
    return `/${url}`
  }

  return url
}

// Función para validar y completar información del anfitrión
export const validateHostInfo = (host: any) => {
  const defaultHost = {
    name: "Anfitrión",
    since: new Date().getFullYear(),
    hostSince: new Date().getFullYear().toString(),
    photo: "",
    avatar: "",
    bio: "",
    isPrimary: true,
  }

  if (!host) return defaultHost

  return {
    ...defaultHost,
    ...host,
    name: host.name || defaultHost.name,
    since: host.since || defaultHost.since,
    hostSince: host.hostSince || host.since?.toString() || defaultHost.hostSince,
    photo: host.photo || host.avatar || defaultHost.photo,
    avatar: host.avatar || host.photo || defaultHost.avatar,
    bio: host.bio || defaultHost.bio,
    isPrimary: host.isPrimary !== undefined ? host.isPrimary : defaultHost.isPrimary,
  }
}
