"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Check, MoreHorizontal, Search, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"

// Datos de muestra para las reservas
const reservationsData = [
  {
    id: 1,
    roomId: 1,
    roomName: "Suite Premium1",
    guestName: "Carlos Rodríguez",
    guestEmail: "carlos@example.com",
    checkIn: new Date("2025-05-12"),
    checkOut: new Date("2025-05-15"),
    guests: 2,
    status: "confirmed",
    totalPrice: 360,
    currency: "USD",
    createdAt: new Date("2025-04-15"),
  },
  {
    id: 2,
    roomId: 2,
    roomName: "Habitación Confort",
    guestName: "María González",
    guestEmail: "maria@example.com",
    checkIn: new Date("2025-05-13"),
    checkOut: new Date("2025-05-15"),
    guests: 1,
    status: "confirmed",
    totalPrice: 170,
    currency: "USD",
    createdAt: new Date("2025-04-16"),
  },
  {
    id: 3,
    roomId: 3,
    roomName: "Suite Ejecutiva",
    guestName: "Juan Pérez",
    guestEmail: "juan@example.com",
    checkIn: new Date("2025-05-14"),
    checkOut: new Date("2025-05-18"),
    guests: 2,
    status: "pending",
    totalPrice: 600,
    currency: "USD",
    createdAt: new Date("2025-04-17"),
  },
  {
    id: 4,
    roomId: 4,
    roomName: "Junior Suite",
    guestName: "Ana Martínez",
    guestEmail: "ana@example.com",
    checkIn: new Date("2025-05-15"),
    checkOut: new Date("2025-05-16"),
    guests: 1,
    status: "confirmed",
    totalPrice: 130,
    currency: "USD",
    createdAt: new Date("2025-04-18"),
  },
  {
    id: 5,
    roomId: 5,
    roomName: "Habitación Familiar",
    guestName: "Luis Sánchez",
    guestEmail: "luis@example.com",
    checkIn: new Date("2025-05-16"),
    checkOut: new Date("2025-05-21"),
    guests: 4,
    status: "cancelled",
    totalPrice: 550,
    currency: "USD",
    createdAt: new Date("2025-04-19"),
  },
]

const Reservations = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [reservations, setReservations] = useState(reservationsData)

  const filteredReservations = reservations.filter((reservation) => {
    // Filtro de búsqueda
    const searchMatch =
      searchTerm === "" ||
      reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.roomName.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de fecha
    const dateMatch = !dateFilter || (reservation.checkIn <= dateFilter && reservation.checkOut >= dateFilter)

    // Filtro de estado
    const statusMatch = !statusFilter || reservation.status === statusFilter

    return searchMatch && dateMatch && statusMatch
  })

  const handleStatusChange = (id: number, newStatus: string) => {
    setReservations(
      reservations.map((reservation) => (reservation.id === id ? { ...reservation, status: newStatus } : reservation)),
    )

    toast({
      title: "Estado actualizado",
      description: `La reserva ha sido marcada como ${
        newStatus === "confirmed" ? "confirmada" : newStatus === "cancelled" ? "cancelada" : "pendiente"
      }`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmada</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Reservas</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por huésped, email o habitación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "d MMM yyyy", { locale: es }) : "Filtrar por fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          className={`w-full md:w-auto ${statusFilter === "confirmed" ? "bg-green-100 text-green-800" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "confirmed" ? undefined : "confirmed")}
        >
          Confirmadas
        </Button>

        <Button
          variant="outline"
          className={`w-full md:w-auto ${statusFilter === "pending" ? "bg-yellow-100 text-yellow-800" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "pending" ? undefined : "pending")}
        >
          Pendientes
        </Button>

        <Button
          variant="outline"
          className={`w-full md:w-auto ${statusFilter === "cancelled" ? "bg-red-100 text-red-800" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "cancelled" ? undefined : "cancelled")}
        >
          Canceladas
        </Button>

        {(dateFilter || statusFilter) && (
          <Button
            variant="ghost"
            className="w-full md:w-auto"
            onClick={() => {
              setDateFilter(undefined)
              setStatusFilter(undefined)
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Huésped</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Huéspedes</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.id}</TableCell>
                  <TableCell>{reservation.roomName}</TableCell>
                  <TableCell>
                    <div>
                      <div>{reservation.guestName}</div>
                      <div className="text-sm text-muted-foreground">{reservation.guestEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{format(reservation.checkIn, "d MMM yyyy", { locale: es })}</TableCell>
                  <TableCell>{format(reservation.checkOut, "d MMM yyyy", { locale: es })}</TableCell>
                  <TableCell>{reservation.guests}</TableCell>
                  <TableCell>
                    {reservation.totalPrice} {reservation.currency}
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(reservation.id, "confirmed")}
                          disabled={reservation.status === "confirmed"}
                        >
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          Confirmar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(reservation.id, "pending")}
                          disabled={reservation.status === "pending"}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-yellow-600" />
                          Marcar como pendiente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(reservation.id, "cancelled")}
                          disabled={reservation.status === "cancelled"}
                        >
                          <X className="mr-2 h-4 w-4 text-red-600" />
                          Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                  No se encontraron reservas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Reservations
