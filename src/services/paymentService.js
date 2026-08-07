import { USE_MOCK_DATA } from '../config/appConfig'
import { apiRequest, authenticatedApiRequest } from './api'

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

export function loadRazorpayScript() {
  if (USE_MOCK_DATA) {
    return Promise.reject(new Error('Razorpay is disabled in frontend preview mode.'))
  }

  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_URL
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Unable to load Razorpay.'))
    document.body.appendChild(script)
  })
}

function paymentRequest(endpoint, payload, auth) {
  if (USE_MOCK_DATA) {
    throw new Error('Payment API requests are disabled in frontend preview mode.')
  }

  const options = {
    method: 'POST',
    body: payload,
  }

  if (auth?.accessToken || auth?.refreshSession) {
    return authenticatedApiRequest(endpoint, options, auth)
  }

  return apiRequest(endpoint, options)
}

export function createPaymentOrder(payload, auth) {
  return paymentRequest('/payments/create-order', payload, auth)
}

export function verifyPayment(payload, auth) {
  return paymentRequest('/payments/verify', payload, auth)
}

export function createPhonePePayment(payload, auth) {
  return paymentRequest('/payments/phonepe/create', payload, auth)
}

export function getPhonePeConfiguration() {
  if (USE_MOCK_DATA) return Promise.resolve({ enabled: false })
  return apiRequest('/payments/phonepe/config', { method: 'GET' })
}

export function getPhonePePaymentStatus(orderId, auth) {
  if (USE_MOCK_DATA) throw new Error('Payment API requests are disabled in frontend preview mode.')
  return authenticatedApiRequest(`/payments/phonepe/status/${encodeURIComponent(orderId)}`, { method: 'GET' }, auth)
}

export async function startRazorpayPayment({ order, customer, notes = {} }) {
  if (USE_MOCK_DATA) {
    throw new Error('Razorpay is disabled in frontend preview mode.')
  }

  const key = order?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID

  if (!key) {
    throw new Error('Missing VITE_RAZORPAY_KEY_ID. Add the public key ID to your environment.')
  }

  const orderId = order?.razorpayOrderId || order?.id

  if (!orderId || !order?.amount || !order?.currency) {
    throw new Error('A backend-created Razorpay order is required before starting payment.')
  }

  await loadRazorpayScript()

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency,
      name: 'Ganesh Pickles',
      description: 'Pickle order payment',
      order_id: orderId,
      prefill: {
        name: customer?.fullName || customer?.name || '',
        email: customer?.email || '',
        contact: customer?.phone || '',
      },
      notes,
      theme: {
        color: '#BC2222',
      },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled.')),
      },
    })

    razorpay.on('payment.failed', (response) => {
      reject(new Error(response?.error?.description || 'Payment failed. Please try again.'))
    })

    razorpay.open()
  })
}
