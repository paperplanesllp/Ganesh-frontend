import { useCallback, useEffect, useState } from 'react'
import AdminEmptyState from '../../components/admin/AdminEmptyState'
import AdminErrorState from '../../components/admin/AdminErrorState'
import AdminLoadingState from '../../components/admin/AdminLoadingState'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminPagination from '../../components/admin/AdminPagination'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getAdminOrders, updateAdminOrderStatus } from '../../services/adminOrderService'
import { formatCurrency } from '../../utils/currency'

const orderStatuses = ['pending', 'confirmed', 'fulfilled', 'cancelled']

function formatDate(value) {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function titleCase(value) {
  return String(value || '').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function badgeClass(status) {
  if (status === 'paid' || status === 'fulfilled') return 'bg-green-100 text-green-800'
  if (status === 'failed' || status === 'cancelled') return 'bg-red-100 text-red-800'
  if (status === 'confirmed') return 'bg-blue-100 text-blue-800'
  return 'bg-amber-100 text-amber-800'
}

function Address({ address }) {
  const lines = [address?.addressLine1, address?.addressLine2, address?.landmark, address?.city, address?.district, address?.state, address?.pincode].filter(Boolean)
  return <p className="mt-2 text-sm leading-6 text-gray-700">{lines.join(', ') || 'Address not available'}</p>
}

function AdminOrderCard({ order, savingId, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const shortId = order.id?.slice(-8).toUpperCase()

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button type="button" className="grid w-full gap-4 p-5 text-left hover:bg-gray-50 md:grid-cols-[1fr_1fr_auto_auto] md:items-center" onClick={() => setIsOpen((value) => !value)}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Order #{shortId}</p>
          <p className="mt-1 font-bold text-gray-900">{order.customerName}</p>
          <p className="mt-1 text-xs text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-sm text-gray-600">
          <p>{order.email}</p>
          <p className="mt-1">{order.phone}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(order.paymentStatus)}`}>Payment: {titleCase(order.paymentStatus)}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(order.orderStatus)}`}>{titleCase(order.orderStatus)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 md:block md:text-right">
          <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
          <p className="mt-1 text-xs font-bold text-brand">{isOpen ? 'Hide details' : 'View details'}</p>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 bg-gray-50 p-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-bold text-gray-900">Customer details</h3>
              <dl className="mt-3 grid gap-2 text-sm">
                <div><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-900">{order.customerName}</dd></div>
                <div><dt className="text-gray-500">Email</dt><dd className="font-medium text-gray-900">{order.email}</dd></div>
                <div><dt className="text-gray-500">Phone</dt><dd className="font-medium text-gray-900">{order.phone}</dd></div>
              </dl>
            </section>
            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-bold text-gray-900">Delivery address</h3>
              <Address address={order.shippingAddress} />
              {order.notes && <p className="mt-3 rounded-lg bg-gray-100 p-3 text-sm text-gray-700"><strong>Note:</strong> {order.notes}</p>}
            </section>
            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-bold text-gray-900">Payment information</h3>
              <dl className="mt-3 grid gap-2 text-sm">
                <div><dt className="text-gray-500">Status</dt><dd className="font-bold text-gray-900">{titleCase(order.paymentStatus)}</dd></div>
                <div><dt className="text-gray-500">Razorpay order ID</dt><dd className="break-all font-medium text-gray-900">{order.razorpayOrderId || 'Not available'}</dd></div>
                <div><dt className="text-gray-500">Payment ID</dt><dd className="break-all font-medium text-gray-900">{order.razorpayPaymentId || 'Not available'}</dd></div>
                {order.paidAt && <div><dt className="text-gray-500">Paid at</dt><dd className="font-medium text-gray-900">{formatDate(order.paidAt)}</dd></div>}
                {order.failureReason && <div><dt className="text-gray-500">Failure reason</dt><dd className="font-medium text-red-700">{order.failureReason}</dd></div>}
              </dl>
            </section>
          </div>

          <section className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-bold text-gray-900">Ordered products</h3>
            <div className="mt-3 grid gap-3">
              {(order.products || []).map((item, index) => (
                <div key={`${item.product}-${item.variantId}-${index}`} className="grid gap-2 rounded-lg bg-gray-50 p-3 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div><p className="font-bold text-gray-900">{item.productName}</p><p className="text-gray-600">{item.variantLabel} · {item.grams ? `${item.grams} g · ` : ''}Qty {item.quantity}</p></div>
                  <p className="text-gray-600">{formatCurrency(item.itemPrice)} each</p>
                  <p className="font-bold text-gray-900">{formatCurrency(item.itemTotal)}</p>
                </div>
              ))}
            </div>
            <div className="ml-auto mt-4 grid max-w-sm gap-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><strong>{formatCurrency(order.subtotal)}</strong></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><strong>{formatCurrency(order.deliveryCharge)}</strong></div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base"><span className="font-bold">Total</span><strong className="text-brand">{formatCurrency(order.totalAmount)}</strong></div>
            </div>
          </section>

          <section className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <label className="grid gap-2 text-sm font-bold text-gray-900">
              Update order status
              <select value={order.orderStatus} disabled={savingId === order.id} className="min-h-11 rounded-lg border border-gray-200 bg-white px-3 font-medium" onChange={(event) => onStatusChange(order.id, event.target.value)}>
                {orderStatuses.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
              </select>
            </label>
            {savingId === order.id && <p className="pb-3 text-sm text-gray-600">Saving status…</p>}
            <p className="ml-auto pb-3 text-xs text-gray-500">Last updated: {formatDate(order.updatedAt)}</p>
          </section>
        </div>
      )}
    </article>
  )
}

function AdminOrdersPage() {
  const auth = useAuth()
  const { showToast } = useCart()
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getAdminOrders({ page, limit: 20, status }, auth)
      setOrders(data.orders || [])
      setPagination(data.pagination)
    } catch (requestError) {
      setError(requestError?.message || 'Orders could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }, [auth, page, status])

  useEffect(() => { loadOrders() }, [loadOrders])

  const changeStatus = async (orderId, nextStatus) => {
    setSavingId(orderId)
    try {
      const data = await updateAdminOrderStatus(orderId, nextStatus, auth)
      setOrders((current) => current.map((order) => order.id === orderId ? data.order : order))
      showToast('Order status updated', 'success')
    } catch {
      showToast('Order status could not be updated.', 'error')
    } finally {
      setSavingId('')
    }
  }

  return (
    <div>
      <AdminPageHeader title="Orders" description="View customer orders, delivery details, payments and fulfilment status." />
      <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <label className="grid gap-1 text-xs font-bold text-gray-600">Order status
          <select value={status} className="min-h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900" onChange={(event) => { setStatus(event.target.value); setPage(1) }}>
            <option value="">All orders</option>
            {orderStatuses.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
          </select>
        </label>
        {pagination && <p className="pb-3 text-sm text-gray-600">{pagination.total} total order{pagination.total === 1 ? '' : 's'}</p>}
      </div>
      {isLoading && <AdminLoadingState message="Loading orders..." />}
      {!isLoading && error && <AdminErrorState message={error} onRetry={loadOrders} />}
      {!isLoading && !error && orders.length === 0 && <AdminEmptyState title="No orders yet" message="New customer orders will automatically appear here after checkout." />}
      {!isLoading && !error && orders.length > 0 && <div className="grid gap-4">{orders.map((order) => <AdminOrderCard key={order.id} order={order} savingId={savingId} onStatusChange={changeStatus} />)}<AdminPagination pagination={pagination} onPageChange={setPage} itemLabel="orders" /></div>}
    </div>
  )
}

export default AdminOrdersPage
