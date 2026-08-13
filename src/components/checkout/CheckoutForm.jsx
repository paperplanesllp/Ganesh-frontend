import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { USE_MOCK_DATA } from '../../config/appConfig'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { createPhonePePayment, getPhonePeConfiguration } from '../../services/paymentService'
import { validateCheckout } from '../../utils/validation'
import { INDIAN_STATES_AND_UTS } from '../../utils/shipping'
import { AUTH_ACTIONS, getLoginPath, saveAuthIntent } from '../../utils/authIntent'

const initialValues = {
  fullName: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  city: '',
  district: 'Palakkad',
  state: 'Kerala',
  pincode: '',
  notes: '',
}

const PAYMENT_CONFIG_MESSAGE = USE_MOCK_DATA
  ? 'PhonePe is not available in frontend preview mode. Enable the backend API to test payments.'
  : 'PhonePe payment is currently unavailable.'

function getSafePaymentError(error) {
  if (error?.message === 'Payment cancelled.') return 'Payment was cancelled. Your cart is unchanged.'
  if (error?.status === 422) return error.message || 'Please check your cart and delivery details.'
  if (error?.status === 503) return 'PhonePe payment is currently unavailable.'
  if (error?.status >= 500) return 'Unable to start PhonePe payment. Please try again.'
  if (error instanceof TypeError || error?.message === 'Failed to fetch') return 'Unable to reach the payment server. Please try again.'
  return 'Payment could not be completed. Please try again.'
}

