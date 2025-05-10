import { useTranslation } from "react-i18next"
import { Phone, Mail, MessageSquare } from "lucide-react"

export const ContactInfo = () => {
  const { t } = useTranslation()

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-rental-terra">{t("contact.getInTouch")}</h2>
        <p className="text-muted-foreground mb-6">{t("contact.getInTouchDesc")}</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-rental-light p-3 rounded-full">
              <Phone className="h-5 w-5 text-rental-terra" />
            </div>
            <div>
              <p className="font-medium">{t("contact.phoneTitle")}</p>
              <a href="tel:+5355555555" className="text-rental-terra hover:underline">
                +53 5 555 5555
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-rental-light p-3 rounded-full">
              <Mail className="h-5 w-5 text-rental-terra" />
            </div>
            <div>
              <p className="font-medium">{t("contact.emailTitle")}</p>
              <a href="mailto:info@dreamstay.com" className="text-rental-terra hover:underline">
                info@dreamstay.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-rental-light p-3 rounded-full">
              <MessageSquare className="h-5 w-5 text-rental-terra" />
            </div>
            <div>
              <p className="font-medium">{t("contact.whatsappTitle")}</p>
              <a
                href="https://wa.me/5355555555"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rental-terra hover:underline"
              >
                +53 5 555 5555
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-rental-light p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-rental-terra">{t("contact.visitUs")}</h3>
        <p className="text-muted-foreground mb-2">{t("footer.address")}</p>
        <p className="text-muted-foreground">{t("footer.city")}</p>
      </div>
    </div>
  )
}
