import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import RoomsList from "./pages/RoomsList"
import RoomDetails from "./pages/RoomDetails"
import ServicePage from "./pages/ServicePage"
import ContactPage from "./pages/ContactPage"
import NotFound from "./pages/NotFound"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminRooms from "./pages/AdminRooms"
import AdminProtectedRoute from "./components/AdminProtectedRoute"
import { AdminAuthProvider } from "./hooks/use-admin-auth"
import { DataStoreProvider } from "./hooks/use-data-store"
import AdminConfig from "./pages/AdminConfig"
import AdminAddEditRoom from "./pages/AdminAddEditRoom"
import AdminServices from "./pages/AdminServices"
import AdminServiceForm from "./pages/AdminServiceForm"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <DataStoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/habitaciones" element={<RoomsList />} />
              <Route path="/habitacion/:id" element={<RoomDetails />} />
              <Route path="/servicios" element={<ServicePage />} />
              <Route path="/contacto" element={<ContactPage />} />

              {/* Admin Routes */}
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
                    <AdminAddEditRoom mode="add" />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/rooms/edit/:id"
                element={
                  <AdminProtectedRoute>
                    <AdminAddEditRoom mode="edit" />
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

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataStoreProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
)

export default App
