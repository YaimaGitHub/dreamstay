
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedRooms from "@/components/FeaturedRooms";
import ServicesList from "@/components/ServicesList";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedRooms />
        <ServicesList />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
