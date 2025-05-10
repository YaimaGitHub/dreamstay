import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { ContactFormData } from "./contactFormSchema"
import type { UseFormReturn } from "react-hook-form"

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormData>
}

export const ContactFormFields = ({ form }: ContactFormFieldsProps) => {
  const { t } = useTranslation()

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("contact.name")}</FormLabel>
            <FormControl>
              <Input placeholder={t("contact.namePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("contact.email")}</FormLabel>
            <FormControl>
              <Input placeholder={t("contact.emailPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("contact.subject")}</FormLabel>
            <FormControl>
              <Input placeholder={t("contact.subjectPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("contact.message")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("contact.messagePlaceholder")} className="min-h-32" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
