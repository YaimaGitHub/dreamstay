
import React, { createContext, useContext, useEffect, useState } from "react";
import { Room, RoomStore } from "../types/room";

// Sample initial rooms data
import { featuredRooms as initialRooms } from "../data/sampleRooms";

const FILE_NAME = "salva.json";

const RoomStoreContext = createContext<RoomStore | undefined>(undefined);

export const useRoomStore = () => {
  const context = useContext(RoomStoreContext);
  if (!context) {
    throw new Error("useRoomStore must be used within a RoomStoreProvider");
  }
  return context;
};

export const RoomStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar habitaciones desde archivo local o usar datos iniciales
  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Intentar cargar el archivo local "salva.json"
        try {
          // Usamos showSaveFilePicker API para solicitar acceso al sistema de archivos
          // y asegurarnos de que podamos escribir en el futuro
          const fileHandle = await window.showDirectoryPicker();
          
          // Intentamos ver si ya existe el archivo "salva.json" en este directorio
          try {
            const fileHandle = await window.showOpenFilePicker({
              types: [
                {
                  description: 'Archivo de datos',
                  accept: {
                    'application/json': ['.json'],
                  },
                },
              ],
              suggestedName: FILE_NAME,
            });
            
            if (fileHandle && fileHandle.length > 0) {
              const file = await fileHandle[0].getFile();
              const content = await file.text();
              const parsedRooms = JSON.parse(content);
              setRooms(parsedRooms);
              console.log(`Habitaciones cargadas desde archivo local '${FILE_NAME}':`, parsedRooms.length);
            } else {
              throw new Error("No se seleccionó ningún archivo");
            }
          } catch (fileErr) {
            console.log("No se encontró el archivo salva.json o no se seleccionó, usando datos iniciales");
            // Si no existe el archivo, usamos datos iniciales
            const roomsWithModifiedDate = initialRooms.map(room => ({
              ...room,
              lastModified: new Date().toISOString(),
            }));
            setRooms(roomsWithModifiedDate as Room[]);
          }
        } catch (err) {
          console.error("Error al acceder al sistema de archivos:", err);
          // Fallback a localStorage si no se puede acceder al sistema de archivos
          const savedRooms = localStorage.getItem("hotel-rooms-data");
          if (savedRooms) {
            const parsedRooms = JSON.parse(savedRooms);
            setRooms(parsedRooms);
            console.log("Fallback: Habitaciones cargadas desde almacenamiento local:", parsedRooms.length);
          } else {
            // No hay datos guardados, usar datos iniciales
            const roomsWithModifiedDate = initialRooms.map(room => ({
              ...room,
              lastModified: new Date().toISOString(),
            }));
            setRooms(roomsWithModifiedDate as Room[]);
            console.log("Usando datos iniciales de habitaciones");
          }
        }
      } catch (error) {
        console.error("Error al cargar habitaciones:", error);
        // En caso de error, usar datos iniciales
        setRooms(initialRooms as Room[]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadRooms();
  }, []);

  // Guardar habitaciones en archivo local cada vez que cambien
  useEffect(() => {
    const saveRooms = async () => {
      if (isLoaded) {
        try {
          // Intentamos usar la API de sistema de archivos
          try {
            const options = {
              types: [
                {
                  description: 'Archivo de datos',
                  accept: {
                    'application/json': ['.json'],
                  },
                },
              ],
              suggestedName: FILE_NAME,
            };
            
            const fileHandle = await window.showSaveFilePicker(options);
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(rooms));
            await writable.close();
            console.log(`Habitaciones guardadas en archivo local '${FILE_NAME}'`);
          } catch (err) {
            console.error("Error al guardar en el sistema de archivos:", err);
            // Fallback a localStorage si no se puede acceder al sistema de archivos
            localStorage.setItem("hotel-rooms-data", JSON.stringify(rooms));
            console.log("Fallback: Habitaciones guardadas en almacenamiento local");
          }
        } catch (error) {
          console.error("Error al guardar habitaciones:", error);
        }
      }
    };
    
    // Solo guardamos cuando hay cambios y ya se ha cargado
    if (isLoaded) {
      saveRooms();
    }
  }, [rooms, isLoaded]);

  const addRoom = (room: Omit<Room, "id">) => {
    const newRoom = {
      ...room,
      id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
      lastModified: new Date().toISOString(),
    };
    setRooms([...rooms, newRoom as Room]);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms(
      rooms.map(room => (room.id === updatedRoom.id ? updatedRoom : room))
    );
  };

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const toggleRoomAvailability = (id: number) => {
    setRooms(
      rooms.map(room => 
        room.id === id ? { 
          ...room, 
          isAvailable: !room.isAvailable,
          lastModified: new Date().toISOString() 
        } : room
      )
    );
  };

  const addReservedDates = (id: number, startDate: Date, endDate: Date) => {
    setRooms(
      rooms.map(room => {
        if (room.id === id) {
          return {
            ...room,
            reservedDates: [
              ...room.reservedDates,
              {
                start: startDate.toISOString(),
                end: endDate.toISOString()
              }
            ],
            lastModified: new Date().toISOString()
          };
        }
        return room;
      })
    );
  };

  const value: RoomStore = {
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    toggleRoomAvailability,
    addReservedDates
  };

  return <RoomStoreContext.Provider value={value}>{children}</RoomStoreContext.Provider>;
};
