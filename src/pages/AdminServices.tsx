"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import { useToast } from "@/hooks/use-toast"

const AdminServices = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { services, deleteService } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  // Filtrar servicios por término de búsqueda
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    setIsDeleting(id)
    setTimeout(() => {
      deleteService(id)
      toast({
        title: "Servicio eliminado",
        description: "El servicio ha sido eliminado correctamente",
      })
      setIsDeleting(null)
    }, 500)
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "transporte":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "gastronomía":
        return "bg-green-50 text-green-700 border-green-200"
      case "comodidades":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "experiencias":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
          <p className="text-muted-foreground">Administra todos los servicios disponibles en tu plataforma</p>
        </div>
        <Button onClick={() => navigate("/admin/services/new")} className="bg-terracotta hover:bg-terracotta/90">
          <Plus className="mr-2 h-4 w-4" /> Nuevo servicio
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No se encontraron servicios
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{service.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {service.description.length > 60
                            ? `${service.description.substring(0, 60)}...`
                            : service.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryBadgeColor(service.category)}>
                        {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{service.price > 0 ? `$${service.price}` : "Incluido"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/services/edit/${service.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(service.id)}
                            disabled={isDeleting === service.id}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            {isDeleting === service.id ? "Eliminando..." : "Eliminar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

export default AdminServices
