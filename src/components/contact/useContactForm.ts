"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/sonner"
import { useTranslation } from "react-i18next"
import { contactFormSchema, type ContactFormData } from "./contactFormSchema"

export const useContactForm = () => {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // En un entorno real, aquí enviaríamos el correo a través de una API
      console.log("Form data to be sent:", data)

      // Simulamos el envío
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(t("contact.successMessage"))
      form.reset()
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error(t("contact.errorMessage"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  }
}
