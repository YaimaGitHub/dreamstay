// Configuración central de la plataforma
// Este archivo contiene todos los datos configurables de la aplicación

// Tipos para la configuración
export interface RoomImage {
  id: number
  url: string
  alt: string
}

export interface Room {
  id: number
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  features: string[]
  type: string
  area: number
  description?: string
  host?: string
  hostJoined?: string
  maxGuests?: number
  beds?: number
  bathrooms?: number
  amenities?: Amenity[]
  services?: Service[]
  images?: RoomImage[]
}

export interface Amenity {
  id: number
  name: string
  description: string
  icon: string // Nombre del icono (se convertirá a componente al renderizar)
}

export interface Service {
  id: number
  title: string
  description: string
  longDescription?: string
  price: number
  category: string
  icon: string // Nombre del icono (se convertirá a componente al renderizar)
  features?: string[]
}

export interface Testimonial {
  id: number
  name: string
  location: string
  text: string
  rating: number
  avatar: string
}

export interface AppConfig {
  rooms: Room[]
  services: Service[]
  amenities: Amenity[]
  testimonials: Testimonial[]
  siteInfo: {
    name: string
    address: string
    phone: string
    email: string
    socialMedia: {
      facebook: string
      twitter: string
      instagram: string
    }
    checkInTime: string
    checkOutTime: string
  }
}

