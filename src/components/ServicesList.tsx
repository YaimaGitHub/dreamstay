import AdditionalServices, { sampleServices } from "./AdditionalServices"

const ServicesList = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros servicios</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una variedad de servicios para hacer tu estancia más cómoda y placentera. Desde traslados hasta
            experiencias gastronómicas.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <AdditionalServices services={sampleServices} showAddButtons={false} />
        </div>
      </div>
    </section>
  )
}

export default ServicesList
