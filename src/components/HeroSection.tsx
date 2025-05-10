
import SearchForm from "./SearchForm";

const HeroSection = () => {
  return (
    <section className="relative bg-deepblue">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-40" />
      <div className="relative container mx-auto py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center text-white mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Descubre tu alojamiento perfecto
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in">
            Habitaciones exclusivas con servicios personalizados para una experiencia única
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
