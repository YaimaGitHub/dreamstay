"use client"

import type React from "react"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

const ContactPage = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío del formulario
    setTimeout(() => {
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos lo antes posible.",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-deepblue text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contáctanos</h1>
              <p className="text-lg opacity-90">
                Estamos aquí para ayudarte con cualquier pregunta o solicitud especial. No dudes en ponerte en contacto
                con nosotros.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nombre completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Asunto
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="¿Sobre qué nos escribes?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full min-h-[150px]"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="mr-2">Enviando...</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar mensaje
                    </span>
                  )}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>

              <div className="space-y-6">
                <Card className="p-4 flex items-start">
                  <MapPin className="h-5 w-5 text-terracotta mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Dirección</h3>
                    <p className="text-muted-foreground mt-1">
                      Av. Principal 123, Ciudad Central
                      <br />
                      Código postal 12345
                    </p>
                  </div>
                </Card>

                <Card className="p-4 flex items-start">
                  <Phone className="h-5 w-5 text-terracotta mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Teléfono</h3>
                    <p className="text-muted-foreground mt-1">
                      +1 234 567 890
                      <br />
                      +1 234 567 891
                    </p>
                  </div>
                </Card>

                <Card className="p-4 flex items-start">
                  <Mail className="h-5 w-5 text-terracotta mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Correo electrónico</h3>
                    <p className="text-muted-foreground mt-1">
                      info@estanciaplus.com
                      <br />
                      reservas@estanciaplus.com
                    </p>
                  </div>
                </Card>

                <Card className="p-4 flex items-start">
                  <Clock className="h-5 w-5 text-terracotta mr-3 mt-1" />
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

              <div className="mt-8">
                <h3 className="font-medium mb-2">Encuéntranos aquí</h3>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {/* Aquí iría un mapa de Google Maps o similar */}
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    Mapa de ubicación
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Preguntas frecuentes</h2>
            <div className="max-w-3xl mx-auto text-left grid gap-4">
              <div className="bg-card rounded-lg p-4">
                <h3 className="font-semibold text-lg">¿Cuál es la hora de check-in y check-out?</h3>
                <p className="text-muted-foreground mt-2">
                  El check-in es a partir de las 3:00 PM y el check-out hasta las 12:00 PM. Podemos acomodar llegadas
                  tempranas o salidas tardías con previo aviso.
                </p>
              </div>
              <div className="bg-card rounded-lg p-4">
                <h3 className="font-semibold text-lg">¿Se admiten mascotas?</h3>
                <p className="text-muted-foreground mt-2">
                  Ofrecemos habitaciones específicas que aceptan mascotas. Por favor, infórmanos al momento de la
                  reserva si viajarás con tu mascota.
                </p>
              </div>
              <div className="bg-card rounded-lg p-4">
                <h3 className="font-semibold text-lg">¿Hay estacionamiento disponible?</h3>
                <p className="text-muted-foreground mt-2">
                  Sí, contamos con estacionamiento gratuito para nuestros huéspedes. También ofrecemos servicio de valet
                  parking con costo adicional.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
