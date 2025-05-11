"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Room, RoomStore } from "../types/room"
import { toast } from "@/components/ui/use-toast"

// Sample initial rooms data
import { featuredRooms as initialRooms } from "../data/sampleRooms"
import { allServices } from "../data/services"

const FILE_NAME = "salva.json"

// Define FileSystem API types
interface FileSystemFileHandle {
  getFile: () => Promise<File>
  createWritable: () => Promise<FileSystemWritableFileStream>
}

interface FileSystemWritableFileStream {
  write: (content: any) => Promise<void>
  close: () => Promise<void>
}

// Declare the File System Access API types
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<any>
    showOpenFilePicker?: (options: any) => Promise<FileSystemFileHandle[]>
    showSaveFilePicker?: (options: any) => Promise<FileSystemFileHandle>
  }
}

const RoomStoreContext = createContext<RoomStore | undefined>(undefined)

export const useRoomStore = () => {
  const context = useContext(RoomStoreContext)
  if (!context) {
    throw new Error("useRoomStore must be used within a RoomStoreProvider")
  }
  return context
}

export const RoomStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null)

  // Load rooms from local file or use initial data
  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Check if the File System Access API is available
        if (window.showOpenFilePicker) {
          try {
            // Ask user to select a file to open
            const handles = await window.showOpenFilePicker({
              types: [
                {
                  description: "Archivo de datos",
                  accept: {
                    "application/json": [".json"],
                  },
                },
              ],
              suggestedName: FILE_NAME,
            })

            if (handles && handles.length > 0) {
              // Keep reference to the file handle for saving later
              setFileHandle(handles[0] as FileSystemFileHandle)

              const file = await handles[0].getFile()
              const content = await file.text()
              const parsedRooms = JSON.parse(content)
              setRooms(parsedRooms)
              toast({
                title: "Datos cargados",
                description: `${parsedRooms.length} habitaciones cargadas desde archivo local`,
              })
              console.log(`Habitaciones cargadas desde archivo local:`, parsedRooms.length)

              // Generate TypeScript files after loading data
              generateTypeScriptFiles(parsedRooms)
            } else {
              throw new Error("No se seleccionó ningún archivo")
            }
          } catch (fileErr) {
            console.log("No se encontró el archivo o no se seleccionó, usando datos iniciales")
            // If no file was selected, use initial data
            const roomsWithModifiedDate = initialRooms.map((room) => ({
              ...room,
              lastModified: new Date().toISOString(),
            }))
            setRooms(roomsWithModifiedDate as Room[])
            toast({
              title: "Datos iniciales",
              description: "Utilizando datos de muestra. Los cambios se guardarán en un nuevo archivo.",
            })
          }
        } else {
          // Fallback if File System Access API is not available
          console.warn("File System Access API no disponible en este navegador, usando localStorage como alternativa")
          const savedRooms = localStorage.getItem("hotel-rooms-data")
          if (savedRooms) {
            const parsedRooms = JSON.parse(savedRooms)
            setRooms(parsedRooms)
            console.log("Fallback: Habitaciones cargadas desde almacenamiento local:", parsedRooms.length)
            toast({
              title: "Datos cargados",
              description: `${parsedRooms.length} habitaciones cargadas desde almacenamiento local`,
            })
          } else {
            // No saved data, use initial data
            const roomsWithModifiedDate = initialRooms.map((room) => ({
              ...room,
              lastModified: new Date().toISOString(),
            }))
            setRooms(roomsWithModifiedDate as Room[])
            toast({
              title: "Datos iniciales",
              description: "Utilizando datos de muestra iniciales.",
            })
          }
        }
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
        // In case of error, use initial data
        setRooms(initialRooms as Room[])
        toast({
          title: "Error al cargar",
          description: "Se produjo un error al cargar los datos. Utilizando datos de muestra.",
          variant: "destructive",
        })
      } finally {
        setIsLoaded(true)
      }
    }

    loadRooms()
  }, [])

  // Generate TypeScript files
  const generateTypeScriptFiles = (roomsData: Room[]) => {
    try {
      // Generate rooms.ts file content
      const roomsFileContent = generateRoomsFileContent(roomsData)
      const servicesFileContent = generateServicesFileContent()

      // Download as TypeScript files
      downloadTypeScriptFile(roomsFileContent, "rooms.ts")
      downloadTypeScriptFile(servicesFileContent, "services.ts")

      toast({
        title: "Archivos generados",
        description: "Los archivos rooms.ts y services.ts han sido generados correctamente.",
      })
    } catch (error) {
      console.error("Error al generar archivos TypeScript:", error)
      toast({
        title: "Error",
        description: "No se pudieron generar los archivos TypeScript.",
        variant: "destructive",
      })
    }
  }

  // Helper function to generate rooms.ts file content
  const generateRoomsFileContent = (roomsData: Room[]) => {
    return `export const roomsData = ${JSON.stringify(roomsData, null, 2)}\n`
  }

  // Helper function to generate services.ts file content
  const generateServicesFileContent = () => {
    return `export const allServices = ${JSON.stringify(allServices, null, 2)}\n`
  }

  // Helper function to download TypeScript file
  const downloadTypeScriptFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/typescript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Save rooms to local file whenever they change
  useEffect(() => {
    const saveRooms = async () => {
      if (isLoaded) {
        try {
          // Check if the File System Access API is available
          if (window.showSaveFilePicker) {
            try {
              let handle = fileHandle

              // If we don't have a handle yet, ask user to select where to save
              if (!handle) {
                handle = (await window.showSaveFilePicker({
                  types: [
                    {
                      description: "Archivo de datos",
                      accept: {
                        "application/json": [".json"],
                      },
                    },
                  ],
                  suggestedName: FILE_NAME,
                })) as FileSystemFileHandle

                setFileHandle(handle)
              }

              // Write to the file
              const writable = await handle.createWritable()
              await writable.write(JSON.stringify(rooms, null, 2))
              await writable.close()

              // Generate TypeScript files after saving data
              generateTypeScriptFiles(rooms)

              toast({
                title: "Datos guardados",
                description: `Los cambios han sido guardados en el archivo local`,
              })
              console.log(`Habitaciones guardadas en archivo local`)
            } catch (err) {
              console.error("Error al guardar en el sistema de archivos:", err)
              // Fallback to localStorage if file system access fails
              localStorage.setItem("hotel-rooms-data", JSON.stringify(rooms))
              toast({
                title: "Guardado alternativo",
                description:
                  "No se pudo guardar en archivo. Los datos se guardaron en almacenamiento local del navegador.",
                variant: "destructive",
              })
            }
          } else {
            // Fallback if File System Access API is not available
            localStorage.setItem("hotel-rooms-data", JSON.stringify(rooms))
            toast({
              title: "Guardado local",
              description: "Los datos se guardaron en el almacenamiento local del navegador.",
            })
          }
        } catch (error) {
          console.error("Error al guardar habitaciones:", error)
          toast({
            title: "Error al guardar",
            description: "Se produjo un error al guardar los cambios.",
            variant: "destructive",
          })
        }
      }
    }

    // Only save when there are changes and data has already been loaded
    if (isLoaded && rooms.length > 0) {
      saveRooms()
    }
  }, [rooms, isLoaded, fileHandle])

  const addRoom = (room: Omit<Room, "id">) => {
    const newRoom = {
      ...room,
      id: rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1,
      lastModified: new Date().toISOString(),
    }
    setRooms([...rooms, newRoom as Room])
  }

  const updateRoom = (updatedRoom: Room) => {
    const roomWithTimestamp = {
      ...updatedRoom,
      lastModified: new Date().toISOString(),
    }

    setRooms(rooms.map((room) => (room.id === updatedRoom.id ? roomWithTimestamp : room)))
  }

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter((room) => room.id !== id))
  }

  const toggleRoomAvailability = (id: number) => {
    setRooms(
      rooms.map((room) =>
        room.id === id
          ? {
              ...room,
              isAvailable: !room.isAvailable,
              lastModified: new Date().toISOString(),
            }
          : room,
      ),
    )
  }

  const addReservedDates = (id: number, startDate: Date, endDate: Date) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === id) {
          return {
            ...room,
            reservedDates: [
              ...room.reservedDates,
              {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
              },
            ],
            lastModified: new Date().toISOString(),
          }
        }
        return room
      }),
    )
  }

  const value: RoomStore = {
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    toggleRoomAvailability,
    addReservedDates,
  }

  return <RoomStoreContext.Provider value={value}>{children}</RoomStoreContext.Provider>
}
