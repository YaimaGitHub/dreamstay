"use client"

import type React from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { WhatsAppValidationDemo } from "@/components/admin/WhatsAppValidationDemo"

const WhatsAppValidationTest: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Prueba de Validación de WhatsApp</h1>
          <p className="text-muted-foreground mt-2">
            Página de prueba para la validación en tiempo real de números de WhatsApp
          </p>
        </div>

        <WhatsAppValidationDemo />
      </div>
    </AdminLayout>
  )
}

export default WhatsAppValidationTest
