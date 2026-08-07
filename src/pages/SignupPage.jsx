import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthInput from '../components/auth/AuthInput'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
import PasswordStrength from '../components/auth/PasswordStrength'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProductData } from '../context/ProductDataContext'
import { getProductId, getVariantId } from '../utils/localProductCatalog'
import {
  AUTH_ACTIONS,
  clearAuthIntent,
  getAuthDestination,
  readAuthIntent,
} from '../utils/authIntent'
import {
  normalizeEmail,
  normalizeIndianPhone,
  validateEmail,
  validateFullName,
  validateIndianPhone,
  validatePassword,
  validatePasswordConfirmation,
} from '../utils/authValidation'

const initialValues = {
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false,
}

function SignupPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fieldRefs = useRef({})
  const navigate = useNavigate()
  const location = useLocation()
  const { signup, authError, clearAuthError, isAuthAvailable } = useAuth()
  const { addToCart } = useCart()
  const { activeProducts } = useProductData()

  const setFieldRef = (name) => (element) => {
    fieldRefs.current[name] = element
  }

  const validate = () => {
    const nextErrors = {}
    const fullNameError = validateFullName(values.fullName)
    const phoneError = validateIndianPhone(values.phone)
    const emailError = validateEmail(values.email)
    const passwordError = validatePassword(values.password)
    const confirmPasswordError = validatePasswordConfirmation(values.password, values.confirmPassword)

    if (fullNameError) nextErrors.fullName = fullNameError
    if (phoneError) nextErrors.phone = phoneError
    if (emailError) nextErrors.email = emailError
    if (passwordError) nextErrors.password = passwordError
    if (confirmPasswordError) nextErrors.confirmPassword = confirmPasswordError
    if (!values.agreement) nextErrors.agreement = 'Please accept the terms and privacy agreement.'

    return nextErrors
  }

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    clearAuthError()
    setErrors((current) => {
      if (!current[name]) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = Object.keys(nextErrors)[0]
      fieldRefs.current[firstInvalid]?.focus?.()
      return
    }

    setIsSubmitting(true)
    try {
      await signup({
        fullName: values.fullName.trim(),
        phone: normalizeIndianPhone(values.phone),
        email: normalizeEmail(values.email),
        password: values.password,
      })
      setValues(initialValues)
      const intent = readAuthIntent()
      const destination = getAuthDestination(location.state)
      if (intent?.action === AUTH_ACTIONS.BUY_NOW) {
        const product = activeProducts.find((item) => getProductId(item) === intent.productId)
        const variant = product?.variants?.find((item) => getVariantId(item) === intent.variantId)

        if (product && variant && addToCart(product, variant, intent.quantity)) {
          clearAuthIntent()
          navigate('/checkout', { replace: true })
          return
        }
      } else {
        clearAuthIntent()
      }

      navigate(destination, { replace: true })
    } catch {
      setValues((current) => ({ ...current, password: '', confirmPassword: '' }))
      fieldRefs.current.password?.focus?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      badge="Create account"
      title="Join Ganesh Pickles for easier orders"
      subtitle="Create a customer account for profile access and smoother checkout."
      variant="single"
    >
      <div>
        <p className="text-sm font-bold uppercase text-brand">Customer signup</p>
        <h1 className="mt-2 font-[Georgia,serif] text-3xl font-bold text-brand-dark">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {isAuthAvailable
            ? 'Create your customer account for faster checkout and profile access.'
            : 'Customer accounts are temporarily unavailable. Please try again later.'}
        </p>
      </div>

      <form className="mt-7 grid gap-5" onSubmit={handleSubmit} noValidate>
        <AuthInput
          inputRef={setFieldRef('fullName')}
          label="Full name"
          name="fullName"
          value={values.fullName}
          error={errors.fullName}
          required
          autoComplete="name"
          disabled={isSubmitting}
          onChange={handleChange}
        />
        <AuthInput
          inputRef={setFieldRef('phone')}
          label="Mobile number"
          name="phone"
          type="tel"
          value={values.phone}
          placeholder="+91 9876543210"
          error={errors.phone}
          required
          autoComplete="tel"
          disabled={isSubmitting}
          onChange={handleChange}
        />
        <AuthInput
          inputRef={setFieldRef('email')}
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          placeholder="customer@example.com"
          error={errors.email}
          required
          autoComplete="email"
          disabled={isSubmitting}
          onChange={handleChange}
        />
        <PasswordInput
          inputRef={setFieldRef('password')}
          label="Password"
          name="password"
          value={values.password}
          error={errors.password}
          required
          autoComplete="new-password"
          disabled={isSubmitting}
          onChange={handleChange}
        />
        <PasswordStrength password={values.password} />
        <PasswordInput
          inputRef={setFieldRef('confirmPassword')}
          label="Confirm password"
          name="confirmPassword"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          disabled={isSubmitting}
          onChange={handleChange}
        />

        <label className="flex items-start gap-3 text-sm font-semibold text-brand">
          <input
            ref={setFieldRef('agreement')}
            type="checkbox"
            name="agreement"
            checked={values.agreement}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 h-4 w-4 rounded border-gray-200 accent-brand"
          />
          <span>I agree to the terms and privacy policy for creating a Ganesh Pickles customer account.</span>
        </label>
        {errors.agreement && <p className="text-sm font-semibold text-brand">{errors.agreement}</p>}

        {authError && (
          <div className="rounded-xl border border-brand/30 bg-white p-4 text-sm font-semibold text-brand">
            {authError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-brand px-5 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link className="font-bold text-brand underline-offset-4 hover:underline" to="/login" state={location.state}>
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}

export default SignupPage
