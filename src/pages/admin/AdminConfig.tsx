"use client"

import { useState } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigurationManager } from "@/components/admin/ConfigurationManager"
import { CurrencyManager } from "@/components/admin/CurrencyManager"
import { HostManager } from "@/components/admin/HostManager"
import { ReservedDatesManager } from "@/components/admin/ReservedDatesManager"
import { WhatsAppValidationDemo } from "@/components/admin/WhatsAppValidationDemo"

const AdminConfig = () => {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Administre la configuración general de la plataforma, monedas, anfitriones y más.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="currency">Monedas</TabsTrigger>
            <TabsTrigger value="hosts">Anfitriones</TabsTrigger>
            <TabsTrigger value="dates">Fechas Reservadas</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <ConfigurationManager />
          </TabsContent>

          <TabsContent value="currency" className="space-y-4">
            <CurrencyManager />
          </TabsContent>

          <TabsContent value="hosts" className="space-y-4">
            <HostManager />
          </TabsContent>

          <TabsContent value="dates" className="space-y-4">
            <ReservedDatesManager />
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-4">
            <WhatsAppValidationDemo />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

export default AdminConfig
