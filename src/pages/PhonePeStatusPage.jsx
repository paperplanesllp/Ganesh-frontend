import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getPhonePePaymentStatus } from '../services/paymentService'
import { formatCurrency } from '../utils/currency'

const MAX_CHECKS = 6
const CHECK_INTERVAL_MS = 5000

// Network errors and server errors are worth retrying; 4xx answers will not change.
function isRetryableError(error) {
  return !error?.status || error.status >= 500
}

function PhonePeStatusPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId') || ''
  const { accessToken, refreshSession } = useAuth()
  const { clearCart } = useCart()
  const clearCartRef = useRef(clearCart)
  clearCartRef.current = clearCart
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('Checking payment...')
  const [orderSummary, setOrderSummary] = useState(null)
  const [checkRound, setCheckRound] = useState(0)
  const [canRecheck, setCanRecheck] = useState(false)

  useEffect(() => {
    let active = true
    let timer
    let checks = 0
    setCanRecheck(false)
    const scheduleNextCheck = () => {
      checks += 1
      if (checks < MAX_CHECKS) timer = window.setTimeout(check, CHECK_INTERVAL_MS)
      else setCanRecheck(true)
    }
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
          setOrderSummary(result)
          setStatus('paid')
          setMessage('Payment successful')
          return
        }
        if (result.paymentStatus === 'failed') {
          setStatus('failed')
          setMessage('Payment failed or was cancelled')
          return
        }
        setStatus('pending')
        setMessage('Payment is being confirmed')
        scheduleNextCheck()
      } catch (error) {
        if (!active) return
        setStatus('pending')
        if (error?.status === 503) {
          setMessage('PhonePe payment gateway is not configured yet.')
          return
        }
        if (!isRetryableError(error)) {
          setMessage('We could not find this payment. Please check your orders.')
          return
        }
        setMessage('We could not confirm the payment yet.')
        scheduleNextCheck()
      }
    }
    check()
    return () => { active = false; if (timer) window.clearTimeout(timer) }
  }, [accessToken, orderId, refreshSession, checkRound])

  const checkAgain = () => {
    setStatus('checking')
    setMessage('Checking payment...')
    setCheckRound((round) => round + 1)
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase text-brand">PhonePe payment</p>
          <h1 className="font-[Georgia,serif] text-4xl font-bold text-brand-dark">{message}</h1>
          {orderId && <p className="mt-4 text-sm text-gray-600">Order ID: {orderId}</p>}
          {status === 'paid' && orderSummary && (
            <div className="mx-auto mt-6 grid max-w-sm gap-2 rounded-xl bg-brand-light p-4 text-left text-sm text-gray-600">
              <p className="flex justify-between"><span>Subtotal</span><strong>{formatCurrency(orderSummary.subtotal)}</strong></p>
              <p className="flex justify-between"><span>Shipping</span><strong>{formatCurrency(orderSummary.deliveryCharge)}</strong></p>
              <p className="flex justify-between border-t border-brand/20 pt-2 text-base text-brand-dark"><span className="font-bold">Total</span><strong>{formatCurrency(orderSummary.totalAmount)}</strong></p>
            </div>
          )}
          {status === 'paid' && orderSummary?.email && (
            <p className="mt-4 text-sm text-gray-600">A confirmation email is on its way to <strong>{orderSummary.email}</strong>.</p>
          )}
          {status === 'checking' && <p className="mt-4 text-gray-600">Please wait while we verify the result securely.</p>}
          {status === 'pending' && canRecheck && <p className="mt-4 text-sm text-gray-600">If you completed the payment, it will be confirmed shortly. You will get a confirmation email once it is.</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {status === 'paid' ? <Link to="/products" className="rounded-full bg-brand px-6 py-3 font-semibold text-white">Continue Shopping</Link> : <Link to="/account/orders" className="rounded-full bg-brand px-6 py-3 font-semibold text-white">View Orders</Link>}
            {status === 'pending' && canRecheck && <button type="button" onClick={checkAgain} className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-brand">Check again</button>}
            {status === 'failed' && <Link to="/checkout" className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-brand">Try Again</Link>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhonePeStatusPage
