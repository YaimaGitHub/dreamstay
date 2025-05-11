import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Footer = () => {
  return (
    <footer className="bg-deepblue text-white">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EstanciaPlus</h3>
            <p className="text-gray-300 mb-4">
              Ofrecemos habitaciones exclusivas con servicios personalizados para una experiencia única. Tu comodidad es
              nuestra prioridad.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/habitaciones" className="text-gray-300 hover:text-white transition-colors">
                  Habitaciones
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-300 hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contáctanos</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Av. Principal 123, Ciudad Central</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-gray-300">+1 234 567 890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-gray-300">info@estanciaplus.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Boletín Informativo</h4>
            <p className="text-gray-300 mb-4">Suscríbete para recibir ofertas especiales y novedades</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="bg-deepblue border-white/20 text-white"
              />
              <Button className="bg-terracotta hover:bg-terracotta/90">Suscribir</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} EstanciaPlus. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 text-sm text-gray-300">
            <Link to="/terminos" className="hover:text-white transition-colors">
              Términos y condiciones
            </Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
