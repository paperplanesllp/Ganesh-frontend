import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import ProductForm from '../../components/admin/ProductForm'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createAdminProduct } from '../../services/adminProductService'

function AdminCreateProductPage() {
  const { showToast } = useCart()
  const navigate = useNavigate()
  const auth = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const data = await createAdminProduct(payload, auth)
      showToast('Product created', 'success')
      navigate('/admin/products', { replace: true, state: { createdProductId: data.product?._id } })
      return data.product
    } catch (error) {
      setSubmitError(error?.message || 'Product could not be created.')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <AdminPageHeader title="Add Product" description="Create a product with images, prices and stock." />
      <ProductForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate('/admin/products')} isSubmitting={isSubmitting} submitError={submitError} submitLabel="Save Product" />
    </div>
  )
}

export default AdminCreateProductPage
