
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRoomStore } from "@/contexts/RoomStoreContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const { rooms, toggleRoomAvailability, deleteRoom } = useRoomStore();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  const handleToggleAvailability = (id: number) => {
    toggleRoomAvailability(id);
    toast.success("Estado de disponibilidad actualizado");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Está seguro de eliminar esta habitación? Esta acción no se puede deshacer.")) {
      deleteRoom(id);
      toast.success("Habitación eliminada correctamente");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/edit-room/${id}`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel Administrativo</h1>
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gestión de Habitaciones</h2>
            <Button 
              className="bg-terracotta hover:bg-terracotta/90"
              onClick={() => navigate("/admin/add-room")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar habitación
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.id}</TableCell>
                    <TableCell>
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img 
                          src={room.image} 
                          alt={room.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{room.title}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>${room.price}/noche</TableCell>
                    <TableCell>
                      <Badge 
                        className={room.isAvailable ? "bg-green-500" : "bg-red-500"}
                      >
                        {room.isAvailable ? "Disponible" : "No disponible"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(room.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleAvailability(room.id)}
                        >
                          {room.isAvailable ? "Deshabilitar" : "Habilitar"}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(room.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium">Total de habitaciones</h3>
              <p className="text-3xl font-bold">{rooms.length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium">Habitaciones disponibles</h3>
              <p className="text-3xl font-bold">{rooms.filter(r => r.isAvailable).length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium">Habitaciones ocupadas</h3>
              <p className="text-3xl font-bold">{rooms.filter(r => !r.isAvailable).length}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
