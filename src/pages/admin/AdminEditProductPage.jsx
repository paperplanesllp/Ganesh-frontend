import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminErrorState from '../../components/admin/AdminErrorState'
import AdminLoadingState from '../../components/admin/AdminLoadingState'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import ProductForm from '../../components/admin/ProductForm'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { getAdminProductById, updateAdminProduct } from '../../services/adminProductService'
import { mapProductToFormState } from '../../utils/adminProductFormHelpers'

function formatAdminDate(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function AdminEditProductPage() {
  const { id } = useParams()
  const { showToast } = useCart()
  const navigate = useNavigate()
  const auth = useAuth()
  const [formState, setFormState] = useState(null)
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const loadProduct = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getAdminProductById(id, auth)
      setProduct(data.product)
      setFormState(mapProductToFormState(data.product))
    } catch (requestError) {
      if (requestError?.status === 404) setError('Product was not found.')
      else setError('We could not load this product for editing.')
    } finally {
      setIsLoading(false)
    }
  }, [auth, id])

  useEffect(() => {
    loadProduct()
  }, [loadProduct, retryKey])

  const handleSubmit = async (payload, returnAfterSave) => {
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const data = await updateAdminProduct(id, payload, auth)
      setProduct(data.product)
      setFormState(mapProductToFormState(data.product))
      showToast('Product updated', 'success')
      if (returnAfterSave) navigate('/admin/products')
      return data.product
    } catch (requestError) {
      setSubmitError(requestError?.message || 'Product could not be updated.')
      throw requestError
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <AdminLoadingState message="Loading product..." />
  if (error) return <AdminErrorState title="Product could not load" message={error} onRetry={() => setRetryKey((current) => current + 1)} />

  return (
    <div>
      <AdminPageHeader
        title="Edit Product"
        description={product ? `${product.name} - updated ${formatAdminDate(product.updatedAt)}` : ''}
        action={product?.slug && <Link to={`/products/${product.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-200 px-5 text-sm font-medium text-brand hover:bg-brand-light">View Store</Link>}
      />
      {formState && (
        <ProductForm
          key={product?._id}
          mode="edit"
          initialState={formState}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/products')}
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitLabel="Save Changes"
        />
      )}
    </div>
  )
}

export default AdminEditProductPage
