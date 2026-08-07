import { authenticatedApiRequest } from './api'

export function getMyProfile(auth) {
  return authenticatedApiRequest('/users/me', { method: 'GET' }, auth)
}

export function updateMyProfile(payload, auth) {
  return authenticatedApiRequest('/users/me', { method: 'PATCH', body: payload }, auth)
}

export function getMyAddresses(auth) {
  return authenticatedApiRequest('/users/me/addresses', { method: 'GET' }, auth)
}

export function createMyAddress(payload, auth) {
  return authenticatedApiRequest('/users/me/addresses', { method: 'POST', body: payload }, auth)
}

export function updateMyAddress(addressId, payload, auth) {
  return authenticatedApiRequest(`/users/me/addresses/${encodeURIComponent(addressId)}`, { method: 'PATCH', body: payload }, auth)
}

export function deleteMyAddress(addressId, auth) {
  return authenticatedApiRequest(`/users/me/addresses/${encodeURIComponent(addressId)}`, { method: 'DELETE' }, auth)
}
