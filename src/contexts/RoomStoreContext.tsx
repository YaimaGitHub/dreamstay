"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { Room, RoomStore } from "../types/room"

// Sample initial rooms data
import { featuredRooms as initialRooms } from "../data/sampleRooms"

// Nombre fijo del archivo de guardado
const SAVE_FILE_NAME = "salva.json"
// Clave para localStorage como respaldo
const LOCAL_STORAGE_KEY = "hotel-rooms-data"
// Clave para almacenar la última modificación
const LAST_MODIFIED_KEY = "salva-last-modified"
// Intervalo de verificación de cambios (en milisegundos)
const CHECK_INTERVAL = 5000 // 5 segundos

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
  const [lastModified, setLastModified] = useState<string>("")
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced")

  // Función para verificar si el navegador soporta la API File System Access
  const isFileSystemAccessSupported = () => {
    return "showOpenFilePicker" in window && "showSaveFilePicker" in window
  }

  // Función para cargar datos desde el archivo salva.json
  const loadFromFile = useCallback(
    async (showPicker = true) => {
      try {
        if (!isFileSystemAccessSupported()) {
          throw new Error("API File System Access no soportada en este navegador")
        }

        let handle: FileSystemFileHandle | null = null

        // Si tenemos permisos para un archivo anterior, intentamos usarlo primero
        if (fileHandle) {
          // Verificar si todavía tenemos permiso para acceder al archivo
          try {
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
          } catch (error) {
            console.error("Error al verificar permisos:", error)
          }
        }

        // Si no tenemos un handle válido y se permite mostrar el selector, lo mostramos
        if (!handle && showPicker) {
          try {
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
            }
          } catch (error) {
            console.error("Error al mostrar selector de archivos:", error)
            throw error
          }
        }

        if (handle) {
          try {
            const file = await handle.getFile()
            const content = await file.text()
            const parsedRooms = JSON.parse(content)

            // Guardar la última fecha de modificación
            setLastModified(file.lastModified.toString())
            localStorage.setItem(LAST_MODIFIED_KEY, file.lastModified.toString())

            console.log(`Habitaciones cargadas desde archivo '${SAVE_FILE_NAME}':`, parsedRooms.length)
            return { data: parsedRooms, lastModified: file.lastModified }
          } catch (error) {
            console.error("Error al leer el archivo:", error)
            throw error
          }
        }
      } catch (error) {
        console.error("Error al cargar desde archivo:", error)
        throw error
      }
      return null
    },
    [fileHandle],
  )

  // Función para guardar datos en el archivo salva.json
  const saveToFile = useCallback(
    async (dataToSave: Room[], forceSavePicker = false) => {
      setSyncStatus("syncing")
      try {
        if (!isFileSystemAccessSupported()) {
          throw new Error("API File System Access no soportada en este navegador")
        }

        let handle = fileHandle

        // Si no tenemos un fileHandle o se fuerza mostrar el selector, pedimos al usuario que elija dónde guardar
        if (!handle || forceSavePicker) {
          try {
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
          } catch (error) {
            console.error("Error al mostrar selector de guardado:", error)
            setSyncStatus("error")
            throw error
          }
        }

        // Verificar si tenemos permiso para escribir
        try {
          const permission = await handle.queryPermission({ mode: "readwrite" })
          if (permission !== "granted") {
            const newPermission = await handle.requestPermission({ mode: "readwrite" })
            if (newPermission !== "granted") {
              throw new Error("No se concedió permiso para escribir en el archivo")
            }
          }
        } catch (error) {
          console.error("Error al verificar permisos de escritura:", error)
          setSyncStatus("error")
          throw error
        }

        // Escribir los datos en el archivo
        try {
          const writable = await handle.createWritable()
          await writable.write(JSON.stringify(dataToSave, null, 2))
          await writable.close()

          // Actualizar la última fecha de modificación
          const file = await handle.getFile()
          setLastModified(file.lastModified.toString())
          localStorage.setItem(LAST_MODIFIED_KEY, file.lastModified.toString())

          console.log(`Datos guardados en archivo '${SAVE_FILE_NAME}'`)
          setSyncStatus("synced")
          return true
        } catch (error) {
          console.error("Error al escribir en el archivo:", error)
          setSyncStatus("error")
          throw error
        }
      } catch (error) {
        console.error("Error al guardar en archivo:", error)
        setSyncStatus("error")
        return false
      }
    },
    [fileHandle],
  )

  // Función para exportar datos a un archivo descargable
  const exportToDownloadableFile = useCallback((dataToExport: Room[]) => {
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
  }, [])

  // Función para importar datos desde un archivo seleccionado por el usuario
  const importFromFile = useCallback(async () => {
    try {
      const result = await loadFromFile(true)
      if (result) {
        setRooms(result.data)
        return true
      }
    } catch (error) {
      console.error("Error al importar archivo:", error)
    }
    return false
  }, [loadFromFile])

  // Función para verificar si hay cambios en el archivo
  const checkForChanges = useCallback(async () => {
    if (!fileHandle) return false

    try {
      const file = await fileHandle.getFile()
      const storedLastModified = localStorage.getItem(LAST_MODIFIED_KEY)

      // Si la fecha de modificación es diferente, hay cambios
      if (storedLastModified && file.lastModified.toString() !== storedLastModified) {
        console.log("Se detectaron cambios en el archivo salva.json")

        // Cargar los nuevos datos
        const content = await file.text()
        const parsedRooms = JSON.parse(content)

        // Actualizar los datos y la fecha de modificación
        setRooms(parsedRooms)
        setLastModified(file.lastModified.toString())
        localStorage.setItem(LAST_MODIFIED_KEY, file.lastModified.toString())

        return true
      }
    } catch (error) {
      console.error("Error al verificar cambios:", error)
    }

    return false
  }, [fileHandle])

  // Cargar habitaciones al iniciar
  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Intentamos cargar desde el archivo
        let result = null
        try {
          result = await loadFromFile(false)
        } catch (error) {
          console.error("Error al cargar automáticamente:", error)
        }

        // Si no pudimos cargar automáticamente, mostramos el selector
        if (!result) {
          try {
            result = await loadFromFile(true)
          } catch (error) {
            console.error("Error al cargar con selector:", error)
          }
        }

        if (result) {
          setRooms(result.data)
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
    window.roomStoreCheckChanges = checkForChanges

    return () => {
      // Limpiar funciones globales al desmontar
      delete window.roomStoreExport
      delete window.roomStoreImport
      delete window.roomStoreCheckChanges
    }
  }, [loadFromFile, exportToDownloadableFile, importFromFile, checkForChanges])

  // Configurar verificación periódica de cambios
  useEffect(() => {
    if (!fileHandle || !isLoaded) return

    // Verificar cambios periódicamente
    const intervalId = setInterval(async () => {
      const hasChanges = await checkForChanges()
      if (hasChanges) {
        console.log("Se actualizaron los datos desde el archivo salva.json")
      }
    }, CHECK_INTERVAL)

    return () => clearInterval(intervalId)
  }, [fileHandle, isLoaded, checkForChanges])

  // Guardar habitaciones cuando cambien
  useEffect(() => {
    const saveRooms = async () => {
      if (isLoaded) {
        // Siempre guardamos en localStorage como respaldo
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms))

        // Si tenemos un fileHandle, guardamos en el archivo
        if (fileHandle) {
          try {
            await saveToFile(rooms)
          } catch (error) {
            console.error("Error al guardar automáticamente:", error)
          }
        }
      }
    }

    // Solo guardamos cuando hay cambios y ya se ha cargado
    if (isLoaded) {
      saveRooms()
    }
  }, [rooms, isLoaded, saveToFile, fileHandle])

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

  // Función para forzar la verificación de cambios
  const forceCheckForChanges = async () => {
    return await checkForChanges()
  }

  const value: RoomStore = {
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    toggleRoomAvailability,
    addReservedDates,
    // Funciones para manejar el archivo salva.json
    exportData: () => exportToDownloadableFile(rooms),
    importData: importFromFile,
    saveToFile: () => saveToFile(rooms, true),
    checkForChanges: forceCheckForChanges,
    syncStatus,
    lastModified: lastModified ? new Date(Number.parseInt(lastModified)) : null,
  }

  return <RoomStoreContext.Provider value={value}>{children}</RoomStoreContext.Provider>
}

// Declaración para TypeScript
declare global {
  interface Window {
    roomStoreExport?: () => void
    roomStoreImport?: () => Promise<boolean>
    roomStoreCheckChanges?: () => Promise<boolean>
  }
}
