import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoomStore } from "@/contexts/RoomStoreContext";
import { Room } from "@/types/room";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Import refactored components
import BasicInfoFields from "@/components/admin/BasicInfoFields";
import FeatureManager from "@/components/admin/FeatureManager";
import ImageManager from "@/components/admin/ImageManager";
import ReservedDatesManager from "@/components/admin/ReservedDatesManager";
import { roomFormSchema, RoomFormValues } from "@/components/admin/RoomFormSchema";

type RoomFormProps = {
  mode: "add" | "edit";
};

const RoomForm = ({ mode }: RoomFormProps) => {
  const { rooms, addRoom, updateRoom } = useRoomStore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [features, setFeatures] = useState<string[]>([]);
  const [reservedDates, setReservedDates] = useState<DateRange | undefined>();
  const [roomImages, setRoomImages] = useState<{id: number, url: string, alt: string}[]>([]);
  const [lastModified, setLastModified] = useState<Date | null>(null);

  const roomId = id ? parseInt(id) : undefined;
  const currentRoom = roomId ? rooms.find(room => room.id === roomId) : undefined;
  
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: mode === "edit" && currentRoom
      ? {
          title: currentRoom.title,
          location: currentRoom.location,
          price: currentRoom.price,
          rating: currentRoom.rating,
          reviews: currentRoom.reviews,
          image: "",  // We'll handle images separately
          type: currentRoom.type,
          area: currentRoom.area,
          description: currentRoom.description || "",
          isAvailable: currentRoom.isAvailable,
          features: currentRoom.features,
          lastModified: currentRoom.lastModified ? new Date(currentRoom.lastModified) : new Date(),
        }
      : {
          title: "",
          location: "",
          price: 0,
          rating: 5,
          reviews: 0,
          image: "",
          type: "Estándar",
          area: 0,
          description: "",
          isAvailable: true,
          features: [],
          lastModified: new Date(),
        },
  });

  useEffect(() => {
    if (mode === "edit" && currentRoom) {
      setFeatures(currentRoom.features);
      
      if (currentRoom.images && currentRoom.images.length > 0) {
        setRoomImages(currentRoom.images);
      } else if (currentRoom.image) {
        // Si no hay imágenes pero hay una imagen principal, la añadimos al array
        setRoomImages([{
          id: 1,
          url: currentRoom.image,
          alt: currentRoom.title
        }]);
      }
      
      // Last modified date
      if (currentRoom.lastModified) {
        setLastModified(new Date(currentRoom.lastModified));
      }
      
      // If room has reserved dates, we'd use them here
      if (currentRoom.reservedDates && currentRoom.reservedDates.length > 0) {
        // This would need more logic to handle multiple date ranges
        const latestReservation = currentRoom.reservedDates[currentRoom.reservedDates.length - 1];
        if (latestReservation.start && latestReservation.end) {
          setReservedDates({
            from: new Date(latestReservation.start),
            to: new Date(latestReservation.end)
          });
        }
      }
    }
  }, [currentRoom, mode]);

  function onSubmit(values: RoomFormValues) {
    if (features.length === 0) {
      toast.error("Agregue al menos una característica");
      return;
    }

    if (roomImages.length === 0) {
      toast.error("Agregue al menos una imagen");
      return;
    }

    // Use the first image as the main image
    const mainImage = roomImages[0].url;
    const now = new Date();

    if (mode === "edit" && currentRoom) {
      updateRoom({
        ...currentRoom,
        ...values,
        image: mainImage,
        features,
        images: roomImages,
        // Keep the existing reserved dates or initialize as empty array
        reservedDates: currentRoom.reservedDates || [],
        lastModified: now.toISOString(),
      });
      toast.success("Habitación actualizada correctamente");
    } else {
      // Ensure all required fields are provided for the Room type
      addRoom({
        title: values.title,
        location: values.location,
        price: values.price,
        rating: values.rating,
        reviews: values.reviews,
        image: mainImage,
        type: values.type,
        area: values.area,
        description: values.description,
        isAvailable: values.isAvailable,
        features,
        images: roomImages,
        reservedDates: [],
        lastModified: now.toISOString(),
      });
      toast.success("Habitación agregada correctamente");
    }

    navigate("/admin/dashboard");
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {mode === "add" ? "Agregar nueva habitación" : "Editar habitación"}
      </h2>
      
      {lastModified && mode === "edit" && (
        <div className="mb-4 text-sm text-muted-foreground">
          <p>Última modificación: {format(lastModified, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es })}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Fields */}
          <BasicInfoFields />

          <div className="space-y-4">
            {/* Image Manager */}
            <ImageManager roomImages={roomImages} setRoomImages={setRoomImages} />

            {/* Feature Manager */}
            <FeatureManager features={features} setFeatures={setFeatures} />

            {/* Reserved Dates Manager */}
            <ReservedDatesManager 
              reservedDates={reservedDates} 
              setReservedDates={setReservedDates} 
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-terracotta hover:bg-terracotta/90"
            >
              {mode === "add" ? "Agregar habitación" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RoomForm;
