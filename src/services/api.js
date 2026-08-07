// Backend integration point: normal frontend preview pages do not call this module while VITE_DATA_SOURCE=mock.
import { USE_MOCK_DATA } from '../config/appConfig'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const AUTH_REFRESH_EXCLUDED_ENDPOINTS = ['/auth/register', '/auth/login', '/auth/refresh']

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function apiRequest(endpoint, options = {}) {
  if (USE_MOCK_DATA) {
    throw new ApiError('Backend API requests are disabled in frontend preview mode.', 0, {
      endpoint,
      previewMode: true,
    })
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const isFormData = options.body instanceof FormData
  const headers = {
    Accept: 'application/json',
    ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    credentials: options.credentials || 'include',
    headers,
    body: options.body && typeof options.body !== 'string' && !isFormData ? JSON.stringify(options.body) : options.body,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(data?.message || 'Something went wrong. Please try again.', response.status, data)
  }

  return data
}

export async function authenticatedApiRequest(endpoint, options = {}, auth = {}) {
  const { accessToken, refreshSession, onAuthFailure } = auth
  const shouldSkipRefresh = AUTH_REFRESH_EXCLUDED_ENDPOINTS.some((path) => endpoint.startsWith(path))

  const requestWithToken = (token) =>
    apiRequest(endpoint, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

  try {
    return await requestWithToken(accessToken)
  } catch (error) {
    if (error?.status !== 401 || !refreshSession || shouldSkipRefresh || options._retry || !accessToken) throw error

    const nextToken = await refreshSession({ showExpiredMessage: true })
    if (!nextToken) {
      if (onAuthFailure) onAuthFailure()
      throw error
    }

    return authenticatedApiRequest(endpoint, { ...options, _retry: true }, { ...auth, accessToken: nextToken })
  }
}

export { API_BASE_URL }
