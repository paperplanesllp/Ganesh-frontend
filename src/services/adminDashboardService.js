import { authenticatedApiRequest } from './api'

export function getAdminDashboard(auth) {
  return authenticatedApiRequest('/admin/dashboard', { method: 'GET' }, auth)
}

export function getAdminReviews(params = {}, auth = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })
  const suffix = query.toString() ? `?${query}` : ''
  return authenticatedApiRequest(`/admin/reviews${suffix}`, { method: 'GET' }, auth)
}

export function updateAdminReviewStatus(reviewId, status, auth) {
  return authenticatedApiRequest(
    `/admin/reviews/${encodeURIComponent(reviewId)}/status`,
    { method: 'PATCH', body: { status } },
    auth,
  )
}

export function deleteAdminReview(reviewId, auth) {
  return authenticatedApiRequest(
    `/admin/reviews/${encodeURIComponent(reviewId)}`,
    { method: 'DELETE' },
    auth,
  )
}
