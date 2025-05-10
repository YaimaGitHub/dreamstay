
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomForm from "@/components/admin/RoomForm";

const AdminEditRoom = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar habitación</h1>
          <p className="text-muted-foreground">
            Modifique los detalles de la habitación
          </p>
        </div>

        <RoomForm mode="edit" />
      </main>
      <Footer />
    </div>
  );
};

export default AdminEditRoom;
