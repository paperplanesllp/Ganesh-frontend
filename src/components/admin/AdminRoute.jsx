import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminLoadingState from './AdminLoadingState'
import { getLoginPath } from '../../utils/authIntent'

function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) return <AdminLoadingState message="Checking admin session..." />
  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`
    return <Navigate to={getLoginPath(returnTo)} replace state={{ from: returnTo }} />
  }
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return children
}

export default AdminRoute