// Configuración por defecto
const defaultConfig: AppConfig = {
  rooms: [
    {
      id: 1,
      title: "Suite Premium",
      location: "Centro de la ciudad",
      price: 120,
      rating: 4.9,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      features: ["Baño privado", "WiFi gratis", "Desayuno incluido"],
      type: "Suite",
      area: 35,
    },
    {
      id: 2,
      title: "Habitación Confort",
      location: "Zona Turística",
      price: 85,
      rating: 4.7,
      reviews: 95,
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      features: ["Baño privado", "WiFi gratis", "TV de pantalla plana"],
      type: "Estándar",
      area: 25,
    },
    {
      id: 3,
      title: "Suite Ejecutiva",
      location: "Distrito Financiero",
      price: 150,
      rating: 5.0,
      reviews: 87,
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      features: ["Baño de lujo", "WiFi de alta velocidad", "Desayuno gourmet"],
      type: "Suite",
      area: 40,
    },
    {
      id: 4,
      title: "Habitación Familiar",
      location: "Zona Residencial",
      price: 110,
      rating: 4.6,
      reviews: 72,
      image:
        "https://images.unsplash.com/photo-1505692952047-9e5ddd7c1664?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      features: ["2 camas dobles", "WiFi gratis", "TV por cable"],
      type: "Familiar",
      area: 38,
    },
    {
      id: 5,
      title: "Habitación Económica",
      location: "Cerca del centro",
      price: 65,
      rating: 4.3,
      reviews: 58,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      features: ["Baño compartido", "WiFi gratis", "Escritorio"],
      type: "Económica",
      area: 18,
    },
    {
      id: 6,
      title: "Junior Suite",
      location: "Zona Comercial",
      price: 130,
      rating: 4.8,
      reviews: 103,
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      features: ["Minibar", "WiFi gratis", "Desayuno buffet"],
      type: "Suite",
      area: 32,
    },
  ],
  services: [
    {
      id: 1,
      title: "Traslado desde el aeropuerto",
      description: "Te recogemos en el aeropuerto y te llevamos directamente a tu habitación.",
      longDescription:
        "Nuestro servicio de traslado premium te garantiza un viaje cómodo desde el aeropuerto hasta tu alojamiento. Contamos con conductores profesionales y vehículos modernos totalmente equipados para que tu viaje sea placentero. Confirmamos tu vuelo de antemano y nos aseguramos de estar esperándote a tu llegada.",
      price: 25,
      category: "transporte",
      icon: "Plane",
      features: [
        "Monitoreo de vuelos en tiempo real",
        "Espera de hasta 60 minutos sin cargo adicional",
        "Vehículos confortables y modernos",
        "Conductores profesionales que hablan varios idiomas",
      ],
    },
    {
      id: 2,
      title: "Alquiler de vehículos",
      description: "Contamos con una flota de vehículos disponibles para que explores la ciudad.",
      longDescription:
        "Explora los alrededores a tu ritmo con nuestro servicio de alquiler de vehículos. Ofrecemos una amplia gama de opciones, desde económicos hasta de lujo. Todos nuestros vehículos se mantienen en excelentes condiciones y se limpian a fondo entre alquileres. Incluimos seguro básico y asistencia en carretera 24/7.",
      price: 45,
      category: "transporte",
      icon: "Car",
      features: [
        "Kilometraje ilimitado",
        "Seguro básico incluido",
        "Entrega y recogida en el alojamiento",
        "Modelos recientes y bien mantenidos",
      ],
    },
    {
      id: 3,
      title: "Tours guiados",
      description: "Conoce los mejores lugares de la ciudad con nuestros guías expertos.",
      longDescription:
        "Descubre los secretos locales, la historia y la cultura con nuestros tours guiados personalizados. Nuestros guías son locales apasionados con amplio conocimiento de la zona y te mostrarán tanto los lugares turísticos populares como gemas ocultas que solo los lugareños conocen. Ofrecemos tours a pie, en bicicleta o en vehículo, según tus preferencias.",
      price: 30,
      category: "experiencias",
      icon: "MapPin",
      features: [
        "Guías locales expertos certificados",
        "Grupos pequeños para experiencia personalizada",
        "Variedad de rutas disponibles",
        "Incluye entrada a atracciones seleccionadas",
      ],
    },
    {
      id: 4,
      title: "WiFi de alta velocidad",
      description: "Conexión premium para que puedas trabajar o entretenerte sin interrupciones.",
      longDescription:
        "Mantente conectado con nuestra red WiFi premium de alta velocidad, ideal para streaming, videollamadas o trabajo remoto. Ofrecemos velocidades superiores a 300 Mbps con conexión estable en toda la propiedad. Cada habitación cuenta con su propio repetidor para garantizar una señal potente en todo momento.",
      price: 10,
      category: "comodidades",
      icon: "Wifi",
      features: [
        "Velocidad de 300+ Mbps",
        "Conexión segura y encriptada",
        "Soporte técnico disponible",
        "Sin límite de dispositivos",
      ],
    },
    {
      id: 5,
      title: "Desayuno gourmet",
      description: "Disfruta de un desayuno completo preparado con ingredientes locales y frescos.",
      longDescription:
        "Comienza tu día con un delicioso desayuno gourmet servido en tu habitación o en nuestro comedor. Utilizamos ingredientes frescos y locales para crear una experiencia culinaria excepcional. Ofrecemos opciones vegetarianas, veganas y para dietas especiales, solo tienes que avisarnos con anticipación.",
      price: 15,
      category: "gastronomía",
      icon: "Coffee",
      features: [
        "Ingredientes frescos y locales",
        "Opciones para dietas especiales disponibles",
        "Servido entre 7:00 y 10:30 AM",
        "Incluye café de especialidad o té gourmet",
      ],
    },
    {
      id: 6,
      title: "Servicio de restaurante",
      description: "Saborea la gastronomía local en nuestro restaurante o en la comodidad de tu habitación.",
      longDescription:
        "Nuestro servicio de restaurante ofrece lo mejor de la gastronomía local e internacional. Puedes disfrutarlo en nuestro elegante comedor o pedir que te lo lleven a tu habitación sin costo adicional. Nuestro chef utiliza ingredientes de temporada para crear platos exclusivos que deleitarán tu paladar.",
      price: 20,
      category: "gastronomía",
      icon: "Utensils",
      features: [
        "Menú variado con opciones locales e internacionales",
        "Servicio a la habitación sin cargo adicional",
        "Horario de comidas extendido",
        "Bar de cócteles premium",
      ],
    },
    {
      id: 7,
      title: "Servicio de lavandería",
      description: "Servicio express de lavado y planchado disponible todos los días.",
      longDescription:
        "Mantén tu ropa impecable durante tu estancia con nuestro servicio de lavandería premium. Ofrecemos lavado, secado y planchado con la máxima atención a los detalles. El servicio estándar se entrega en 24 horas, pero también disponemos de servicio express con entrega en el mismo día para emergencias.",
      price: 18,
      category: "comodidades",
      icon: "Shirt",
      features: [
        "Servicio estándar (24h) y express (mismo día)",
        "Cuidado especial para prendas delicadas",
        "Planchado profesional",
        "Recogida y entrega en tu habitación",
      ],
    },
    {
      id: 8,
      title: "Servicio de concierge",
      description: "Asistencia personalizada para reservas, recomendaciones y más.",
      longDescription:
        "Nuestro servicio de concierge está disponible 24/7 para ayudarte con cualquier solicitud durante tu estancia. Podemos ayudarte con reservas en restaurantes, entradas para eventos, recomendaciones locales, y cualquier otra necesidad que puedas tener. Nuestro experimentado equipo se asegurará de que tu estancia sea perfecta en todos los aspectos.",
      price: 0,
      category: "experiencias",
      icon: "Key",
      features: [
        "Disponible 24 horas al día, 7 días a la semana",
        "Reservas en restaurantes locales",
        "Información turística personalizada",
        "Gestión de transporte y servicios especiales",
      ],
    },
  ],
  amenities: [
    {
      id: 1,
      name: "Cama king size",
      description: "Cama de alta calidad con ropa de cama premium",
      icon: "Bed",
    },
    {
      id: 2,
      name: "WiFi de alta velocidad",
      description: "Conexión de Internet rápida y confiable",
      icon: "Wifi",
    },
    {
      id: 3,
      name: "Desayuno incluido",
      description: "Desayuno buffet con opciones frescas y locales",
      icon: "Coffee",
    },
    {
      id: 4,
      name: "Smart TV",
      description: "TV de 55 pulgadas con Netflix y Amazon Prime",
      icon: "Tv",
    },
    {
      id: 5,
      name: "Baño de lujo",
      description: "Con ducha de lluvia y productos orgánicos",
      icon: "Bath",
    },
    {
      id: 6,
      name: "Aire acondicionado",
      description: "Control de temperatura individual",
      icon: "Wind",
    },
  ],
  testimonials: [
    {
      id: 1,
      name: "María López",
      location: "Madrid, España",
      text: "Una experiencia increíble. La habitación era exactamente como en las fotos, muy limpia y con todas las comodidades. El servicio de traslado desde el aeropuerto fue puntual y muy profesional.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      location: "Buenos Aires, Argentina",
      text: "El desayuno gourmet fue lo mejor de mi estancia. La habitación tenía una vista espectacular y la atención del personal fue excepcional. Definitivamente volveré.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Ana Martínez",
      location: "Ciudad de México",
      text: "Me encantó la ubicación, cerca de todo lo importante. La habitación era espaciosa y muy bien decorada. Los servicios adicionales valen cada centavo.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ],
  siteInfo: {
    name: "EstanciaPlus",
    address: "Av. Principal 123, Ciudad Central",
    phone: "+1 234 567 890",
    email: "info@estanciaplus.com",
    socialMedia: {
      facebook: "https://facebook.com/estanciaplus",
      twitter: "https://twitter.com/estanciaplus",
      instagram: "https://instagram.com/estanciaplus",
    },
    checkInTime: "15:00",
    checkOutTime: "12:00",
  },
}

// Singleton para manejar la configuración
class ConfigManager {
  private static instance: ConfigManager
  private config: AppConfig

  private constructor() {
    this.config = { ...defaultConfig }
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  // Obtener la configuración actual
  public getConfig(): AppConfig {
    return this.config
  }

  // Actualizar la configuración completa
  public updateConfig(newConfig: AppConfig): void {
    this.config = { ...newConfig }
  }

  // Exportar la configuración a un archivo JSON
  public exportConfig(): string {
    return JSON.stringify(this.config, null, 2)
  }

  // Importar la configuración desde un archivo JSON
  public importConfig(jsonConfig: string): boolean {
    try {
      const parsedConfig = JSON.parse(jsonConfig) as AppConfig
      this.updateConfig(parsedConfig)
      return true
    } catch (error) {
      console.error("Error al importar la configuración:", error)
      return false
    }
  }

  // Restablecer la configuración a los valores predeterminados
  public resetConfig(): void {
    this.config = { ...defaultConfig }
  }
}

// Exportar la instancia del ConfigManager
export const configManager = ConfigManager.getInstance()

// Exportar la configuración por defecto para referencia
export { defaultConfig }
