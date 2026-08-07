import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminLoadingState from './AdminLoadingState'

function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) return <AdminLoadingState message="Checking admin session..." />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: { pathname: location.pathname } }} />
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return children
}

export default AdminRoute
