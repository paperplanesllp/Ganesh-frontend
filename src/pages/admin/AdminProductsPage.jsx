import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AdminEmptyState from '../../components/admin/AdminEmptyState'
import AdminErrorState from '../../components/admin/AdminErrorState'
import AdminLoadingState from '../../components/admin/AdminLoadingState'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminPagination from '../../components/admin/AdminPagination'
import AdminTable from '../../components/admin/AdminTable'
import ConfirmationModal from '../../components/admin/ConfirmationModal'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { deactivateAdminProduct, getAdminProducts, updateAdminProductStatus } from '../../services/adminProductService'
import { categoryOptions } from '../../utils/adminProductFormHelpers'

const sortOptions = [
  ['updated', 'Recently updated'],
  ['name-asc', 'Name A-Z'],
  ['name-desc', 'Name Z-A'],
  ['price-asc', 'Price low to high'],
  ['price-desc', 'Price high to low'],
  ['stock-asc', 'Stock low to high'],
]

function AdminProductsPage() {
  const { showToast } = useCart()
  const auth = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const headingRef = useRef(null)
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingProductId, setSavingProductId] = useState('')
  const [confirmProduct, setConfirmProduct] = useState(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const filters = {
    page: Number(searchParams.get('page') || 1),
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || '',
    badge: searchParams.get('badge') || '',
    sort: searchParams.get('sort') || 'updated',
  }

  const requestParams = useMemo(() => {
    const params = { page: filters.page, limit: 20, search: filters.search, status: filters.status, category: filters.category, sort: filters.sort }
    if (filters.badge === 'featured') params.featured = true
    if (filters.badge === 'bestseller') params.bestseller = true
    if (filters.badge === 'newArrival') params.newArrival = true
    return params
  }, [filters.badge, filters.category, filters.page, filters.search, filters.sort, filters.status])

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getAdminProducts(requestParams, auth)
      setProducts(data.products || [])
      setPagination(data.pagination)
    } catch {
      setError('We could not load admin products right now.')
    } finally {
      setIsLoading(false)
    }
  }, [auth, requestParams])

  useEffect(() => {
    loadProducts()
  }, [loadProducts, retryKey])

  const updateParam = (name, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    if (name !== 'page') next.set('page', '1')
    setSearchParams(next)
  }

  const clearFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.category || filters.badge || filters.sort !== 'updated')

  const handlePageChange = (page) => {
    updateParam('page', String(page))
    window.setTimeout(() => headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const handleToggleStatus = async (product, payload) => {
    setSavingProductId(product._id)
    const previousProducts = products
    setProducts((current) => current.map((item) => item._id === product._id ? { ...item, ...payload } : item))
    try {
      const data = await updateAdminProductStatus(product._id, payload, auth)
      setProducts((current) => current.map((item) => item._id === product._id ? data.product : item))
      showToast('Product status updated', 'success')
    } catch {
      setProducts(previousProducts)
      showToast('Product status could not be updated.', 'error')
    } finally {
      setSavingProductId('')
    }
  }

  const confirmDeactivate = async () => {
    if (!confirmProduct) return
    setIsConfirming(true)
    try {
      await deactivateAdminProduct(confirmProduct._id, auth)
      showToast('Product deactivated', 'success')
      setConfirmProduct(null)
      setRetryKey((current) => current + 1)
    } catch {
      showToast('Product could not be deactivated.', 'error')
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div ref={headingRef}>
      <AdminPageHeader
        title="Products"
        description="Manage product details, prices and stock."
        action={
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <Link to="/admin/products/new" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 text-sm font-medium text-white hover:bg-brand-dark">Add Product</Link>
          </div>
        }
      />
      <div className="mb-5 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 lg:grid-cols-[1fr_150px_160px_180px_auto]">
        <label className="grid gap-1 text-xs font-medium text-gray-600">
          Search products
          <input value={filters.search} placeholder="Search products or SKU" className="min-h-11 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" onChange={(event) => updateParam('search', event.target.value)} />
        </label>
        <label className="grid gap-1 text-xs font-medium text-gray-600">
          Status
          <select value={filters.status} className="min-h-11 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" onChange={(event) => updateParam('status', event.target.value)}>
            <option value="">All products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="in-stock">In stock</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-gray-600">
          Category
          <input value={filters.category} placeholder="Category" list="admin-category-filter-options" className="min-h-11 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" onChange={(event) => updateParam('category', event.target.value)} />
          <datalist id="admin-category-filter-options">
            {categoryOptions.map((category) => <option key={category} value={category} />)}
          </datalist>
        </label>
        <label className="grid gap-1 text-xs font-medium text-gray-600">
          Sort
          <select value={filters.sort} className="min-h-11 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" onChange={(event) => updateParam('sort', event.target.value)}>
            {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button type="button" className="min-h-11 self-end rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50" disabled={!hasActiveFilters} onClick={clearFilters}>
          Clear filters
        </button>
        {filters.badge && (
          <div className="lg:col-span-5">
            <button type="button" className="rounded-full bg-brand-light px-3 py-1.5 text-xs font-medium text-brand-dark" onClick={() => updateParam('badge', '')}>
              Showing {filters.badge === 'newArrival' ? 'new arrivals' : filters.badge} - clear
            </button>
          </div>
        )}
      </div>
      {isLoading && <AdminLoadingState message="Loading products..." />}
      {!isLoading && error && <AdminErrorState message={error} onRetry={() => setRetryKey((current) => current + 1)} />}
      {!isLoading && !error && products.length === 0 && (
        <AdminEmptyState
          title={hasActiveFilters ? 'No matching products' : 'No products yet'}
          message={hasActiveFilters ? 'Try changing your search or filters.' : 'Add your first product to start building the catalogue.'}
          action={hasActiveFilters ? (
            <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 text-sm font-medium text-white" onClick={clearFilters}>Reset Filters</button>
          ) : (
            <Link to="/admin/products/new" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 text-sm font-medium text-white">Add Product</Link>
          )}
        />
      )}
      {!isLoading && !error && products.length > 0 && (
        <>
          <AdminTable products={products} savingProductId={savingProductId} onToggleStatus={handleToggleStatus} onDeactivate={setConfirmProduct} />
          <AdminPagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
      <ConfirmationModal
        isOpen={Boolean(confirmProduct)}
        title="Deactivate this product?"
        message="This product will no longer appear in the store. You can activate it again later."
        confirmLabel="Deactivate Product"
        danger
        isSubmitting={isConfirming}
        onCancel={() => setConfirmProduct(null)}
        onConfirm={confirmDeactivate}
      />
    </div>
  )
}

export default AdminProductsPage
