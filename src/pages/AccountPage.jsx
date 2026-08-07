import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import AccountSidebar, { AccountIcon } from '../components/auth/AccountSidebar'
import { useAuth } from '../context/AuthContext'
import { useProductData } from '../context/ProductDataContext'
import { getMyOrderById, getMyOrders } from '../services/orderService'
import { createMyAddress, deleteMyAddress, getMyAddresses, getMyProfile, updateMyProfile } from '../services/userService'
import { formatCurrency } from '../utils/currency'
import { resolveProductImage } from '../utils/productImages'

const orderFilters = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const recentlyViewedKey = 'ganesh_pickles_recently_viewed_products'

function formatDate(value) {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function titleCase(value) {
  return String(value || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getAddressSummary(address) {
  if (!address) return 'Address not available'
  return [address.addressLine1, address.city, address.state, address.pincode].filter(Boolean).join(', ')
}

function getOrderFilterStatus(orderStatus) {
  if (orderStatus === 'fulfilled') return 'Delivered'
  if (orderStatus === 'cancelled') return 'Cancelled'
  if (orderStatus === 'shipped') return 'Shipped'
  return 'Processing'
}

function EmptyState({ icon = 'orders', title, message, action }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-light text-brand">
        <AccountIcon name={icon} />
      </div>
      <h2 className="mt-4 font-[Georgia,serif] text-2xl font-bold text-brand-dark">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">{message}</p>
      {action}
    </section>
  )
}

function ActionCard({ to, icon, title, text, actionLabel }) {
  return (
    <Link
      to={to}
      className="group flex min-h-56 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-light text-brand">
          <AccountIcon name={icon} />
        </div>
        <span className="text-2xl font-bold text-brand transition duration-200 group-hover:translate-x-1">›</span>
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
      <p className="mt-auto pt-5 text-sm font-bold text-brand">{actionLabel}</p>
    </Link>
  )
}

function AccountHeader({ user }) {
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || 'Customer'
  const isAdmin = user?.role === 'admin'

  return (
    <header className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-brand-light/40 p-7 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{isAdmin ? 'Admin Account' : 'My Account'}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Welcome, {firstName}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
        {isAdmin ? 'Manage your administrator profile and saved addresses.' : 'Manage your orders, profile and delivery addresses.'}
      </p>
      {isAdmin && (
        <Link to="/admin/dashboard" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-dark">
          Return to Admin Dashboard
        </Link>
      )}
    </header>
  )
}

function OverviewSection({ user }) {
  const isAdmin = user?.role === 'admin'

  return (
    <div className="grid gap-6">
      <AccountHeader user={user} />
      <section className={`grid gap-5 ${isAdmin ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {!isAdmin && <ActionCard
          to="/account/orders"
          icon="orders"
          title="My Orders"
          text="View, track and manage your orders"
          actionLabel="View Orders"
        />}
        <ActionCard
          to="/account/profile"
          icon="profile"
          title="Profile Information"
          text="Update your name, email and mobile number"
          actionLabel="Edit Profile"
        />
        <ActionCard
          to="/account/addresses"
          icon="address"
          title="Manage Addresses"
          text="Add or update delivery addresses"
          actionLabel="Manage Addresses"
        />
      </section>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="h-7 w-48 animate-pulse rounded-full bg-brand-light" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-24 animate-pulse rounded-xl bg-brand-light" />
        ))}
      </div>
    </section>
  )
}

function ProfileSection({ auth }) {
  const [profile, setProfile] = useState(auth.user)
  const [status, setStatus] = useState('loading')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setStatus('loading')

    getMyProfile({
      accessToken: auth.accessToken,
      refreshSession: auth.refreshSession,
    })
      .then((data) => {
        if (!active) return
        setProfile(data?.user || auth.user)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [auth.accessToken, auth.refreshSession, auth.user])

  if (status === 'loading') return <ProfileSkeleton />

  if (status === 'error') {
    return (
      <EmptyState
        icon="profile"
        title="We could not load your profile"
        message="Please check your connection and try again."
        action={
          <button
            type="button"
            className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        }
      />
    )
  }

  const details = [
    ['Full name', profile?.fullName],
    ['Email address', profile?.email],
    ['Mobile number', profile?.phone],
  ]

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase text-brand">Account Settings</p>
      <h1 className="mt-2 font-[Georgia,serif] text-3xl font-bold text-brand-dark">Profile Information</h1>
      {isEditing ? (
        <form
          className="mt-6 grid gap-4 md:grid-cols-3"
          onSubmit={async (event) => {
            event.preventDefault()
            setIsSaving(true)
            setError('')
            const form = new FormData(event.currentTarget)
            try {
              const data = await updateMyProfile(
                { fullName: form.get('fullName'), email: form.get('email'), phone: form.get('phone') },
                auth,
              )
              setProfile(data.user)
              auth.updateCurrentUser(data.user)
              setIsEditing(false)
            } catch (requestError) {
              setError(requestError?.message || 'Profile could not be updated.')
            } finally {
              setIsSaving(false)
            }
          }}
        >
          {[
            ['fullName', 'Full name', profile?.fullName],
            ['email', 'Email address', profile?.email],
            ['phone', 'Mobile number', profile?.phone],
          ].map(([name, label, value]) => (
            <label key={name} className="grid gap-2 text-sm font-bold text-gray-900">
              {label}
              <input name={name} defaultValue={value || ''} required className="min-h-12 rounded-xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-brand" />
            </label>
          ))}
          {error && <p className="text-sm font-semibold text-brand md:col-span-3">{error}</p>}
          <div className="flex gap-3 md:col-span-3">
            <button disabled={isSaving} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-brand">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white p-4">
                <p className="text-xs font-bold uppercase text-brand">{label}</p>
                <p className="mt-2 font-semibold text-brand-dark">{value || 'Not added'}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIsEditing(true)} className="mt-5 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">Edit Profile</button>
        </>
      )}
    </section>
  )
}

const emptyAddress = {
  label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '', landmark: '',
  city: '', district: 'Palakkad', state: 'Kerala', pincode: '', isDefault: false,
}

function AddressesSection({ auth }) {
  const [addresses, setAddresses] = useState([])
  const [status, setStatus] = useState('loading')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...emptyAddress, fullName: auth.user?.fullName || '', phone: auth.user?.phone || '' })
  const [error, setError] = useState('')

  const loadAddresses = useCallback(async () => {
    setStatus('loading')
    try {
      const data = await getMyAddresses(auth)
      setAddresses(data.addresses || [])
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [auth])

  useEffect(() => {
    loadAddresses()
    // Auth credentials are intentionally the trigger for reloading private data.
  }, [auth.accessToken, loadAddresses])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await createMyAddress(form, auth)
      setShowForm(false)
      setForm({ ...emptyAddress, fullName: auth.user?.fullName || '', phone: auth.user?.phone || '' })
      await loadAddresses()
    } catch (requestError) {
      setError(requestError?.message || 'Address could not be saved.')
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-brand">Account Settings</p>
          <h1 className="mt-2 font-[Georgia,serif] text-3xl font-bold text-brand-dark">Manage Addresses</h1>
        </div>
        <button type="button" onClick={() => setShowForm((current) => !current)} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">
          {showForm ? 'Cancel' : 'Add Address'}
        </button>
      </div>
      <div className="mt-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 grid gap-4 rounded-xl border border-gray-200 p-5 md:grid-cols-2">
            {Object.keys(emptyAddress).filter((name) => name !== 'isDefault').map((name) => (
              <label key={name} className="grid gap-1 text-sm font-bold text-gray-900">
                {titleCase(name)}
                <input
                  value={form[name]}
                  required={['fullName', 'phone', 'addressLine1', 'city', 'district', 'state', 'pincode'].includes(name)}
                  onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
                  className="min-h-11 rounded-xl border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-brand"
                />
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={form.isDefault} onChange={(event) => setForm((current) => ({ ...current, isDefault: event.target.checked }))} />
              Make default address
            </label>
            {error && <p className="text-sm font-semibold text-brand md:col-span-2">{error}</p>}
            <button className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white md:col-span-2">Save Address</button>
          </form>
        )}
        {status === 'loading' && <div className="h-32 animate-pulse rounded-xl bg-brand-light" />}
        {status === 'error' && <EmptyState icon="address" title="We could not load your addresses" message="Please check your connection and try again." />}
        {status === 'ready' && addresses.length === 0 && <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-brand">
            <AccountIcon name="address" />
          </div>
          <h2 className="mt-4 font-[Georgia,serif] text-2xl font-bold text-brand-dark">No saved addresses yet.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            Add a delivery address for faster checkout.
          </p>
        </div>}
        {status === 'ready' && addresses.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <article key={address._id} className="rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-brand-dark">{address.label}</p>
                  {address.isDefault && <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand">Default</span>}
                </div>
                <p className="mt-3 text-sm font-semibold">{address.fullName} · {address.phone}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{getAddressSummary(address)}</p>
                <button
                  type="button"
                  className="mt-4 text-sm font-bold text-brand"
                  onClick={async () => {
                    await deleteMyAddress(address._id, auth)
                    await loadAddresses()
                  }}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function OrderStatusBadge({ label }) {
  const isGood = ['Paid', 'Confirmed', 'Delivered'].includes(label)
  const isBad = ['Failed', 'Cancelled'].includes(label)

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
      isBad ? 'bg-brand-light text-brand' : isGood ? 'bg-brand-light text-brand' : 'bg-white text-brand-dark'
    }`}
    >
      {label}
    </span>
  )
}

function OrderCard({ order }) {
  const firstProduct = order.products?.[0]
  const extraCount = Math.max(0, (order.products?.length || 0) - 1)

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[96px_1fr_auto]">
        <div className="overflow-hidden rounded-xl bg-brand-light">
          {firstProduct?.image ? (
            <img src={resolveProductImage(firstProduct.image)} alt={firstProduct.productName} className="h-24 w-full object-contain" />
          ) : (
            <div className="grid h-24 place-items-center text-brand">
              <AccountIcon name="orders" />
            </div>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge label={titleCase(order.paymentStatus)} />
            <OrderStatusBadge label={titleCase(order.orderStatus)} />
          </div>
          <h2 className="mt-3 font-[Georgia,serif] text-xl font-bold text-brand-dark">{firstProduct?.productName || 'Pickle order'}</h2>
          <p className="mt-1 text-sm font-semibold text-gray-600">
            {firstProduct?.variantLabel || 'Selected pack'} · Qty {firstProduct?.quantity || 1}
            {extraCount > 0 ? ` + ${extraCount} more` : ''}
          </p>
          <div className="mt-3 grid gap-1 text-sm text-gray-600">
            <p><span className="font-bold text-gray-900">Order ID:</span> {order.orderId}</p>
            <p><span className="font-bold text-gray-900">Order date:</span> {formatDate(order.createdAt)}</p>
            <p><span className="font-bold text-gray-900">Payment method:</span> {order.paymentMethod || 'Razorpay'}</p>
            <p><span className="font-bold text-gray-900">Delivery:</span> {getAddressSummary(order.shippingAddress)}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:items-end">
          <p className="text-xl font-extrabold text-brand-dark">{formatCurrency(order.totalAmount)}</p>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Link
              to={`/account/orders/${order.orderId}`}
              className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              View Details
            </Link>
            <Link
              to={`/account/orders/${order.orderId}`}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function OrdersSection({ auth }) {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    let active = true
    setStatus('loading')

    getMyOrders({
      accessToken: auth.accessToken,
      refreshSession: auth.refreshSession,
    })
      .then((data) => {
        if (!active) return
        setOrders(data.orders)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [auth.accessToken, auth.refreshSession])

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesFilter = filter === 'All' || getOrderFilterStatus(order.orderStatus) === filter
      const text = [
        order.orderId,
        order.razorpayOrderId,
        order.paymentStatus,
        order.orderStatus,
        ...(order.products || []).map((item) => item.productName),
      ].join(' ').toLowerCase()
      return matchesFilter && (!query || text.includes(query))
    })
  }, [filter, orders, search])

  if (status === 'error') {
    return (
      <EmptyState
        icon="orders"
        title="We could not load your orders"
        message="Please check your connection and try again."
      />
    )
  }

  return (
    <section className="grid gap-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase text-brand">My Orders</p>
        <h1 className="mt-2 font-[Georgia,serif] text-3xl font-bold text-brand-dark">My Orders</h1>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search orders"
            className="min-h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-brand"
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {orderFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand ${
                  filter === item ? 'bg-brand text-white' : 'border border-gray-200 text-brand hover:bg-brand-light'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {status === 'loading' && [1, 2].map((item) => <div key={item} className="h-44 animate-pulse rounded-2xl bg-white" />)}

      {status === 'ready' && orders.length === 0 && (
        <EmptyState
          icon="orders"
          title="You haven't placed any orders yet."
          message="Start exploring our homemade pickles."
          action={
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Browse Pickles
            </Link>
          }
        />
      )}

      {status === 'ready' && orders.length > 0 && filteredOrders.length === 0 && (
        <EmptyState icon="orders" title="No orders match your search" message="Try a different order ID, product name or status." />
      )}

      {status === 'ready' && filteredOrders.map((order) => <OrderCard key={order.orderId} order={order} />)}
    </section>
  )
}

function Timeline({ order }) {
  const status = order.orderStatus
  const steps = ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
  const activeCount = status === 'fulfilled' ? 5 : status === 'shipped' ? 3 : status === 'confirmed' ? 2 : 1

  return (
    <div className="grid gap-3">
      {steps.map((step, index) => {
        const isActive = index < activeCount
        return (
          <div key={step} className="flex gap-3">
            <div className={`mt-1 h-4 w-4 rounded-full border-2 ${isActive ? 'border-brand bg-brand' : 'border-gray-200 bg-white'}`} />
            <div>
              <p className={`font-bold ${isActive ? 'text-brand-dark' : 'text-gray-600'}`}>{step}</p>
              {index === 0 && <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OrderDetailsSection({ auth, orderId }) {
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')

    getMyOrderById(orderId, {
      accessToken: auth.accessToken,
      refreshSession: auth.refreshSession,
    })
      .then((data) => {
        if (!active) return
        setOrder(data)
        setStatus(data ? 'ready' : 'error')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [auth.accessToken, auth.refreshSession, orderId])

  if (status === 'loading') return <div className="h-72 animate-pulse rounded-2xl bg-white" />
  if (status === 'error' || !order) {
    return <EmptyState icon="orders" title="Order not found" message="We could not find this order in your account." />
  }

  return (
    <section className="grid gap-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Link to="/account/orders" className="text-sm font-bold text-brand underline-offset-4 hover:underline">
          Back to My Orders
        </Link>
        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase text-brand">Order Details</p>
            <h1 className="mt-2 font-[Georgia,serif] text-3xl font-bold text-brand-dark">{order.orderId}</h1>
            <p className="mt-2 text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <p className="text-2xl font-extrabold text-brand-dark">{formatCurrency(order.totalAmount)}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-[Georgia,serif] text-2xl font-bold text-brand-dark">Items</h2>
          <div className="mt-5 grid gap-4">
            {(order.products || []).map((item) => (
              <div key={`${item.productName}-${item.variantLabel}`} className="grid gap-4 rounded-xl border border-gray-200 p-4 sm:grid-cols-[80px_1fr_auto]">
                <div className="overflow-hidden rounded-lg bg-brand-light">
                  <img src={resolveProductImage(item.image)} alt={item.productName} className="h-20 w-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-brand-dark">{item.productName}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.variantLabel} · Qty {item.quantity}</p>
                </div>
                <p className="font-extrabold text-brand-dark">{formatCurrency(item.itemTotal)}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="grid gap-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-[Georgia,serif] text-2xl font-bold text-brand-dark">Track Order</h2>
            <div className="mt-5">
              <Timeline order={order} />
            </div>
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-[Georgia,serif] text-2xl font-bold text-brand-dark">Delivery Address</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">{getAddressSummary(order.shippingAddress)}</p>
            <p className="mt-3 text-sm font-semibold text-brand-dark">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.phone}</p>
          </section>
        </aside>
      </div>
    </section>
  )
}

function RecentlyViewedSection() {
  const { activeProducts } = useProductData()
  const recentProducts = useMemo(() => {
    try {
      const slugs = JSON.parse(window.localStorage.getItem(recentlyViewedKey) || '[]')
      return (Array.isArray(slugs) ? slugs : [])
        .map((slug) => activeProducts.find((product) => product.slug === slug))
        .filter(Boolean)
        .slice(0, 6)
    } catch {
      return []
    }
  }, [activeProducts])

  if (recentProducts.length === 0) {
    return <EmptyState icon="recent" title="No recently viewed pickles yet" message="Products you view will appear here for quick access." />
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase text-brand">My Activity</p>
      <h1 className="mt-2 font-[Georgia,serif] text-3xl font-bold text-brand-dark">Recently Viewed</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentProducts.map((product) => (
          <Link key={product.slug} to={`/products/${product.slug}`} className="rounded-xl border border-gray-200 p-4 transition duration-200 hover:bg-white">
            <img src={resolveProductImage(product.image)} alt={product.name} className="h-28 w-full object-contain" />
            <p className="mt-3 font-bold text-brand-dark">{product.name}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function AccountPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId } = useParams()

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    await auth.logout()
    navigate('/', { replace: true })
  }

  const renderContent = () => {
    if (orderId) return <OrderDetailsSection auth={auth} orderId={orderId} />
    if (location.pathname.startsWith('/account/orders')) return <OrdersSection auth={auth} />
    if (location.pathname.startsWith('/account/profile')) return <ProfileSection auth={auth} />
    if (location.pathname.startsWith('/account/addresses')) return <AddressesSection auth={auth} />
    if (location.pathname.startsWith('/account/recently-viewed')) return <RecentlyViewedSection />
    return <OverviewSection user={auth.user} />
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gray-50 py-8 sm:py-10">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <AccountSidebar user={auth.user} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
        <main>{renderContent()}</main>
      </div>
    </section>
  )
}

export default AccountPage
