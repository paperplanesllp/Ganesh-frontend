import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getPhonePePaymentStatus } from '../services/paymentService'

const MAX_CHECKS = 4
const CHECK_INTERVAL_MS = 5000

function PhonePeStatusPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId') || ''
  const { accessToken, refreshSession } = useAuth()
  const { clearCart } = useCart()
  const clearCartRef = useRef(clearCart)
  clearCartRef.current = clearCart
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('Checking payment...')

  useEffect(() => {
    let active = true
    let timer
    let checks = 0
    const check = async () => {
      if (!orderId || !accessToken) {
        if (active) { setStatus('failed'); setMessage('We could not identify this payment.') }
        return
      }
      try {
        const result = await getPhonePePaymentStatus(orderId, { accessToken, refreshSession })
        if (!active) return
        if (result.paymentStatus === 'paid') {
          clearCartRef.current()
          setStatus('paid')
          setMessage('Payment successful')
          return
        }
        if (result.paymentStatus === 'failed') {
          setStatus('failed')
          setMessage('Payment failed or was cancelled')
          return
        }
        checks += 1
        setStatus('pending')
        setMessage('Payment is being confirmed')
        if (checks < MAX_CHECKS) timer = window.setTimeout(check, CHECK_INTERVAL_MS)
      } catch (error) {
        if (!active) return
        setStatus('pending')
        setMessage(error?.status === 503 ? 'PhonePe payment gateway is not configured yet.' : 'We could not confirm the payment yet. Please check again later.')
      }
    }
    check()
    return () => { active = false; if (timer) window.clearTimeout(timer) }
  }, [accessToken, orderId, refreshSession])

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase text-brand">PhonePe payment</p>
          <h1 className="font-[Georgia,serif] text-4xl font-bold text-brand-dark">{message}</h1>
          {orderId && <p className="mt-4 text-sm text-gray-600">Order ID: {orderId}</p>}
          {status === 'checking' && <p className="mt-4 text-gray-600">Please wait while we verify the result securely.</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {status === 'paid' ? <Link to="/products" className="rounded-full bg-brand px-6 py-3 font-semibold text-white">Continue Shopping</Link> : <Link to="/account/orders" className="rounded-full bg-brand px-6 py-3 font-semibold text-white">View Orders</Link>}
            {status === 'failed' && <Link to="/checkout" className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-brand">Try Again</Link>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhonePeStatusPage
