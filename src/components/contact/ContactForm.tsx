"use client"

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useContactForm } from "./useContactForm"
import { ContactFormFields } from "./ContactFormFields"

export const ContactForm = () => {
  const { t } = useTranslation()
  const { form, isSubmitting, onSubmit } = useContactForm()

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-rental-terra">{t("contact.sendMessage")}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ContactFormFields form={form} />

          <Button type="submit" className="w-full bg-rental-terra hover:bg-rental-terra/90" disabled={isSubmitting}>
            {isSubmitting ? t("contact.sending") : t("contact.send")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
