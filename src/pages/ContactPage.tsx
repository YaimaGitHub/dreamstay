"use client"

import type React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, Navigation, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
}

const ContactPage = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState<string>("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  // Número de WhatsApp del administrador
  const ADMIN_WHATSAPP = "54690878"

  // Obtener ubicación del usuario
  const getUserLocation = () => {
    setIsLoadingLocation(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("La geolocalización no está soportada en este navegador")
      setIsLoadingLocation(false)
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutos
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords

        try {
          // Obtener dirección usando reverse geocoding
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&language=es&pretty=1`,
          )

          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

          if (response.ok) {
            const data = await response.json()
            if (data.results && data.results[0]) {
              address = data.results[0].formatted || address
            }
          }

          setUserLocation({
            latitude,
            longitude,
            accuracy,
            address,
          })

          toast({
            title: "Ubicación obtenida",
            description: "Tu ubicación se ha actualizado correctamente",
          })
        } catch (error) {
          console.error("Error al obtener la dirección:", error)
          setUserLocation({
            latitude,
            longitude,
            accuracy,
          })
        }

        setIsLoadingLocation(false)
      },
      (error) => {
        let errorMessage = "Error desconocido al obtener la ubicación"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Información de ubicación no disponible."
            break
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado al obtener la ubicación."
            break
        }

        setLocationError(errorMessage)
        setIsLoadingLocation(false)

        toast({
          title: "Error de ubicación",
          description: errorMessage,
          variant: "destructive",
        })
      },
      options,
    )
  }

  // Cargar ubicación al montar el componente
  useEffect(() => {
    getUserLocation()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Formatear mensaje para WhatsApp
  const formatWhatsAppMessage = (data: typeof formData, location?: LocationData | null) => {
    const currentDate = new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })

    let message = `🏨 *NUEVO MENSAJE DE CONTACTO*

📝 *INFORMACIÓN DEL CLIENTE:*
• Nombre: ${data.name}
• Email: ${data.email}
• Asunto: ${data.subject}

💬 *MENSAJE:*
${data.message}

📅 *FECHA Y HORA:*
${currentDate}
`

    if (location) {
      message += `
📍 *UBICACIÓN DEL CLIENTE:*
• Coordenadas: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
• Precisión: ${Math.round(location.accuracy)}m
${location.address ? `• Dirección: ${location.address}` : ""}
• Ver en mapa: https://maps.google.com/?q=${location.latitude},${location.longitude}
`
    }

    message += `
✅ *Responde a este cliente lo antes posible.*
📧 *Email de respuesta:* ${data.email}`

    return message
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Formatear mensaje para WhatsApp
    const whatsappMessage = formatWhatsAppMessage(formData, userLocation)
    const encodedMessage = encodeURIComponent(whatsappMessage)

    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`

    // Simulación de envío del formulario
    setTimeout(() => {
      try {
        // Detectar si es móvil
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        if (isMobile) {
          // En móviles, usar location.href
          window.location.href = whatsappUrl
        } else {
          // En desktop, usar window.open
          const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer")
          if (!newWindow) {
            // Fallback si el popup es bloqueado
            window.location.href = whatsappUrl
          }
        }

        toast({
          title: "Mensaje enviado",
          description: "Tu mensaje ha sido enviado al administrador por WhatsApp.",
        })

        setFormData({ name: "", email: "", subject: "", message: "" })
        setIsSubmitted(true)

        // Reset the submitted state after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000)
      } catch (error) {
        toast({
          title: "Error al enviar",
          description: "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }

      setIsSubmitting(false)
    }, 1500)
  }

  // Generar URL del mapa con la ubicación del usuario
  const getMapUrl = () => {
    if (userLocation) {
      return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw901SwHSR3g&center=${userLocation.latitude},${userLocation.longitude}&zoom=15&maptype=roadmap`
    }

    // Mapa por defecto (ubicación genérica)
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414770757!3d6.5276316248171345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1623245249513!5m2!1sen!2sng"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-deepblue to-deepblue/90 text-white py-20 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">Contáctanos</h1>
              <p className="text-lg opacity-90 animate-slide-up-delay">
                Estamos aquí para ayudarte con cualquier pregunta o solicitud especial. No dudes en ponerte en contacto
                con nosotros.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="animate-slide-in-left">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-terracotta/20 text-terracotta p-2 rounded-full mr-3 animate-pulse-soft">
                  <Send className="h-5 w-5" />
                </span>
                Envíanos un mensaje
              </h2>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center animate-scale-in">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce-soft" />
                  <h3 className="text-xl font-semibold text-green-700 mb-2">¡Mensaje enviado!</h3>
                  <p className="text-green-600">
                    Tu mensaje ha sido enviado al administrador por WhatsApp. Te responderemos lo antes posible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 animate-stagger-children">
                  <div className="animate-slide-up-stagger-1">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Nombre completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full transition-all duration-300 focus:border-terracotta focus:ring-terracotta/20 focus:scale-[1.02]"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="animate-slide-up-stagger-2">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Correo electrónico *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full transition-all duration-300 focus:border-terracotta focus:ring-terracotta/20 focus:scale-[1.02]"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="animate-slide-up-stagger-3">
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Asunto *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full transition-all duration-300 focus:border-terracotta focus:ring-terracotta/20 focus:scale-[1.02]"
                      placeholder="¿Sobre qué nos escribes?"
                    />
                  </div>

                  <div className="animate-slide-up-stagger-4">
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Mensaje *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[150px] transition-all duration-300 focus:border-terracotta focus:ring-terracotta/20 focus:scale-[1.02]"
                      placeholder="Describe tu consulta o solicitud en detalle..."
                    />
                  </div>

                  {/* Información de ubicación */}
                  {userLocation && (
                    <div className="animate-slide-up-stagger-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">Tu ubicación será incluida</span>
                      </div>
                      <p className="text-xs text-blue-600">
                        {userLocation.address ||
                          `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
                      </p>
                    </div>
                  )}

                  <div className="animate-slide-up-stagger-5">
                    <Button
                      type="submit"
                      className="w-full bg-terracotta hover:bg-terracotta/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando por WhatsApp...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="mr-2 h-4 w-4" />
                          Enviar por WhatsApp
                        </span>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      El mensaje será enviado al administrador por WhatsApp
                    </p>
                  </div>
                </form>
              )}
            </div>

            <div className="animate-slide-in-right">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-terracotta/20 text-terracotta p-2 rounded-full mr-3 animate-pulse-soft">
                  <Phone className="h-5 w-5" />
                </span>
                Información de contacto
              </h2>

              <div className="space-y-6">
                <Card className="p-4 flex items-start hover:shadow-lg transition-all duration-300 hover:border-terracotta/30 group hover:-translate-y-1 animate-slide-up-stagger-1">
                  <div className="p-3 bg-gradient-to-br from-terracotta/20 to-terracotta/10 rounded-full mr-3 group-hover:bg-terracotta/30 transition-all duration-300 group-hover:scale-110">
                    <MapPin className="h-5 w-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dirección</h3>
                    <p className="text-muted-foreground mt-1">
                      Av. Principal 123, Ciudad Central
                      <br />
                      Código postal 12345
                    </p>
                  </div>
                </Card>

                <Card className="p-4 flex items-start hover:shadow-lg transition-all duration-300 hover:border-terracotta/30 group hover:-translate-y-1 animate-slide-up-stagger-2">
                  <div className="p-3 bg-gradient-to-br from-terracotta/20 to-terracotta/10 rounded-full mr-3 group-hover:bg-terracotta/30 transition-all duration-300 group-hover:scale-110">
                    <Phone className="h-5 w-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-muted-foreground mt-1">
                      <a
                        href={`https://wa.me/${ADMIN_WHATSAPP}`}
                        className="hover:text-terracotta transition-colors duration-200"
                      >
                        +{ADMIN_WHATSAPP}
                      </a>
                      <br />
                      <span className="text-xs text-green-600">Disponible 24/7</span>
                    </p>
                  </div>
                </Card>

                <Card className="p-4 flex items-start hover:shadow-lg transition-all duration-300 hover:border-terracotta/30 group hover:-translate-y-1 animate-slide-up-stagger-3">
                  <div className="p-3 bg-gradient-to-br from-terracotta/20 to-terracotta/10 rounded-full mr-3 group-hover:bg-terracotta/30 transition-all duration-300 group-hover:scale-110">
                    <Mail className="h-5 w-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium">Correo electrónico</h3>
                    <p className="text-muted-foreground mt-1">
                      <a
                        href="mailto:info@estanciaplus.com"
                        className="hover:text-terracotta transition-colors duration-200"
                      >
                        info@estanciaplus.com
                      </a>
                      <br />
                      <a
                        href="mailto:reservas@estanciaplus.com"
                        className="hover:text-terracotta transition-colors duration-200"
                      >
                        reservas@estanciaplus.com
                      </a>
                    </p>
                  </div>
                </Card>

                <Card className="p-4 flex items-start hover:shadow-lg transition-all duration-300 hover:border-terracotta/30 group hover:-translate-y-1 animate-slide-up-stagger-4">
                  <div className="p-3 bg-gradient-to-br from-terracotta/20 to-terracotta/10 rounded-full mr-3 group-hover:bg-terracotta/30 transition-all duration-300 group-hover:scale-110">
                    <Clock className="h-5 w-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium">Horario de atención</h3>
                    <div className="text-muted-foreground mt-1">
                      <p>Lunes - Viernes: 9:00 AM - 8:00 PM</p>
                      <p>Sábados: 10:00 AM - 6:00 PM</p>
                      <p>Domingos: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-8 animate-slide-up-stagger-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Tu ubicación actual</h3>
                  <Button
                    onClick={getUserLocation}
                    disabled={isLoadingLocation}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Navigation className="h-3 w-3 mr-1" />
                    )}
                    {isLoadingLocation ? "Obteniendo..." : "Actualizar"}
                  </Button>
                </div>

                {locationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{locationError}</p>
                  </div>
                )}

                {userLocation && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">Ubicación detectada</span>
                    </div>
                    <p className="text-xs text-green-600">
                      {userLocation.address ||
                        `${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`}
                    </p>
                    <p className="text-xs text-green-500 mt-1">Precisión: ~{Math.round(userLocation.accuracy)}m</p>
                  </div>
                )}

                <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <iframe
                    src={getMapUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Tu ubicación actual"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-muted/50 to-muted animate-fade-in-up">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 inline-block relative animate-slide-up">
              Preguntas frecuentes
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-terracotta rounded-full animate-expand-width"></span>
            </h2>

            <div className="max-w-3xl mx-auto text-left grid gap-4">
              <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-terracotta/30 hover:-translate-y-2 animate-slide-up-stagger-1">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="text-terracotta mr-2 animate-pulse-soft">01.</span>
                  ¿Cómo funciona el envío por WhatsApp?
                </h3>
                <p className="text-muted-foreground mt-2 pl-6">
                  Al enviar el formulario, se abrirá WhatsApp automáticamente con tu mensaje ya formateado y listo para
                  enviar al administrador. Tu ubicación también será incluida para un mejor servicio.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-terracotta/30 hover:-translate-y-2 animate-slide-up-stagger-2">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="text-terracotta mr-2 animate-pulse-soft">02.</span>
                  ¿Por qué necesitan mi ubicación?
                </h3>
                <p className="text-muted-foreground mt-2 pl-6">
                  Tu ubicación nos ayuda a brindarte un servicio más personalizado y eficiente. También nos permite
                  mostrarte el mapa centrado en tu posición actual para tu comodidad.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-terracotta/30 hover:-translate-y-2 animate-slide-up-stagger-3">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="text-terracotta mr-2 animate-pulse-soft">03.</span>
                  ¿Qué tan rápido responden?
                </h3>
                <p className="text-muted-foreground mt-2 pl-6">
                  Nuestro equipo está disponible 24/7 por WhatsApp. Generalmente respondemos en menos de 30 minutos
                  durante horario comercial y dentro de 2 horas fuera del horario comercial.
                </p>
              </div>
            </div>

            <div className="mt-10 animate-slide-up-delay">
              <Button
                variant="outline"
                className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Ver todas las preguntas frecuentes
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }

        @keyframes bounceSoft {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes expandWidth {
          from { width: 0; }
          to { width: 33.333333%; }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }

        .animate-slide-up-delay {
          animation: slideUp 0.8s ease-out 0.3s both;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-bounce-soft {
          animation: bounceSoft 2s infinite;
        }

        .animate-pulse-soft {
          animation: pulseSoft 2s infinite;
        }

        .animate-expand-width {
          animation: expandWidth 1s ease-out 0.5s both;
        }

        .animate-fade-in-up {
          animation: slideUp 1s ease-out;
        }

        .animate-slide-up-stagger-1 {
          animation: slideUp 0.6s ease-out 0.1s both;
        }

        .animate-slide-up-stagger-2 {
          animation: slideUp 0.6s ease-out 0.2s both;
        }

        .animate-slide-up-stagger-3 {
          animation: slideUp 0.6s ease-out 0.3s both;
        }

        .animate-slide-up-stagger-4 {
          animation: slideUp 0.6s ease-out 0.4s both;
        }

        .animate-slide-up-stagger-5 {
          animation: slideUp 0.6s ease-out 0.5s both;
        }
      `}</style>
    </div>
  )
}

export default ContactPage
