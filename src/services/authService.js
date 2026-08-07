import { apiRequest, authenticatedApiRequest } from './api'

const AUTH_UNAVAILABLE_MESSAGE =
  'Customer accounts are temporarily unavailable. Please try again later.'

function isNetworkError(error) {
  return error instanceof TypeError || error?.message === 'Failed to fetch' || error?.message?.includes('NetworkError')
}

export function getSafeAuthErrorMessage(error, fallback = 'Authentication failed. Please try again.') {
  if (isNetworkError(error)) return AUTH_UNAVAILABLE_MESSAGE

  if (error?.status === 400 || error?.status === 422) {
    return error?.message || 'Please check the form details and try again.'
  }

  if (error?.status === 401) return 'Invalid email or password.'
  if (error?.status === 403) return 'Access denied. Please sign in again.'
  if (error?.status === 409) return 'An account with these details already exists.'
  if (error?.status === 429) return 'Too many attempts. Please wait a little and try again.'
  if (error?.status >= 500) return 'Authentication server error. Please try again later.'

  return String(error?.message || fallback).slice(0, 180)
}

function authRequest(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    credentials: 'include',
  })
}

export function registerCustomer(payload) {
  return authRequest('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function loginCustomer(payload) {
  return authRequest('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function logoutCustomer() {
  return authRequest('/auth/logout', {
    method: 'POST',
  })
}

export function refreshAccessToken() {
  return authRequest('/auth/refresh', {
    method: 'POST',
  })
}

export function getCurrentUser(accessToken) {
  return authRequest('/auth/me', {
    method: 'GET',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  })
}

export function getAuthenticatedCurrentUser(auth) {
  return authenticatedApiRequest('/auth/me', { method: 'GET' }, auth)
}

export { AUTH_UNAVAILABLE_MESSAGE }
