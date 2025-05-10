"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Room, RoomStore } from "../types/room"

// Sample initial rooms data
import { featuredRooms as initialRooms } from "../data/sampleRooms"

// Nombre fijo del archivo de guardado
const SAVE_FILE_NAME = "salva.json"
// Clave para localStorage como respaldo
const LOCAL_STORAGE_KEY = "hotel-rooms-data"

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

  // Función para cargar datos desde el archivo salva.json
  const loadFromFile = async () => {
    try {
      // Intentar abrir el archivo salva.json
      const fileHandles = await window.showOpenFilePicker({
        types: [
          {
            description: "Archivo de datos",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
        suggestedName: SAVE_FILE_NAME,
      })

      if (fileHandles && fileHandles.length > 0) {
        const handle = fileHandles[0]
        setFileHandle(handle)

        const file = await handle.getFile()
        const content = await file.text()
        const parsedRooms = JSON.parse(content)

        console.log(`Habitaciones cargadas desde archivo '${SAVE_FILE_NAME}':`, parsedRooms.length)
        return parsedRooms
      }
    } catch (error) {
      console.error("Error al cargar desde archivo:", error)
    }
    return null
  }

  // Función para guardar datos en el archivo salva.json
  const saveToFile = async (dataToSave: Room[]) => {
    try {
      let handle = fileHandle

      // Si no tenemos un fileHandle, pedimos al usuario que elija dónde guardar
      if (!handle) {
        handle = await window.showSaveFilePicker({
          types: [
            {
              description: "Archivo de datos",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
          suggestedName: SAVE_FILE_NAME,
        })
        setFileHandle(handle)
      }

      // Escribir los datos en el archivo
      const writable = await handle.createWritable()
      await writable.write(JSON.stringify(dataToSave, null, 2))
      await writable.close()

      console.log(`Datos guardados en archivo '${SAVE_FILE_NAME}'`)
      return true
    } catch (error) {
      console.error("Error al guardar en archivo:", error)
      return false
    }
  }

  // Función para exportar datos a un archivo descargable
  const exportToDownloadableFile = (dataToExport: Room[]) => {
    const jsonString = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = SAVE_FILE_NAME
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log(`Datos exportados a archivo descargable '${SAVE_FILE_NAME}'`)
  }

  // Cargar habitaciones al iniciar
  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Primero intentamos cargar desde el archivo
        const fileData = await loadFromFile()

        if (fileData) {
          setRooms(fileData)
        } else {
          // Si no podemos cargar desde archivo, intentamos localStorage
          const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)

          if (savedData) {
            const parsedData = JSON.parse(savedData)
            setRooms(parsedData)
            console.log("Habitaciones cargadas desde almacenamiento local:", parsedData.length)
          } else {
            // Si no hay datos guardados, usamos los datos iniciales
            const roomsWithModifiedDate = initialRooms.map((room) => ({
              ...room,
              lastModified: new Date().toISOString(),
            }))
            setRooms(roomsWithModifiedDate as Room[])
            console.log("Usando datos iniciales de habitaciones")
          }
        }
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
        // En caso de error, usar datos iniciales
        setRooms(initialRooms as Room[])
      } finally {
        setIsLoaded(true)
      }
    }

    loadRooms()

    // Agregar botones para importar/exportar datos
    const addImportExportButtons = () => {
      // Solo agregamos los botones si no existen ya
      if (!document.getElementById("export-data-button")) {
        const adminHeader = document.querySelector(".container h1")
        if (adminHeader && adminHeader.textContent?.includes("Panel Administrativo")) {
          const buttonContainer = document.createElement("div")
          buttonContainer.className = "flex space-x-2 mt-4"

          const exportButton = document.createElement("button")
          exportButton.id = "export-data-button"
          exportButton.className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          exportButton.textContent = "Exportar datos (salva.json)"
          exportButton.onclick = () => exportToDownloadableFile(rooms)

          const importButton = document.createElement("button")
          importButton.id = "import-data-button"
          importButton.className = "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          importButton.textContent = "Importar datos"
          importButton.onclick = async () => {
            const fileData = await loadFromFile()
            if (fileData) {
              setRooms(fileData)
              alert("Datos importados correctamente")
            }
          }

          buttonContainer.appendChild(exportButton)
          buttonContainer.appendChild(importButton)

          adminHeader.parentNode?.insertBefore(buttonContainer, adminHeader.nextSibling)
        }
      }
    }

    // Intentamos agregar los botones cada segundo hasta que encontremos el elemento adecuado
    const interval = setInterval(addImportExportButtons, 1000)

    return () => clearInterval(interval)
  }, [])

  // Guardar habitaciones cuando cambien
  useEffect(() => {
    const saveRooms = async () => {
      if (isLoaded) {
        // Primero intentamos guardar en el archivo
        const fileSaved = await saveToFile(rooms)

        // Como respaldo, siempre guardamos en localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms))

        if (!fileSaved) {
          // Si no pudimos guardar en archivo, ofrecemos exportar
          console.log("No se pudo guardar en archivo. Los datos se han guardado en almacenamiento local.")
          // No exportamos automáticamente para no molestar al usuario
        }
      }
    }

    // Solo guardamos cuando hay cambios y ya se ha cargado
    if (isLoaded) {
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
    setRooms(rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)))
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
