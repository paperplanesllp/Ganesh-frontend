import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthLoading from './AuthLoading'
import { getAuthDestination } from '../../utils/authIntent'

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()
  const destination = getAuthDestination(location.state, location.search)

  if (isLoading) return <AuthLoading />
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : destination} replace />
  }

  return children
}

export default GuestRoute
