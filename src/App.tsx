import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AdminAuthProvider } from "@/hooks/use-admin-auth"
import { DataStoreProvider } from "@/hooks/use-data-store"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"

// Páginas públicas
import Index from "./pages/Index"
import RoomsList from "./pages/RoomsList"
import RoomDetails from "./pages/RoomDetails"
import ServicePage from "./pages/ServicePage"
import ContactPage from "./pages/ContactPage"
import NotFound from "./pages/NotFound"

// Páginas de administración
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminRooms from "./pages/AdminRooms"
import AdminRoomForm from "./pages/AdminRoomForm"
import AdminServices from "./pages/AdminServices"
import AdminServiceForm from "./pages/AdminServiceForm"
import AdminConfig from "./pages/AdminConfig"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <DataStoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/habitaciones" element={<RoomsList />} />
              <Route path="/habitacion/:id" element={<RoomDetails />} />
              <Route path="/servicios" element={<ServicePage />} />
              <Route path="/contacto" element={<ContactPage />} />

              {/* Rutas de administración */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/rooms"
                element={
                  <AdminProtectedRoute>
                    <AdminRooms />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/rooms/new"
                element={
                  <AdminProtectedRoute>
                    <AdminRoomForm />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/rooms/edit/:id"
                element={
                  <AdminProtectedRoute>
                    <AdminRoomForm />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <AdminProtectedRoute>
                    <AdminServices />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/services/new"
                element={
                  <AdminProtectedRoute>
                    <AdminServiceForm />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/services/edit/:id"
                element={
                  <AdminProtectedRoute>
                    <AdminServiceForm />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/config"
                element={
                  <AdminProtectedRoute>
                    <AdminConfig />
                  </AdminProtectedRoute>
                }
              />

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataStoreProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
