/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useCart } from './CartContext'
import { USE_MOCK_DATA } from '../config/appConfig'
import {
  AUTH_UNAVAILABLE_MESSAGE,
  getCurrentUser,
  getSafeAuthErrorMessage,
  loginCustomer,
  logoutCustomer,
  refreshAccessToken,
  registerCustomer,
} from '../services/authService'
import { clearAuthIntent } from '../utils/authIntent'

const AuthContext = createContext(null)
const AUTH_SESSION_HINT_KEY = 'ganesh-pickles-auth-session'
const FRONTEND_PREVIEW_AUTH_MESSAGE =
  'Customer accounts are temporarily unavailable. Please try again later.'

function hasStoredAuthSessionHint() {
  try {
    return window.localStorage.getItem(AUTH_SESSION_HINT_KEY) === 'true'
  } catch {
    return false
  }
}

function setStoredAuthSessionHint(value) {
  try {
    if (value) {
      window.localStorage.setItem(AUTH_SESSION_HINT_KEY, 'true')
    } else {
      window.localStorage.removeItem(AUTH_SESSION_HINT_KEY)
    }
  } catch {
    // Local storage can be unavailable in strict browser modes.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState('')
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA)
  const [authError, setAuthError] = useState('')
  const { showToast } = useCart()

  const clearAuthError = useCallback(() => setAuthError(''), [])
  const updateCurrentUser = useCallback((nextUser) => {
    setUser(nextUser || null)
  }, [])

  const unavailableAuth = useCallback(async () => {
    setAuthError(FRONTEND_PREVIEW_AUTH_MESSAGE)
    showToast(FRONTEND_PREVIEW_AUTH_MESSAGE, 'info')
    throw new Error(FRONTEND_PREVIEW_AUTH_MESSAGE)
  }, [showToast])

  const refreshSession = useCallback(async ({ showExpiredMessage = false } = {}) => {
    if (USE_MOCK_DATA) return ''

    try {
      const data = await refreshAccessToken()
      const nextToken = data?.accessToken || ''
      setAccessToken(nextToken)
      setStoredAuthSessionHint(Boolean(nextToken))

      if (nextToken) {
        const currentUser = await getCurrentUser(nextToken)
        setUser(currentUser?.user || null)
      }

      setAuthError('')
      return nextToken
    } catch (error) {
      setUser(null)
      setAccessToken('')
      setStoredAuthSessionHint(false)

      if (showExpiredMessage) {
        const message = error?.status === 401
          ? 'Your session has expired. Please log in again.'
          : getSafeAuthErrorMessage(error, 'Please log in again.')
        setAuthError(message)
        showToast(message, 'error')
      }

      return ''
    }
  }, [showToast])

  useEffect(() => {
    if (USE_MOCK_DATA) return undefined

    let active = true

    const restoreSession = async () => {
      if (!hasStoredAuthSessionHint()) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      await refreshSession()
      if (active) setIsLoading(false)
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [refreshSession])

  const signup = useCallback(async (payload) => {
    if (USE_MOCK_DATA) return unavailableAuth()

    try {
      const data = await registerCustomer(payload)
      setUser(data?.user || null)
      setAccessToken(data?.accessToken || '')
      setStoredAuthSessionHint(Boolean(data?.accessToken))
      setAuthError('')
      showToast('Account created successfully', 'success')
      return data
    } catch (error) {
      const message = getSafeAuthErrorMessage(error, 'Account creation failed. Please try again.')
      setAuthError(message)
      showToast(message, 'error')
      throw error
    }
  }, [showToast, unavailableAuth])

  const login = useCallback(async (payload) => {
    if (USE_MOCK_DATA) return unavailableAuth()

    try {
      const data = await loginCustomer(payload)
      setUser(data?.user || null)
      setAccessToken(data?.accessToken || '')
      setStoredAuthSessionHint(Boolean(data?.accessToken))
      setAuthError('')
      showToast('Login successful', 'success')
      return data
    } catch (error) {
      setUser(null)
      setAccessToken('')
      setStoredAuthSessionHint(false)
      const message = getSafeAuthErrorMessage(error, 'Login failed. Please try again.')
      setAuthError(message)
      showToast(message, 'error')
      throw error
    }
  }, [showToast, unavailableAuth])

  const logout = useCallback(async () => {
    clearAuthIntent()

    if (!USE_MOCK_DATA) {
      try {
        await logoutCustomer()
      } catch {
        // Local session cleanup should still happen if the logout request fails.
      }

      setUser(null)
      setAccessToken('')
      setStoredAuthSessionHint(false)
      setAuthError('')
      showToast('Logged out successfully', 'info')
      return
    }

    setAuthError('')
    showToast('No customer session is active in frontend preview mode.', 'info')
  }, [showToast])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      isAuthAvailable: !USE_MOCK_DATA,
      authUnavailableMessage: AUTH_UNAVAILABLE_MESSAGE,
      isLoading,
      authError,
      login,
      signup,
      logout,
      refreshSession,
      clearAuthError,
      updateCurrentUser,
    }),
    [accessToken, authError, clearAuthError, isLoading, login, logout, refreshSession, signup, updateCurrentUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
