import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthInput from '../components/auth/AuthInput'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
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
import { normalizeEmail, validateEmail } from '../utils/authValidation'

const REMEMBERED_EMAIL_KEY = 'ganesh-pickles-remembered-email'

function MailIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m4.75 7.25 7.25 5.5 7.25-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LoginPage() {
  const [values, setValues] = useState({ email: '', password: '', rememberEmail: false })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fieldRefs = useRef({})
  const navigate = useNavigate()
  const location = useLocation()
  const { login, authError, clearAuthError, isAuthAvailable } = useAuth()
  const { addToCart } = useCart()
  const { activeProducts } = useProductData()
  const routeMessage = typeof location.state?.message === 'string' ? location.state.message : ''

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY)
    if (rememberedEmail) {
      setValues((current) => ({ ...current, email: rememberedEmail, rememberEmail: true }))
    }
  }, [])

  const setFieldRef = (name) => (element) => {
    fieldRefs.current[name] = element
  }

  const validate = () => {
    const nextErrors = {}
    const emailError = validateEmail(values.email)
    if (emailError) nextErrors.email = emailError
    if (!values.password) nextErrors.password = 'Password is required.'
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
      fieldRefs.current[firstInvalid]?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      const email = normalizeEmail(values.email)
      const loginData = await login({ email, password: values.password })

      if (values.rememberEmail) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY)
      }

      setValues((current) => ({ ...current, password: '' }))

      if (loginData?.user?.role === 'admin') {
        clearAuthIntent()
        navigate('/admin/dashboard', { replace: true })
        return
      }

      const intent = readAuthIntent()
      const requestedDestination = getAuthDestination(location.state, location.search)
      if (intent?.action === AUTH_ACTIONS.BUY_NOW) {
        const product = activeProducts.find((item) => getProductId(item) === intent.productId)
        const variant = product?.variants?.find((item) => getVariantId(item) === intent.variantId)

        if (product && variant) {
          addToCart(product, variant, intent.quantity)
          clearAuthIntent()
          navigate('/checkout', { replace: true })
          return
        }
      } else {
        clearAuthIntent()
      }

      navigate(requestedDestination, { replace: true })
    } catch {
      setValues((current) => ({ ...current, password: '' }))
      fieldRefs.current.password?.focus()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      badge="Welcome back"
      title="Sign in for authentic Kerala flavours"
      subtitle="Access your Ganesh Pickles account for quicker checkout and customer details."
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Account login</p>
        <h1 className="mt-3 font-[Georgia,serif] text-3xl font-bold text-gray-900 sm:text-4xl">Welcome back</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
          {isAuthAvailable
            ? 'Login to your customer account for faster checkout and profile access.'
            : 'Customer accounts are temporarily unavailable. Please try again later.'}
        </p>
      </div>

      <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
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
          icon={<MailIcon />}
        />
        <PasswordInput
          inputRef={setFieldRef('password')}
          label="Password"
          name="password"
          value={values.password}
          error={errors.password}
          required
          autoComplete="current-password"
          disabled={isSubmitting}
          onChange={handleChange}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2 font-medium text-gray-600">
            <input
              type="checkbox"
              name="rememberEmail"
              checked={values.rememberEmail}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-gray-200 accent-brand"
            />
            Remember email
          </label>
          <a
            href="#forgot-password"
            className="font-semibold text-brand underline-offset-4 hover:underline"
            onClick={(event) => event.preventDefault()}
          >
            Forgot password?
          </a>
        </div>

        {routeMessage && !authError && (
          <div className="rounded-xl border border-brand/20 bg-brand-light/50 p-4 text-sm font-medium text-brand-dark">
            {routeMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 rounded-xl bg-brand px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:bg-brand-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-7 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
        New to Ganesh Pickles?{' '}
        <Link className="font-bold text-brand underline-offset-4 hover:underline" to={{ pathname: '/signup', search: location.search }} state={location.state}>
          Create Account
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
