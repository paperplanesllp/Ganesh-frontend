import { USE_MOCK_DATA } from '../config/appConfig'
import { apiRequest, authenticatedApiRequest } from './api'

function paymentRequest(endpoint, payload, auth) {
  if (USE_MOCK_DATA) {
    throw new Error('Payment API requests are disabled in frontend preview mode.')
  }

  const options = {
    method: 'POST',
    body: payload,
    // A stale access token should be refreshed before the backend rejects the request.
    // The payment is not re-submitted; the same request simply uses a renewed token.
  }

  if (auth?.accessToken || auth?.refreshSession) {
    return authenticatedApiRequest(endpoint, options, auth)
  }

  return apiRequest(endpoint, options)
}

export function createPhonePePayment(payload, auth) {
  return paymentRequest('/payments/phonepe/create', payload, auth)
}

export function getPhonePeConfiguration() {
  if (USE_MOCK_DATA) return Promise.resolve({ paymentConfigured: false, webhookConfigured: false })
  return apiRequest('/payments/phonepe/config', { method: 'GET' })
}

export function getPhonePePaymentStatus(orderId, auth) {
  if (USE_MOCK_DATA) throw new Error('Payment API requests are disabled in frontend preview mode.')
  return authenticatedApiRequest(`/payments/phonepe/status/${encodeURIComponent(orderId)}`, { method: 'GET' }, auth)
}
