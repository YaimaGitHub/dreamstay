
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Plus, Trash, Upload, ImagePlus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface RoomImage {
  id: number;
  url: string;
  alt: string;
}

interface ImageManagerProps {
  roomImages: RoomImage[];
  setRoomImages: React.Dispatch<React.SetStateAction<RoomImage[]>>;
}

const ImageManager = ({ roomImages, setRoomImages }: ImageManagerProps) => {
  const form = useFormContext();
  const [isUploading, setIsUploading] = useState(false);

  const addImage = () => {
    const newImageUrl = form.getValues("image");
    if (newImageUrl && newImageUrl.trim()) {
      const newImage = {
        id: roomImages.length > 0 ? Math.max(...roomImages.map(img => img.id)) + 1 : 1,
        url: newImageUrl,
        alt: `Imagen de ${form.getValues("title") || "habitación"}`
      };
      setRoomImages([...roomImages, newImage]);
      form.setValue("image", "");
    }
  };

  const removeImage = (id: number) => {
    setRoomImages(roomImages.filter(img => img.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    Array.from(files).forEach(file => {
      // Verificar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.error(`El archivo ${file.name} no es una imagen válida`);
        return;
      }

      // Convertir la imagen a base64 para almacenamiento local
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        
        const newImage = {
          id: roomImages.length > 0 ? Math.max(...roomImages.map(img => img.id)) + 1 : 1,
          url: base64Image,
          alt: `Imagen de ${form.getValues("title") || "habitación"} - ${file.name}`
        };
        
        setRoomImages(prevImages => [...prevImages, newImage]);
        toast.success(`Imagen ${file.name} cargada correctamente`);
      };
      
      reader.onerror = () => {
        toast.error(`Error al leer el archivo ${file.name}`);
      };
      
      reader.readAsDataURL(file);
    });
    
    setIsUploading(false);
    // Limpiar el input de archivos
    event.target.value = '';
  };

  return (
    <div>
      <Label>Imágenes</Label>
      <div className="mt-2 grid gap-4">
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder="URL de la imagen" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            onClick={addImage} 
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            id="image-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button 
            type="button"
            variant="outline" 
            className="w-full gap-2" 
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading}
          >
            <ImagePlus className="h-4 w-4" />
            {isUploading ? "Subiendo..." : "Subir imágenes desde dispositivo"}
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Imágenes agregadas:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {roomImages.map((img) => (
            <div key={img.id} className="relative group">
              <img 
                src={img.url} 
                alt={img.alt}
                className="w-full h-24 object-cover rounded-md" 
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageManager;
