"use client"
import { useTranslation } from "react-i18next"
import { useCurrency, type CurrencyCode } from "@/contexts/CurrencyContext"
import { Euro, DollarSign, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageCurrencyHeader() {
  const { t, i18n } = useTranslation()
  const { currency, setCurrency } = useCurrency()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [animateLanguage, setAnimateLanguage] = useState(false)
  const [animateCurrency, setAnimateCurrency] = useState(false)

  const changeLanguage = (language: string) => {
    setAnimateLanguage(true)
    i18n.changeLanguage(language)

    // Reset animation after it completes
    setTimeout(() => {
      setAnimateLanguage(false)
    }, 1000)
  }

  const changeCurrency = (newCurrency: CurrencyCode) => {
    setAnimateCurrency(true)
    setCurrency(newCurrency)

    // Reset animation after it completes
    setTimeout(() => {
      setAnimateCurrency(false)
    }, 1000)
  }

  const getCurrencyIcon = (currencyCode: CurrencyCode) => {
    switch (currencyCode) {
      case "EUR":
        return <Euro className="h-4 w-4 text-rental-terra" />
      case "USD":
        return <DollarSign className="h-4 w-4 text-rental-terra" />
      default:
        return <span className="text-rental-terra font-bold">$</span>
    }
  }

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case "en":
        return "🇺🇸"
      case "es":
        return "🇪🇸"
      default:
        return "🇪🇸"
    }
  }

  return (
    <div className="bg-rental-light py-2 border-b">
      <div className="container flex justify-end items-center space-x-4 text-sm">
        {/* Language Selector with Animation */}
        <DropdownMenu open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1.5 px-2 h-8 text-sm font-medium transition-all duration-300 hover:text-rental-terra",
                animateLanguage && "animate-language-change",
              )}
            >
              <span className="text-base mr-1">{getLanguageFlag(i18n.language)}</span>
              <span>{i18n.language === "es" ? "Español" : "English"}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 animate-in fade-in-80 slide-in-from-top-5">
            <DropdownMenuItem
              onClick={() => changeLanguage("es")}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                i18n.language === "es" && "bg-rental-light font-medium",
              )}
            >
              <span className="text-base">🇪🇸</span>
              <span>Español</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("en")}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                i18n.language === "en" && "bg-rental-light font-medium",
              )}
            >
              <span className="text-base">🇺🇸</span>
              <span>English</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Currency Selector with Animation */}
        <DropdownMenu open={isCurrencyOpen} onOpenChange={setIsCurrencyOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1.5 px-2 h-8 text-sm font-medium transition-all duration-300 hover:text-rental-terra",
                animateCurrency && "animate-currency-change",
              )}
            >
              {getCurrencyIcon(currency)}
              <span>{currency}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 animate-in fade-in-80 slide-in-from-top-5">
            <DropdownMenuItem
              onClick={() => changeCurrency("CUP")}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                currency === "CUP" && "bg-rental-light font-medium",
              )}
            >
              <span className="font-bold">$</span>
              <span>CUP</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeCurrency("USD")}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                currency === "USD" && "bg-rental-light font-medium",
              )}
            >
              <DollarSign className="h-4 w-4" />
              <span>USD</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeCurrency("EUR")}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                currency === "EUR" && "bg-rental-light font-medium",
              )}
            >
              <Euro className="h-4 w-4" />
              <span>EUR</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
