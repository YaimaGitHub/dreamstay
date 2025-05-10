
import React, { createContext, useContext, useEffect, useState } from "react";
import { Room, RoomStore } from "../types/room";

// Sample initial rooms data
import { featuredRooms as initialRooms } from "../data/sampleRooms";

const LOCAL_STORAGE_KEY = "hotel-rooms-data";

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

  // Load rooms from localStorage or use initial data
  useEffect(() => {
    const loadRooms = () => {
      try {
        const savedRooms = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedRooms) {
          const parsedRooms = JSON.parse(savedRooms);
          setRooms(parsedRooms);
          console.log("Habitaciones cargadas desde almacenamiento local:", parsedRooms.length);
        } else {
          // No hay datos guardados, usar datos iniciales
          const roomsWithModifiedDate = initialRooms.map(room => ({
            ...room,
            lastModified: new Date().toISOString(),
          }));
          setRooms(roomsWithModifiedDate as Room[]);
          console.log("Usando datos iniciales de habitaciones");
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

  // Save rooms to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms));
        console.log("Habitaciones guardadas en almacenamiento local");
      } catch (error) {
        console.error("Error al guardar habitaciones:", error);
      }
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
