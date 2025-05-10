import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface AdminProtectedRouteProps {
  children: ReactNode
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default AdminProtectedRoute
