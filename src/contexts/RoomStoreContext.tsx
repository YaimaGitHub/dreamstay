"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { Room, RoomStore, ConfigBackup } from "../types/room"

// Sample initial rooms data
import { featuredRooms as initialRooms } from "../data/sampleRooms"

// Nombre fijo del archivo de guardado
const SAVE_FILE_NAME = "salva"
// Clave para almacenar la última modificación
const LAST_MODIFIED_KEY = "salva-last-modified"
// Clave para almacenar las copias de seguridad
const BACKUPS_KEY = "salva-backups"
// Clave para almacenar la configuración de autoguardado
const AUTOSAVE_KEY = "salva-autosave-enabled"
// Intervalo de verificación de cambios (en milisegundos)
const CHECK_INTERVAL = 5000 // 5 segundos
// Intervalo de autoguardado (en milisegundos)
const AUTOSAVE_INTERVAL = 30000 // 30 segundos

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
  const [backups, setBackups] = useState<ConfigBackup[]>([])
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false)

  // Función para verificar si el navegador soporta la API File System Access
  const isFileSystemAccessSupported = useCallback(() => {
    return typeof window !== "undefined" && "showOpenFilePicker" in window && "showSaveFilePicker" in window
  }, [])

  // Función para exportar datos a un archivo descargable (método tradicional)
  const exportToDownloadableFile = useCallback((dataToExport: Room[]) => {
    try {
      const jsonString = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "salva.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log(`Datos exportados a archivo descargable 'salva.json'`)
      return true
    } catch (error) {
      console.error("Error al exportar datos:", error)
      return false
    }
  }, [])

  // Modificar la función loadFromFile para que busque específicamente el archivo "salva.json"
  const loadFromFile = useCallback(
    async (showPicker = true) => {
      try {
        if (!isFileSystemAccessSupported()) {
          console.warn("API File System Access no soportada en este navegador")
          // Fallback para navegadores que no soportan File System Access API
          return null
        }

        let handle: FileSystemFileHandle | null = null

        // Si tenemos permisos para un archivo anterior, intentamos usarlo primero
        if (fileHandle) {
          try {
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
          } catch (error) {
            console.error("Error al verificar permisos:", error)
            // Continuar con el selector de archivos
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
              multiple: false,
            })

            if (fileHandles && fileHandles.length > 0) {
              handle = fileHandles[0]
              setFileHandle(handle)
            }
          } catch (error) {
            console.error("Error al mostrar selector de archivos:", error)
            // El usuario canceló la selección o hubo un error
            return null
          }
        }

        if (handle) {
          try {
            const file = await handle.getFile()
            const content = await file.text()
            let parsedRooms

            try {
              parsedRooms = JSON.parse(content)
            } catch (parseError) {
              console.error("Error al parsear JSON:", parseError)
              throw new Error("El archivo seleccionado no contiene un JSON válido")
            }

            // Guardar la última fecha de modificación
            setLastModified(file.lastModified.toString())
            localStorage.setItem(LAST_MODIFIED_KEY, file.lastModified.toString())

            console.log(`Habitaciones cargadas desde archivo:`, parsedRooms.length)
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
    [fileHandle, isFileSystemAccessSupported],
  )

  // Modificar la función saveToFile para guardar específicamente como "salva.json"
  const saveToFile = useCallback(
    async (dataToSave: Room[], forceSavePicker = false) => {
      setSyncStatus("syncing")
      try {
        if (!isFileSystemAccessSupported()) {
          console.warn("API File System Access no soportada en este navegador")
          // Fallback para navegadores que no soportan File System Access API
          // Usar el método de descarga tradicional
          exportToDownloadableFile(dataToSave)
          setSyncStatus("synced")
          return true
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
              suggestedName: "salva.json",
            })
            setFileHandle(handle)
          } catch (error) {
            console.error("Error al mostrar selector de guardado:", error)
            setSyncStatus("error")
            // El usuario canceló la selección o hubo un error
            return false
          }
        }

        if (!handle) {
          setSyncStatus("error")
          return false
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

          console.log(`Datos guardados en archivo 'salva.json'`)
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
    [fileHandle, isFileSystemAccessSupported, exportToDownloadableFile],
  )

  // Función para importar datos desde un archivo seleccionado por el usuario
  const importFromFile = useCallback(async () => {
    try {
      setSyncStatus("syncing")
      const result = await loadFromFile(true)
      if (result && result.data) {
        setRooms(result.data)
        setSyncStatus("synced")
        return true
      } else {
        setSyncStatus("error")
        return false
      }
    } catch (error) {
      console.error("Error al importar archivo:", error)
      setSyncStatus("error")
      return false
    }
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

  // Función para crear una copia de seguridad
  const backupConfigurations = useCallback(
    (backupName: string) => {
      try {
        // Crear la copia de seguridad
        const backup: ConfigBackup = {
          name: backupName,
          date: new Date(),
          data: [...rooms],
          size: `${JSON.stringify(rooms).length / 1024} KB`,
        }

        // Añadir a la lista de copias de seguridad
        const updatedBackups = [...backups, backup]
        setBackups(updatedBackups)

        // Guardar en localStorage
        localStorage.setItem(
          BACKUPS_KEY,
          JSON.stringify(
            updatedBackups.map((b) => ({
              name: b.name,
              date: b.date.toISOString(),
              data: b.data,
              size: b.size,
            })),
          ),
        )

        return true
      } catch (error) {
        console.error("Error al crear copia de seguridad:", error)
        return false
      }
    },
    [rooms, backups],
  )

  // Función para restaurar desde una copia de seguridad
  const restoreFromBackup = useCallback(
    (backupName: string) => {
      try {
        const backup = backups.find((b) => b.name === backupName)
        if (!backup) return false

        // Restaurar los datos
        setRooms(backup.data)
        return true
      } catch (error) {
        console.error("Error al restaurar desde copia de seguridad:", error)
        return false
      }
    },
    [backups],
  )

  // Función para obtener la lista de copias de seguridad
  const getBackupsList = useCallback(() => {
    return backups.map((b) => ({
      name: b.name,
      date: b.date,
      size: b.size,
    }))
  }, [backups])

  // Función para activar/desactivar el autoguardado
  const toggleAutoSave = useCallback((enabled: boolean) => {
    setAutoSaveEnabled(enabled)
    localStorage.setItem(AUTOSAVE_KEY, enabled.toString())
  }, [])

  // Cargar habitaciones al iniciar
  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Cargar configuración de autoguardado
        const savedAutoSave = localStorage.getItem(AUTOSAVE_KEY)
        if (savedAutoSave !== null) {
          setAutoSaveEnabled(savedAutoSave === "true")
        }

        // Cargar copias de seguridad
        const savedBackups = localStorage.getItem(BACKUPS_KEY)
        if (savedBackups) {
          try {
            const parsedBackups = JSON.parse(savedBackups)
            setBackups(
              parsedBackups.map((b: any) => ({
                ...b,
                date: new Date(b.date),
              })),
            )
          } catch (error) {
            console.error("Error al parsear copias de seguridad:", error)
          }
        }

        // Intentar cargar desde localStorage primero como fallback
        const savedRooms = localStorage.getItem("salva-rooms")
        if (savedRooms) {
          try {
            const parsedRooms = JSON.parse(savedRooms)
            setRooms(parsedRooms)
            setIsLoaded(true)
            console.log("Habitaciones cargadas desde localStorage")
            return
          } catch (error) {
            console.error("Error al parsear habitaciones de localStorage:", error)
          }
        }

        // Si no hay datos en localStorage o hubo un error, usar datos iniciales
        const roomsWithModifiedDate = initialRooms.map((room) => ({
          ...room,
          lastModified: new Date().toISOString(),
        }))
        setRooms(roomsWithModifiedDate as Room[])
        console.log("Usando datos iniciales de habitaciones")
        setIsLoaded(true)
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
        // En caso de error, usar datos iniciales
        setRooms(initialRooms as Room[])
        setIsLoaded(true)
      }
    }

    loadRooms()
  }, [])

  // Configurar autoguardado
  useEffect(() => {
    if (!autoSaveEnabled || !isLoaded) return

    const intervalId = setInterval(async () => {
      try {
        if (fileHandle) {
          await saveToFile(rooms, false)
          console.log("Autoguardado completado:", new Date().toLocaleTimeString())
        }
      } catch (error) {
        console.error("Error en autoguardado:", error)
      }
    }, AUTOSAVE_INTERVAL)

    return () => clearInterval(intervalId)
  }, [autoSaveEnabled, isLoaded, rooms, saveToFile, fileHandle])

  // Guardar en localStorage como respaldo
  useEffect(() => {
    if (isLoaded && rooms.length > 0) {
      try {
        localStorage.setItem("salva-rooms", JSON.stringify(rooms))
      } catch (error) {
        console.error("Error al guardar en localStorage:", error)
      }
    }
  }, [rooms, isLoaded])

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
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    setFilePath: (path: string) => {
      // Esta función es un placeholder, ya que la API File System Access
      // no permite establecer una ruta específica por razones de seguridad
      console.log("Intentando establecer ruta:", path)
      return Promise.resolve(false)
    },
    // Nuevas funcionalidades
    backupConfigurations,
    restoreFromBackup,
    getBackupsList,
    autoSaveEnabled,
    toggleAutoSave,
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
