
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "María López",
    location: "Madrid, España",
    text: "Una experiencia increíble. La habitación era exactamente como en las fotos, muy limpia y con todas las comodidades. El servicio de traslado desde el aeropuerto fue puntual y muy profesional.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    location: "Buenos Aires, Argentina",
    text: "El desayuno gourmet fue lo mejor de mi estancia. La habitación tenía una vista espectacular y la atención del personal fue excepcional. Definitivamente volveré.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Ana Martínez",
    location: "Ciudad de México",
    text: "Me encantó la ubicación, cerca de todo lo importante. La habitación era espaciosa y muy bien decorada. Los servicios adicionales valen cada centavo.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Lo que dicen nuestros huéspedes</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experiencias reales de clientes que han disfrutado de nuestras habitaciones y servicios
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="bg-white border border-border/50">
            <CardContent className="pt-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? "fill-accent text-accent" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="italic mb-4">"{testimonial.text}"</p>
            </CardContent>
            <CardFooter className="flex items-center border-t pt-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-medium">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
