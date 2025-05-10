
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomForm from "@/components/admin/RoomForm";
import { useRoomStore } from "@/contexts/RoomStoreContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AdminEditRoom = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { rooms } = useRoomStore();

  const roomId = id ? parseInt(id) : undefined;
  const room = roomId ? rooms.find(room => room.id === roomId) : undefined;

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  // Redirect if room not found
  if (roomId && !room) {
    navigate("/admin/dashboard");
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
          {room?.lastModified && (
            <div className="mt-2 text-sm text-muted-foreground">
              Última modificación: {format(new Date(room.lastModified), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es })}
            </div>
          )}
        </div>

        <RoomForm mode="edit" />
      </main>
      <Footer />
    </div>
  );
};

export default AdminEditRoom;
