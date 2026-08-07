import { authenticatedApiRequest } from './api'

function queryString(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) query.set(key, String(value))
  })
  const value = query.toString()
  return value ? `?${value}` : ''
}

export async function getAdminOrders(params = {}, auth = {}) {
  const data = await authenticatedApiRequest(`/admin/orders${queryString(params)}`, { method: 'GET' }, auth)
  const pagination = data.pagination
  return {
    ...data,
    pagination: pagination ? {
      ...pagination,
      totalProducts: pagination.total,
      totalPages: pagination.pages,
      hasPreviousPage: pagination.page > 1,
      hasNextPage: pagination.page < pagination.pages,
    } : null,
  }
}

export function updateAdminOrderStatus(orderId, status, auth = {}) {
  return authenticatedApiRequest(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    body: { status },
  }, auth)
}
