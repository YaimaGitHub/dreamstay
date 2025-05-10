import { Navbar } from "@/components/Navbar"
import { LanguageCurrencyHeader } from "@/components/LanguageCurrencyHeader"
import { Footer } from "@/components/Footer"
import { useTranslation } from "react-i18next"
import { ContactForm } from "@/components/contact/ContactForm"
import { ContactInfo } from "@/components/contact/ContactInfo"

const Contact = () => {
  const { t } = useTranslation()

  return (
    <>
      <LanguageCurrencyHeader />
      <Navbar />

      <div className="container max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-rental-navy">{t("contact.title")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Contact
