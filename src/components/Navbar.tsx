"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { Button } from "@/components/ui/button"
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated } = useAdminAuth()
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-terracotta">
              Bespoke Room Retreat
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-terracotta">
              Inicio
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-terracotta">
              Habitaciones
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-terracotta">
              Servicios
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-terracotta">
              Contacto
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <SyncStatusIndicator />
                <Link to="/admin">
                  <Button variant="outline">Panel Admin</Button>
                </Link>
              </div>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline">Iniciar sesión</Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && <SyncStatusIndicator />}
            <button
              onClick={toggleMenu}
              className="ml-2 text-gray-700 hover:text-terracotta focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-terracotta py-2" onClick={closeMenu}>
                Inicio
              </Link>
              <Link to="/rooms" className="text-gray-700 hover:text-terracotta py-2" onClick={closeMenu}>
                Habitaciones
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-terracotta py-2" onClick={closeMenu}>
                Servicios
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-terracotta py-2" onClick={closeMenu}>
                Contacto
              </Link>
              {isAuthenticated ? (
                <Link to="/admin" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">
                    Panel Admin
                  </Button>
                </Link>
              ) : (
                <Link to="/admin/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">
                    Iniciar sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
