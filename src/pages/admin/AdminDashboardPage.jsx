import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminErrorState from '../../components/admin/AdminErrorState'
import AdminLoadingState from '../../components/admin/AdminLoadingState'
import { AdminIcon } from '../../components/admin/AdminIcons'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import ProductStatusBadge from '../../components/admin/ProductStatusBadge'
import { useAuth } from '../../context/AuthContext'
import {
  deleteAdminReview,
  getAdminDashboard,
  getAdminReviews,
  updateAdminReviewStatus,
} from '../../services/adminDashboardService'
import { getAdminProducts } from '../../services/adminProductService'
import { getPrimaryProductImage } from '../../utils/productImages'

function formatAdminDate(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function getAttentionIssues(product) {
  const issues = []
  if (!product.isActive) issues.push(['inactive', 'Inactive'])
  if (!product.inStock || product.totalStock === 0) issues.push(['out', 'Out of stock'])
  if (product.variants?.some((variant) => variant.stock > 0 && variant.stock <= 5)) issues.push(['low', 'Low stock'])
  if (!product.image && !product.media?.length) issues.push(['out', 'Missing image'])
  return issues
}

function AdminDashboardPage() {
  const auth = useAuth()
  const [products, setProducts] = useState([])
  const [reviewQueue, setReviewQueue] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [productsResult, dashboardResult, reviewsResult] = await Promise.allSettled([
        getAdminProducts({ limit: 50, sort: 'updated' }, auth),
        getAdminDashboard(auth),
        getAdminReviews({ limit: 20 }, auth),
      ])
      if (productsResult.status === 'rejected') throw productsResult.reason
      setProducts(productsResult.value.products || [])
      setReviewQueue(reviewsResult.status === 'fulfilled' ? reviewsResult.value.reviews || [] : [])
      // Dashboard totals and review moderation are supplementary; product management remains usable if either fails.
      void dashboardResult
    } catch {
      setError('We could not load admin data right now.')
    } finally {
      setIsLoading(false)
    }
  }, [auth])

  useEffect(() => {
    loadProducts()
  }, [loadProducts, retryKey])

  const stats = useMemo(() => {
    const active = products.filter((product) => product.isActive)
    const inactive = products.filter((product) => !product.isActive)
    const outOfStock = products.filter((product) => !product.inStock || product.totalStock === 0)
    const lowStockProducts = products.filter((product) => product.variants?.some((variant) => variant.stock > 0 && variant.stock <= 5))
    return {
      total: products.length,
      active: active.length,
      inactive: inactive.length,
      featured: products.filter((product) => product.featured).length,
      bestseller: products.filter((product) => product.bestseller).length,
      newArrival: products.filter((product) => product.newArrival).length,
      outOfStock: outOfStock.length,
      lowStockProducts: lowStockProducts.length,
    }
  }, [products])

  const attentionProducts = products.filter((product) => getAttentionIssues(product).length > 0)
  const recentProducts = [...products].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)
  const pendingReviewCount = reviewQueue.filter((item) => item.status === 'pending').length
  const reportedReviewCount = reviewQueue.filter((item) => item.status === 'reported').length

  const updateReviewQueue = async (reviewId, nextStatus) => {
    try {
      if (nextStatus === 'deleted') {
        await deleteAdminReview(reviewId, auth)
        setReviewQueue((current) => current.filter((item) => item.id !== reviewId))
        return
      }
      await updateAdminReviewStatus(reviewId, nextStatus, auth)
      setReviewQueue((current) => current.map((item) => (
        item.id === reviewId ? { ...item, status: nextStatus } : item
      )))
    } catch {
      setError('Review moderation could not be completed.')
    }
  }

  if (isLoading) return <AdminLoadingState />
  if (error) return <AdminErrorState message={error} onRetry={() => setRetryKey((current) => current + 1)} />

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Manage your products, pricing and stock."
        action={<Link to="/admin/products/new" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 text-sm font-medium text-white hover:bg-brand-dark">Add Product</Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <AdminStatCard label="Total Products" count={stats.total} icon="products" description="All products in your catalogue" to="/admin/products" />
        <AdminStatCard label="Active Products" count={stats.active} icon="check" description="Visible products" to="/admin/products?status=active" />
        <AdminStatCard label="Out of Stock" count={stats.outOfStock} icon="alert" description="Needs restocking" to="/admin/products?status=out-of-stock" />
        <AdminStatCard label="Low Stock" count={stats.lowStockProducts} icon="alert" description="Five or fewer packs" />
        <AdminStatCard label="Bestsellers" count={stats.bestseller} icon="store" to="/admin/products?badge=bestseller" />
        <AdminStatCard label="New Arrivals" count={stats.newArrival} icon="plus" to="/admin/products?badge=newArrival" />
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900">Product Status</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link to="/admin/products?status=inactive" className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-sm">
            <span className="font-medium text-gray-600">Inactive</span>
            <span className="font-semibold text-gray-900">{stats.inactive}</span>
          </Link>
          <Link to="/admin/products?badge=featured" className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-sm">
            <span className="font-medium text-gray-600">Featured</span>
            <span className="font-semibold text-gray-900">{stats.featured}</span>
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900">Needs Attention</h3>
          {attentionProducts.length === 0 ? (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <p className="font-medium text-gray-900">All products look good</p>
              <p className="mt-1 text-sm text-gray-600">No stock or visibility issues found.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {attentionProducts.slice(0, 6).map((product) => (
                <div key={product._id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <img src={getPrimaryProductImage(product)} alt="" className="h-12 w-12 rounded-lg bg-gray-100 object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {getAttentionIssues(product).map(([type, label]) => <ProductStatusBadge key={label} type={type}>{label}</ProductStatusBadge>)}
                    </div>
                  </div>
                  <Link to={`/admin/products/${product._id}/edit`} className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-brand hover:bg-brand-light">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900">Recently Updated Products</h3>
          <div className="mt-4 grid gap-3">
            {recentProducts.map((product) => (
              <Link key={product._id} to={`/admin/products/${product._id}/edit`} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-100">
                <img src={getPrimaryProductImage(product)} alt="" className="h-12 w-12 rounded-lg bg-gray-100 object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">{product.name}</span>
                  <span className="mt-1 block text-xs text-gray-600">{product.category || 'Product'} - {product.variants?.length || 0} variants</span>
                </span>
                <span className="shrink-0 text-xs font-medium text-gray-600">{formatAdminDate(product.updatedAt)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Review Moderation Queue</h3>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
            <span className="rounded-full bg-brand-light px-3 py-1 text-brand">{pendingReviewCount} pending</span>
            <span className="rounded-full bg-gray-100 px-3 py-1">{reportedReviewCount} reported</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {reviewQueue.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              Review moderation queue is clear.
            </div>
          ) : (
            reviewQueue.map((review) => (
              <div key={review.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{review.customer}</p>
                  <p className="text-xs text-gray-600">{review.product} · {review.rating}★ · {review.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
                    onClick={() => updateReviewQueue(review.id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    onClick={() => updateReviewQueue(review.id, 'rejected')}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                    onClick={() => updateReviewQueue(review.id, 'deleted')}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ['/admin/products/new', 'Add Product', 'plus'],
            ['/admin/products', 'Manage Products', 'products'],
            ['/', 'View Store', 'store'],
          ].map(([to, label, icon]) => (
            <Link key={to} to={to} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand hover:bg-brand-light">
              <AdminIcon name={icon} className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage
