// Backend integration point: admin pages currently use adminMockProductService and localStorage preview data.
import { authenticatedApiRequest } from './api'

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

function normalizeProduct(product) {
  if (!product) return product

  return {
    ...product,
    id: product._id || product.id,
    variants: (product.variants || []).map((variant) => ({
      ...variant,
      id: variant._id || variant.id,
    })),
  }
}

function normalizeList(data) {
  return {
    ...data,
    products: (data?.products || []).map(normalizeProduct),
  }
}

function toProductFormData(payload) {
  const { imageFiles = [], uploadMetadata = [], ...product } = payload
  const formData = new FormData()
  formData.append('product', JSON.stringify({ ...product, uploadMetadata }))
  imageFiles.forEach((file) => formData.append('images', file))
  return formData
}

export async function getAdminProducts(params = {}, auth = {}, options = {}) {
  const data = await authenticatedApiRequest(`/products/admin/all${buildQuery(params)}`, options, auth)
  return normalizeList(data)
}

export async function getAdminProductById(id, auth = {}, options = {}) {
  const data = await authenticatedApiRequest(`/products/admin/${encodeURIComponent(id)}`, options, auth)
  return {
    ...data,
    product: normalizeProduct(data.product),
  }
}

export async function createAdminProduct(payload, auth = {}) {
  const data = await authenticatedApiRequest(
    '/products',
    {
      method: 'POST',
      body: toProductFormData(payload),
    },
    auth,
  )
  return {
    ...data,
    product: normalizeProduct(data.product),
  }
}

export async function updateAdminProduct(id, payload, auth = {}) {
  const data = await authenticatedApiRequest(
    `/products/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: toProductFormData(payload),
    },
    auth,
  )
  return {
    ...data,
    product: normalizeProduct(data.product),
  }
}

export async function updateAdminProductStatus(id, payload, auth = {}) {
  const data = await authenticatedApiRequest(
    `/products/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: payload,
    },
    auth,
  )
  return {
    ...data,
    product: normalizeProduct(data.product),
  }
}

export async function deactivateAdminProduct(id, auth = {}) {
  return authenticatedApiRequest(
    `/products/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    },
    auth,
  )
}
