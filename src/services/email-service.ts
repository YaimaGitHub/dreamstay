// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: "service_estanciaplus", // Reemplaza con tu Service ID
  templateId: "template_contact_form", // Reemplaza con tu Template ID
  publicKey: "YOUR_PUBLIC_KEY_HERE", // Reemplaza con tu Public Key
}

interface EmailData {
  name: string
  email: string
  subject: string
  message: string
}

export const sendContactEmail = async (formData: EmailData): Promise<boolean> => {
  try {
    // Verificar que EmailJS esté disponible
    if (typeof window === "undefined" || !window.emailjs) {
      console.error("EmailJS no está disponible")
      return false
    }

    // Enviar a infoestanciaplus@gmail.com
    const response1 = await window.emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_email: "infoestanciaplus@gmail.com",
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      },
      EMAILJS_CONFIG.publicKey,
    )

    // Enviar a reservasestanciaplus@gmail.com
    const response2 = await window.emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_email: "reservasestanciaplus@gmail.com",
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      },
      EMAILJS_CONFIG.publicKey,
    )

    console.log("Emails enviados exitosamente:", response1, response2)
    return true
  } catch (error) {
    console.error("Error enviando emails:", error)
    return false
  }
}

// Función de respaldo usando mailto
export const sendEmailViaMailto = (formData: EmailData): void => {
  const subject = encodeURIComponent(`Nuevo mensaje de contacto: ${formData.subject}`)
  const body = encodeURIComponent(`
Nombre: ${formData.name}
Email: ${formData.email}
Asunto: ${formData.subject}

Mensaje:
${formData.message}

---
Este mensaje fue enviado desde el formulario de contacto de Estancia Plus.
  `)

  const mailtoLink = `mailto:infoestanciaplus@gmail.com,reservasestanciaplus@gmail.com?subject=${subject}&body=${body}`
  window.open(mailtoLink, "_blank")
}

// Declaración de tipos para EmailJS
declare global {
  interface Window {
    emailjs: {
      send: (serviceId: string, templateId: string, templateParams: any, publicKey: string) => Promise<any>
      init: (publicKey: string) => void
    }
  }
}
