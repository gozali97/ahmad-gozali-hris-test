import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ role }) {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    const redirect = user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
