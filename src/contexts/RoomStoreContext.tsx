
import React, { createContext, useContext, useEffect, useState } from "react";
import { Room, RoomStore } from "../types/room";

// Sample initial rooms data
import { featuredRooms as initialRooms } from "../data/sampleRooms";

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

  // Load rooms from localStorage or use initial data
  useEffect(() => {
    const savedRooms = localStorage.getItem("rooms");
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    } else {
      setRooms(initialRooms as Room[]);
    }
  }, []);

  // Save rooms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  const addRoom = (room: Omit<Room, "id">) => {
    const newRoom = {
      ...room,
      id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
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
        room.id === id ? { ...room, isAvailable: !room.isAvailable } : room
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
            ]
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
