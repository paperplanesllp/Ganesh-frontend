import { authenticatedApiRequest } from './api'

export async function getMyOrders(auth) {
  const data = await authenticatedApiRequest('/orders/my', { method: 'GET' }, auth)
  return {
    ...data,
    orders: data?.orders || [],
  }
}

export async function getMyOrderById(orderId, auth) {
  const data = await authenticatedApiRequest(`/orders/my/${encodeURIComponent(orderId)}`, { method: 'GET' }, auth)
  return data?.order || null
}
