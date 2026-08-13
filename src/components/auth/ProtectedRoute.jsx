import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthLoading from './AuthLoading'
import { AUTH_ACTIONS, getLoginPath, saveAuthIntent } from '../../utils/authIntent'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <AuthLoading />
  if (isAuthenticated) return children

  const returnTo = `${location.pathname}${location.search}`
  saveAuthIntent({ action: AUTH_ACTIONS.RETURN_TO, returnTo })

  return (
    <Navigate
      to={getLoginPath(returnTo)}
      replace
      state={{
        from: returnTo,
        message: location.pathname === '/checkout' ? 'Please log in to continue to checkout.' : undefined,
      }}
    />
  )
}

export default ProtectedRoute
