
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, Globe } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link to="/" className="flex items-center">
          <span className="text-terracotta font-bold text-2xl">EstanciaPlus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-terracotta transition-colors">
            Inicio
          </Link>
          <Link to="/habitaciones" className="font-medium hover:text-terracotta transition-colors">
            Habitaciones
          </Link>
          <Link to="/servicios" className="font-medium hover:text-terracotta transition-colors">
            Servicios
          </Link>
          <Link to="/contacto" className="font-medium hover:text-terracotta transition-colors">
            Contacto
          </Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="default" className="bg-terracotta hover:bg-terracotta/90">
            Reservar Ahora
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full border-b shadow-lg animate-fade-in">
          <nav className="container mx-auto py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="px-4 py-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/habitaciones"
              className="px-4 py-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Habitaciones
            </Link>
            <Link
              to="/servicios"
              className="px-4 py-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              to="/contacto"
              className="px-4 py-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <Button className="bg-terracotta hover:bg-terracotta/90">
              Reservar Ahora
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
