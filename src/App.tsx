
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RoomsList from "./pages/RoomsList";
import RoomDetails from "./pages/RoomDetails";
import ServicePage from "./pages/ServicePage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddRoom from "./pages/AdminAddRoom";
import AdminEditRoom from "./pages/AdminEditRoom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { RoomStoreProvider } from "./contexts/RoomStoreContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <RoomStoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/habitaciones" element={<RoomsList />} />
              <Route path="/habitacion/:id" element={<RoomDetails />} />
              <Route path="/servicios" element={<ServicePage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add-room" element={<AdminAddRoom />} />
              <Route path="/admin/edit-room/:id" element={<AdminEditRoom />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RoomStoreProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
