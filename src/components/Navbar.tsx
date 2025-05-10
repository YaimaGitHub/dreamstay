"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Navbar() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.about"), path: "/about" },
    { name: t("navbar.contact"), path: "/contact" },
  ]

  // Get the brand name based on current language
  const getBrandName = () => {
    return i18n.language === "es" ? "La Terraza | Bendecida" : "The Terrace | Blessed"
  }

  return (
    <header className="bg-white border-b">
      <div className="container flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-rental-terra transition-colors hover:text-rental-accent">
          {getBrandName()}
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="text-muted-foreground hover:text-rental-terra transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="mt-6 mb-8">
              <Link to="/" className="text-xl font-bold text-rental-terra" onClick={() => setIsOpen(false)}>
                {getBrandName()}
              </Link>
            </div>
            <nav className="flex flex-col space-y-4 mt-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-lg py-2 px-4 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
