import { useTranslation } from "react-i18next"

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-rental-light py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-rental-terra">{t("features.location")}</h3>
            <p className="text-muted-foreground">{t("features.locationDesc")}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-rental-terra">{t("features.amenities")}</h3>
            <p className="text-muted-foreground">{t("features.amenitiesDesc")}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-rental-terra">{t("features.service")}</h3>
            <p className="text-muted-foreground">{t("features.serviceDesc")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
