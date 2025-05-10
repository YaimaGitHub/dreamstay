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
// Clave para recordar si ya se ha configurado el archivo salva
const FILE_HANDLE_KEY = "salva-file-configured"

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
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false)

  // Función para verificar si el navegador soporta la API File System Access
  const isFileSystemAccessSupported = () => {
    return "showOpenFilePicker" in window && "showSaveFilePicker" in window
  }

  // Función para cargar datos desde el archivo salva.json
  const loadFromFile = async (showPicker = true) => {
    try {
      if (!isFileSystemAccessSupported()) {
        throw new Error("API File System Access no soportada en este navegador")
      }

      let handle: FileSystemFileHandle | null = null

      // Si tenemos permisos para un archivo anterior, intentamos usarlo primero
      if (fileHandle) {
        // Verificar si todavía tenemos permiso para acceder al archivo
        const permission = await fileHandle.queryPermission({ mode: "read" })
        if (permission === "granted") {
          handle = fileHandle
        } else {
          // Intentar solicitar permiso
          const newPermission = await fileHandle.requestPermission({ mode: "read" })
          if (newPermission === "granted") {
            handle = fileHandle
          }
        }
      }

      // Si no tenemos un handle válido y se permite mostrar el selector, lo mostramos
      if (!handle && showPicker) {
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
          handle = fileHandles[0]
          setFileHandle(handle)

          // Guardar en localStorage que tenemos un archivo configurado
          localStorage.setItem(FILE_HANDLE_KEY, "true")
          setAutoSaveEnabled(true)
        }
      }

      if (handle) {
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
  const saveToFile = async (dataToSave: Room[], forceSavePicker = false) => {
    try {
      if (!isFileSystemAccessSupported()) {
        throw new Error("API File System Access no soportada en este navegador")
      }

      let handle = fileHandle

      // Si no tenemos un fileHandle o se fuerza mostrar el selector, pedimos al usuario que elija dónde guardar
      if (!handle || forceSavePicker) {
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

        // Guardar en localStorage que tenemos un archivo configurado
        localStorage.setItem(FILE_HANDLE_KEY, "true")
        setAutoSaveEnabled(true)
      }

      // Verificar si tenemos permiso para escribir
      const permission = await handle.queryPermission({ mode: "readwrite" })
      if (permission !== "granted") {
        const newPermission = await handle.requestPermission({ mode: "readwrite" })
        if (newPermission !== "granted") {
          throw new Error("No se concedió permiso para escribir en el archivo")
        }
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

  // Función para importar datos desde un archivo seleccionado por el usuario
  const importFromFile = async () => {
    const fileData = await loadFromFile(true)
    if (fileData) {
      setRooms(fileData)
      return true
    }
    return false
  }

  // Cargar habitaciones al iniciar
  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Verificar si ya tenemos un archivo configurado
        const fileConfigured = localStorage.getItem(FILE_HANDLE_KEY) === "true"

        // Si ya tenemos un archivo configurado, intentamos cargarlo automáticamente
        let fileData = null
        if (fileConfigured) {
          fileData = await loadFromFile(false)
        }

        // Si no pudimos cargar automáticamente, mostramos el selector
        if (!fileData && fileConfigured) {
          fileData = await loadFromFile(true)
        }

        if (fileData) {
          setRooms(fileData)
          setAutoSaveEnabled(true)
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

    // Exponer funciones para que puedan ser llamadas desde el panel administrativo
    window.roomStoreExport = () => exportToDownloadableFile(rooms)
    window.roomStoreImport = importFromFile

    return () => {
      // Limpiar funciones globales al desmontar
      delete window.roomStoreExport
      delete window.roomStoreImport
    }
  }, [])

  // Guardar habitaciones cuando cambien
  useEffect(() => {
    const saveRooms = async () => {
      if (isLoaded) {
        // Siempre guardamos en localStorage como respaldo
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms))

        // Si el autoguardado está habilitado, guardamos en el archivo
        if (autoSaveEnabled && fileHandle) {
          const fileSaved = await saveToFile(rooms)

          if (!fileSaved) {
            console.log(
              "No se pudo guardar automáticamente en el archivo. Los datos se han guardado en almacenamiento local.",
            )
          }
        }
      }
    }

    // Solo guardamos cuando hay cambios y ya se ha cargado
    if (isLoaded) {
      saveRooms()
    }
  }, [rooms, isLoaded, autoSaveEnabled, fileHandle])

  // Funciones para manipular habitaciones
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

  // Funciones adicionales para el manejo del archivo salva.json
  const forceExportData = () => {
    exportToDownloadableFile(rooms)
  }

  const forceImportData = async () => {
    return await importFromFile()
  }

  const forceSaveToFile = async () => {
    return await saveToFile(rooms, true)
  }

  const value: RoomStore = {
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    toggleRoomAvailability,
    addReservedDates,
    // Añadimos funciones para manejar el archivo salva.json
    exportData: forceExportData,
    importData: forceImportData,
    saveToFile: forceSaveToFile,
    isAutoSaveEnabled: autoSaveEnabled,
  }

  return <RoomStoreContext.Provider value={value}>{children}</RoomStoreContext.Provider>
}

// Declaración para TypeScript
declare global {
  interface Window {
    roomStoreExport?: () => void
    roomStoreImport?: () => Promise<boolean>
  }
}