function CheckoutForm({ onDeliveryStateChange }) {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [paymentError, setPaymentError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('idle')
  const [isPhonePeAvailable, setIsPhonePeAvailable] = useState(false)
  const [touchedFields, setTouchedFields] = useState({})
  const paymentInFlightRef = useRef(false)
  const { cartItems, showToast } = useCart()
  const { accessToken, refreshSession, user, isAuthenticated } = useAuth()
  const isProcessing = paymentStatus !== 'idle'
  const buttonLabel = paymentStatus === 'creating'
    ? 'Creating secure payment...'
    : paymentStatus === 'verifying'
      ? 'Verifying payment...'
      : 'Pay Securely with PhonePe'

  useEffect(() => {
    if (!isAuthenticated || !user) return

    setValues((current) => ({
      ...current,
      fullName: touchedFields.fullName || current.fullName ? current.fullName : user.fullName || '',
      email: touchedFields.email || current.email ? current.email : user.email || '',
      phone: touchedFields.phone || current.phone ? current.phone : user.phone || '',
    }))

    // Future backend integration point: merge a guest cart with a customer cart after login.
  }, [isAuthenticated, touchedFields.email, touchedFields.fullName, touchedFields.phone, user])

  useEffect(() => {
    let active = true
    getPhonePeConfiguration()
      .then((configuration) => {
        if (active) setIsPhonePeAvailable(Boolean(configuration?.paymentConfigured))
      })
      .catch(() => {
        if (active) setIsPhonePeAvailable(false)
      })
    return () => { active = false }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (name === 'state') onDeliveryStateChange?.(value)
    setTouchedFields((current) => ({ ...current, [name]: true }))
    setErrors((current) => {
      if (!current[name]) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (paymentInFlightRef.current || isProcessing) return

    if (!isAuthenticated || !accessToken) {
      const message = 'Please log in again to continue with payment.'
      saveAuthIntent({ action: AUTH_ACTIONS.RETURN_TO, returnTo: '/checkout' })
      showToast(message, 'info')
      navigate(getLoginPath('/checkout'), {
        state: {
          from: '/checkout',
          message,
        },
      })
      return
    }

    const nextErrors = validateCheckout(values)
    setErrors(nextErrors)
    setPaymentError('')

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = Object.keys(nextErrors)[0]
      window.requestAnimationFrame(() => {
        document.querySelector(`[name="${firstInvalid}"]`)?.focus?.()
      })
      return
    }

    if (cartItems.length === 0) {
      const message = 'Your cart is empty. Add products before checkout.'
      setPaymentError(message)
      showToast(message, 'error')
      return
    }

    if (!isPhonePeAvailable) {
      setPaymentError(PAYMENT_CONFIG_MESSAGE)
      showToast(PAYMENT_CONFIG_MESSAGE, 'info')
      return
    }

    const auth = {
      accessToken,
      refreshSession,
    }

    const orderPayload = {
      customerName: values.fullName,
      email: values.email,
      phone: values.phone,
      shipping: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        landmark: values.landmark,
        city: values.city,
        district: values.district,
        state: values.state,
        pincode: values.pincode,
      },
      notes: values.notes,
      items: cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    }

    let redirectStarted = false
    try {
      paymentInFlightRef.current = true
      setPaymentStatus('creating')
      const phonepeOrder = await createPhonePePayment(orderPayload, auth)
      if (!phonepeOrder?.redirectUrl) throw new Error('PhonePe did not return a payment URL.')
      redirectStarted = true
      window.location.assign(phonepeOrder.redirectUrl)
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        const message = 'Please log in again to continue with payment.'
        saveAuthIntent({ action: AUTH_ACTIONS.RETURN_TO, returnTo: '/checkout' })
        showToast(message, 'info')
        navigate(getLoginPath('/checkout'), {
          state: {
            from: '/checkout',
            message,
          },
          replace: true,
        })
        return
      }

      const message = getSafePaymentError(error)
      setPaymentError(message)
      showToast(message, error?.message === 'Payment cancelled.' ? 'info' : 'error')
    } finally {
      if (!redirectStarted) {
        paymentInFlightRef.current = false
        setPaymentStatus('idle')
      }
    }
  }

  const fieldClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition duration-200 focus:ring-2 focus:ring-brand'

  const renderInput = ({ name, label, autoComplete, type = 'text', required = true }) => (
    <label className="grid gap-2 text-sm font-semibold text-gray-900">
      {label}
      <input
        className={fieldClass}
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && <span id={`${name}-error`} className="text-xs font-semibold text-brand">{errors[name]}</span>}
      {!required && !errors[name] && <span className="text-xs text-gray-600">Optional</span>}
    </label>
  )

  return (
    <form className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6" onSubmit={handleSubmit}>
      <h2 className="font-[Georgia,serif] text-2xl font-bold text-brand-dark">Delivery Details</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {renderInput({ name: 'fullName', label: 'Full name', autoComplete: 'name' })}
        {renderInput({ name: 'phone', label: 'Mobile number', autoComplete: 'tel', type: 'tel' })}
        {renderInput({ name: 'email', label: 'Email address', autoComplete: 'email', type: 'email' })}
        {renderInput({ name: 'city', label: 'City', autoComplete: 'address-level2' })}
        {renderInput({ name: 'district', label: 'District', autoComplete: 'address-level2' })}
        <label className="grid gap-2 text-sm font-semibold text-gray-900">
          State / Union Territory
          <select
            className={fieldClass}
            name="state"
            value={values.state}
            onChange={handleChange}
            autoComplete="address-level1"
            aria-invalid={Boolean(errors.state)}
            aria-describedby={errors.state ? 'state-error' : undefined}
          >
            {INDIAN_STATES_AND_UTS.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
          {errors.state && <span id="state-error" className="text-xs font-semibold text-brand">{errors.state}</span>}
        </label>
        {renderInput({ name: 'pincode', label: 'Six-digit PIN code', autoComplete: 'postal-code' })}
        {renderInput({ name: 'landmark', label: 'Landmark', autoComplete: 'off', required: false })}
        <label className="grid gap-2 text-sm font-semibold text-gray-900 md:col-span-2">
          Address line 1
          <input
            className={fieldClass}
            name="addressLine1"
            value={values.addressLine1}
            onChange={handleChange}
            autoComplete="address-line1"
            aria-invalid={Boolean(errors.addressLine1)}
            aria-describedby={errors.addressLine1 ? 'addressLine1-error' : undefined}
          />
          {errors.addressLine1 && <span id="addressLine1-error" className="text-xs font-semibold text-brand">{errors.addressLine1}</span>}
        </label>
        <label className="grid gap-2 text-sm font-semibold text-gray-900 md:col-span-2">
          Address line 2
          <input
            className={fieldClass}
            name="addressLine2"
            value={values.addressLine2}
            onChange={handleChange}
            autoComplete="address-line2"
          />
          <span className="text-xs text-gray-600">Optional</span>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-gray-900 md:col-span-2">
          Order notes
          <textarea
            className={`${fieldClass} min-h-28 resize-y`}
            name="notes"
            value={values.notes}
            onChange={handleChange}
          />
          <span className="text-xs text-gray-600">Optional</span>
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 p-4 text-sm font-semibold text-gray-900">
        Payment method: PhonePe
      </div>

      {paymentError && (
        <div className="mt-6 rounded-xl border border-brand/30 bg-white p-4 text-sm font-semibold text-brand">
          {paymentError}
        </div>
      )}

      {!paymentError && !isPhonePeAvailable && (
        <div className="mt-6 rounded-xl border border-brand/30 bg-white p-4 text-sm font-semibold text-brand">
          {PAYMENT_CONFIG_MESSAGE}
        </div>
      )}

      <button
        type="submit"
        className="mt-6 min-h-12 w-full rounded-lg bg-brand px-5 py-3 font-extrabold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isProcessing || !isPhonePeAvailable}
      >
        {buttonLabel}
      </button>
    </form>
  )
}

export default CheckoutForm
