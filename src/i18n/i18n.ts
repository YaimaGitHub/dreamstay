import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import language resources
import esTranslation from "./locales/es.json"
import enTranslation from "./locales/en.json"

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: esTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    fallbackLng: "es",
    lng: "es", // Set Spanish as default language
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n
