import { Navbar } from "@/components/Navbar"
import { LanguageCurrencyHeader } from "@/components/LanguageCurrencyHeader"
import { Footer } from "@/components/Footer"
import { useTranslation } from "react-i18next"

const About = () => {
  const { t } = useTranslation()

  return (
    <>
      <LanguageCurrencyHeader />
      <Navbar />

      <div className="container max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-rental-navy">{t("about.title")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1470"
              alt={t("about.familyPhotoAlt")}
              className="rounded-lg shadow-md w-full h-80 object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-rental-terra">{t("about.ourStory")}</h2>
            <p className="text-muted-foreground">{t("about.storyContent")}</p>
            <p className="text-muted-foreground">{t("about.storyContent2")}</p>
          </div>
        </div>

        <div className="bg-rental-light p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold text-rental-terra mb-4">{t("about.ourMission")}</h2>
          <p className="text-muted-foreground mb-4">{t("about.missionContent")}</p>
          <p className="text-muted-foreground">{t("about.missionContent2")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-rental-terra">{t("about.quality")}</h3>
            <p className="text-muted-foreground">{t("about.qualityDesc")}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-rental-terra">{t("about.comfort")}</h3>
            <p className="text-muted-foreground">{t("about.comfortDesc")}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-rental-terra">{t("about.experience")}</h3>
            <p className="text-muted-foreground">{t("about.experienceDesc")}</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default About
