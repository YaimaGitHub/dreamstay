import { useTranslation } from "react-i18next"

export function Footer() {
  const { t, i18n } = useTranslation()

  // Get the brand name based on current language
  const getBrandName = () => {
    return i18n.language === "es" ? "La Terraza | Bendecida" : "The Terrace | Blessed"
  }

  return (
    <footer className="bg-rental-navy text-white py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{getBrandName()}</h3>
            <p className="text-sm text-gray-300">{t("footer.description")}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.contact")}</h3>
            <address className="text-sm text-gray-300 not-italic">
              <p className="mb-2">{t("footer.address")}</p>
              <p className="mb-2">{t("footer.city")}</p>
              <p className="mb-2">{t("footer.phone")}</p>
              <p>{t("footer.email")}</p>
            </address>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/" className="hover:text-rental-accent transition-colors">
                  {t("navbar.home")}
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-rental-accent transition-colors">
                  {t("navbar.about")}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-rental-accent transition-colors">
                  {t("navbar.contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {getBrandName()}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
