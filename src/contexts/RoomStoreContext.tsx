"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { Room, RoomStore, ConfigBackup } from "../types/room"

// Sample initial rooms data
import { featuredRooms as initialRooms } from "../data/sampleRooms"

// Nombre fijo del archivo de guardado
const SAVE_FILE_NAME = "salva.json"
// Clave para almacenar la última modificación
const LAST_MODIFIED_KEY = "salva-last-modified"
// Clave para almacenar las copias de seguridad
const BACKUPS_KEY = "salva-backups"
// Clave para almacenar la configuración de autoguardado
const AUTOSAVE_KEY = "salva-autosave-enabled"
// Clave para almacenar la ruta del archivo salva
const FILE_PATH_KEY = "salva-file-path"
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
  const [isLoading, setIsLoading] = useState(true)
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null)
  const [lastModified, setLastModified] = useState<string>("")
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("syncing")
  const [backups, setBackups] = useState<ConfigBackup[]>([])
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [savedFilePath, setSavedFilePath] = useState<string | null>(null)
  const initialLoadAttempted = useRef(false)

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
      a.download = SAVE_FILE_NAME
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log(`Datos exportados a archivo descargable '${SAVE_FILE_NAME}'`)
      return true
    } catch (error) {
      console.error("Error al exportar datos:", error)
      return false
    }
  }, [])

  // Función para intentar recuperar el fileHandle usando la API de IndexedDB
  const getStoredFileHandle = useCallback(async (): Promise<FileSystemFileHandle | null> => {
    if (!isFileSystemAccessSupported() || !("indexedDB" in window)) {
      return null
    }

    return new Promise((resolve) => {
      const request = indexedDB.open("SalvaFileHandleDB", 1)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("fileHandles")) {
          db.createObjectStore("fileHandles", { keyPath: "id" })
        }
      }

      request.onerror = () => {
        console.error("Error al abrir IndexedDB:", request.error)
        resolve(null)
      }

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction("fileHandles", "readonly")
        const store = transaction.objectStore("fileHandles")
        const getRequest = store.get("salvaFileHandle")

        getRequest.onerror = () => {
          console.error("Error al obtener fileHandle de IndexedDB:", getRequest.error)
          resolve(null)
        }

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            resolve(getRequest.result.handle)
          } else {
            resolve(null)
          }
        }
      }
    })
  }, [isFileSystemAccessSupported])

  // Función para guardar el fileHandle usando la API de IndexedDB
  const storeFileHandle = useCallback(
    async (handle: FileSystemFileHandle) => {
      if (!isFileSystemAccessSupported() || !("indexedDB" in window)) {
        return false
      }

      return new Promise<boolean>((resolve) => {
        const request = indexedDB.open("SalvaFileHandleDB", 1)

        request.onupgradeneeded = () => {
          const db = request.result
          if (!db.objectStoreNames.contains("fileHandles")) {
            db.createObjectStore("fileHandles", { keyPath: "id" })
          }
        }

        request.onerror = () => {
          console.error("Error al abrir IndexedDB:", request.error)
          resolve(false)
        }

        request.onsuccess = () => {
          const db = request.result
          const transaction = db.transaction("fileHandles", "readwrite")
          const store = transaction.objectStore("fileHandles")
          const putRequest = store.put({
            id: "salvaFileHandle",
            handle: handle,
          })

          putRequest.onerror = () => {
            console.error("Error al guardar fileHandle en IndexedDB:", putRequest.error)
            resolve(false)
          }

          putRequest.onsuccess = () => {
            resolve(true)
          }
        }
      })
    },
    [isFileSystemAccessSupported],
  )

  // Función para cargar datos desde el archivo salva.json
  const loadFromFile = useCallback(
    async (showPicker = false, retryWithPicker = true) => {
      setIsLoading(true)
      setSyncStatus("syncing")
      setLoadError(null)

      try {
        if (!isFileSystemAccessSupported()) {
          console.warn("API File System Access no soportada en este navegador")
          setLoadError("Tu navegador no soporta la API File System Access. Se usarán datos de respaldo.")
          setSyncStatus("error")
          setIsLoading(false)
          return null
        }

        let handle: FileSystemFileHandle | null = null

        // Si tenemos un fileHandle guardado, intentamos usarlo primero
        if (fileHandle) {
          handle = fileHandle
        } else {
          // Intentar recuperar el fileHandle almacenado
          const storedHandle = await getStoredFileHandle()
          if (storedHandle) {
            handle = storedHandle
            setFileHandle(storedHandle)
            console.log("FileHandle recuperado del almacenamiento")
          }
        }

        // Si tenemos un handle, verificamos permisos
        if (handle) {
          try {
            // Verificar si todavía tenemos permiso para acceder al archivo
            const permission = await handle.queryPermission({ mode: "read" })
            if (permission !== "granted") {
              // Intentar solicitar permiso
              console.log("Solicitando permiso para acceder al archivo salva.json")
              const newPermission = await handle.requestPermission({ mode: "read" })
              if (newPermission !== "granted") {
                console.warn("Permiso denegado para acceder al archivo")
                handle = null // Resetear el handle si no tenemos permiso
              }
            }
          } catch (error) {
            console.error("Error al verificar permisos:", error)
            handle = null // Resetear el handle en caso de error
          }
        }

        // Si no tenemos un handle válido y se permite mostrar el selector, lo mostramos
        if (!handle && showPicker) {
          try {
            console.log("Mostrando selector de archivos para salva.json")
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

              // Guardar el fileHandle para futuras sesiones
              await storeFileHandle(handle)

              // Guardar la ruta del archivo (nombre)
              const file = await handle.getFile()
              setSavedFilePath(file.name)
              localStorage.setItem(FILE_PATH_KEY, file.name)
            }
          } catch (error) {
            console.error("Error o cancelación al mostrar selector de archivos:", error)
            // El usuario canceló la selección o hubo un error
            if (retryWithPicker) {
              setLoadError("No se pudo acceder al archivo salva.json. Por favor, selecciónalo manualmente.")
            } else {
              setLoadError("No se pudo cargar el archivo salva.json. Se usarán datos de respaldo.")
            }
            setSyncStatus("error")
            setIsLoading(false)
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

              // Verificar que los datos tienen el formato esperado
              if (!Array.isArray(parsedRooms)) {
                throw new Error("El archivo no contiene un array de habitaciones")
              }

              // Verificar que cada elemento tiene las propiedades mínimas necesarias
              for (const room of parsedRooms) {
                if (!room.id || !room.title) {
                  throw new Error("Algunas habitaciones no tienen las propiedades requeridas")
                }
              }
            } catch (parseError) {
              console.error("Error al parsear JSON:", parseError)
              setLoadError("El archivo seleccionado no contiene datos válidos. Se usarán datos de respaldo.")
              setSyncStatus("error")
              setIsLoading(false)
              return null
            }

            // Guardar la última fecha de modificación
            setLastModified(file.lastModified.toString())
            localStorage.setItem(LAST_MODIFIED_KEY, file.lastModified.toString())

            // Guardar la ruta del archivo (nombre)
            setSavedFilePath(file.name)
            localStorage.setItem(FILE_PATH_KEY, file.name)

            console.log(`Habitaciones cargadas desde archivo:`, parsedRooms.length)
            setSyncStatus("synced")
            setIsLoading(false)
            return { data: parsedRooms, lastModified: file.lastModified }
          } catch (error) {
            console.error("Error al leer el archivo:", error)
            setLoadError("Error al leer el archivo salva.json. Se usarán datos de respaldo.")
            setSyncStatus("error")
            setIsLoading(false)
            return null
          }
        } else if (retryWithPicker && !showPicker) {
          // Si no tenemos un handle y no mostramos el selector, pero permitimos reintentar,
          // intentamos de nuevo pero mostrando el selector
          return await loadFromFile(true, false)
        }
      } catch (error) {
        console.error("Error al cargar desde archivo:", error)
        setLoadError("Error inesperado al cargar el archivo. Se usarán datos de respaldo.")
        setSyncStatus("error")
      }

      setIsLoading(false)
      return null
    },
    [fileHandle, isFileSystemAccessSupported, getStoredFileHandle, storeFileHandle],
  )

  // Función para guardar datos en el archivo salva.json
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
              suggestedName: SAVE_FILE_NAME,
            })
            setFileHandle(handle)

            // Guardar el fileHandle para futuras sesiones
            await storeFileHandle(handle)
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

          // Guardar la ruta del archivo (nombre)
          setSavedFilePath(file.name)
          localStorage.setItem(FILE_PATH_KEY, file.name)

          console.log(`Datos guardados en archivo '${file.name}'`)
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
    [fileHandle, isFileSystemAccessSupported, exportToDownloadableFile, storeFileHandle],
  )

  // Función para importar datos desde un archivo seleccionado por el usuario
  const importFromFile = useCallback(async () => {
    try {
      setSyncStatus("syncing")
      const result = await loadFromFile(true, false)
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
        let parsedRooms

        try {
          parsedRooms = JSON.parse(content)

          // Verificar que los datos tienen el formato esperado
          if (!Array.isArray(parsedRooms)) {
            throw new Error("El archivo no contiene un array de habitaciones")
          }
        } catch (error) {
          console.error("Error al parsear JSON durante la verificación de cambios:", error)
          return false
        }

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
          size: `${Math.round(JSON.stringify(rooms).length / 1024)} KB`,
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
    const loadInitialData = async () => {
      if (initialLoadAttempted.current) return
      initialLoadAttempted.current = true

      setIsLoading(true)

      try {
        // Cargar configuración de autoguardado
        const savedAutoSave = localStorage.getItem(AUTOSAVE_KEY)
        if (savedAutoSave !== null) {
          setAutoSaveEnabled(savedAutoSave === "true")
        }

        // Cargar ruta del archivo guardada
        const savedPath = localStorage.getItem(FILE_PATH_KEY)
        if (savedPath) {
          setSavedFilePath(savedPath)
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

        // Intentar cargar desde el archivo salva.json
        console.log("Intentando cargar datos desde salva.json...")
        const result = await loadFromFile(false, true)

        if (result && result.data) {
          console.log("Datos cargados exitosamente desde salva.json")
          setRooms(result.data)
          setIsLoaded(true)
          setIsLoading(false)
          return
        }

        // Si no se pudo cargar desde el archivo, intentar desde localStorage
        console.log("No se pudo cargar desde salva.json, intentando desde localStorage...")
        const savedRooms = localStorage.getItem("salva-rooms")
        if (savedRooms) {
          try {
            const parsedRooms = JSON.parse(savedRooms)
            setRooms(parsedRooms)
            setIsLoaded(true)
            console.log("Habitaciones cargadas desde localStorage")
            setIsLoading(false)
            return
          } catch (error) {
            console.error("Error al parsear habitaciones de localStorage:", error)
          }
        }

        // Si no hay datos en localStorage o hubo un error, usar datos iniciales
        console.log("Usando datos iniciales de habitaciones")
        const roomsWithModifiedDate = initialRooms.map((room) => ({
          ...room,
          lastModified: new Date().toISOString(),
        }))
        setRooms(roomsWithModifiedDate as Room[])
        setIsLoaded(true)
        setSyncStatus("synced")
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
        // En caso de error, usar datos iniciales
        setRooms(initialRooms as Room[])
        setIsLoaded(true)
        setSyncStatus("error")
        setLoadError("Error al cargar datos. Se han cargado datos predeterminados.")
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [loadFromFile])

  // Configurar autoguardado
  useEffect(() => {
    if (!autoSaveEnabled || !isLoaded || !fileHandle) return

    const intervalId = setInterval(async () => {
      try {
        await saveToFile(rooms, false)
        console.log("Autoguardado completado:", new Date().toLocaleTimeString())
      } catch (error) {
        console.error("Error en autoguardado:", error)
      }
    }, AUTOSAVE_INTERVAL)

    return () => clearInterval(intervalId)
  }, [autoSaveEnabled, isLoaded, rooms, saveToFile, fileHandle])

  // Configurar verificación periódica de cambios
  useEffect(() => {
    if (!fileHandle || !isLoaded) return

    const intervalId = setInterval(async () => {
      try {
        const hasChanges = await checkForChanges()
        if (hasChanges) {
          console.log("Se actualizaron los datos desde el archivo salva.json")
        }
      } catch (error) {
        console.error("Error al verificar cambios:", error)
      }
    }, CHECK_INTERVAL)

    return () => clearInterval(intervalId)
  }, [fileHandle, isLoaded, checkForChanges])

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

  // Función para recargar los datos desde el archivo
  const reloadFromFile = async () => {
    const result = await loadFromFile(false, true)
    if (result && result.data) {
      setRooms(result.data)
      return true
    }
    return false
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
    reloadFromFile,
    syncStatus,
    lastModified: lastModified ? new Date(Number.parseInt(lastModified)) : null,
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isLoading,
    loadError,
    savedFilePath,
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
