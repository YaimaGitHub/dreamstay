"use client"

import { type ReactNode, useState, useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface AdminProtectedRouteProps {
  children: ReactNode
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { isAuthenticated } = useAdminAuth()
  const location = useLocation()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  // Check if we're in a form page where we need to prevent immediate redirect
  const isFormPage =
    location.pathname.includes("/edit/") || location.pathname.includes("/new") || location.pathname.includes("/add")

  // Only redirect if not authenticated and not on a form page,
  // or if we've explicitly set shouldRedirect to true
  useEffect(() => {
    // If not authenticated and not in a form page, redirect immediately
    if (!isAuthenticated && !isFormPage) {
      setShouldRedirect(true)
    }
    // If not authenticated but in a form page, check if there are active operations
    else if (!isAuthenticated && isFormPage) {
      // We'll set a small delay to allow for any active operations to complete
      const redirectTimer = setTimeout(() => {
        setShouldRedirect(true)
      }, 300)

      return () => clearTimeout(redirectTimer)
    }
  }, [isAuthenticated, isFormPage])

  if (shouldRedirect) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default AdminProtectedRoute
