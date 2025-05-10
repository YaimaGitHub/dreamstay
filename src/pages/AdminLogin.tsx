
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    
    if (success) {
      toast.success("Inicio de sesión exitoso");
      navigate("/admin/dashboard");
    } else {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Panel Administrativo</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al panel de administración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Usuario
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-terracotta hover:bg-terracotta/90"
              >
                Iniciar sesión
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-center text-sm text-muted-foreground">
            Para acceder, use "Administrador" como usuario y "root" como contraseña.
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
