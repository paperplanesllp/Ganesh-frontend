import {
  filterProducts,
  getCheapestActiveInStockVariant,
  getCurrentProducts,
  normalizeProduct,
  paginateProducts,
  resetMockProducts,
  saveMockProducts,
} from '../utils/localProductCatalog'
import { createSlugPreview } from '../utils/adminProductFormHelpers'

function getAllProducts() {
  return getCurrentProducts()
}

function createPreviewId(prefix = 'mock-product') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${getAllProducts().length + 1}`
}

function ensureProductShape(product) {
  const normalized = normalizeProduct(product)
  if (!normalized) throw new Error('Product data is incomplete.')
  const now = new Date().toISOString()
  const shaped = normalizeProduct({
    ...normalized,
    _id: normalized._id || normalized.id || createPreviewId(),
    id: normalized.id || normalized._id || createPreviewId(),
    slug: normalized.slug || createSlugPreview(normalized.name),
    createdAt: normalized.createdAt || now,
    updatedAt: now,
    variants: (normalized.variants || []).map((variant, index) => {
      const variantId = variant._id || variant.id || createPreviewId(`mock-variant-${index + 1}`)
      return {
        ...variant,
        _id: variantId,
        id: variantId,
        isActive: variant.isActive !== false,
      }
    }),
  })
  if (!shaped) throw new Error('Product data is incomplete.')
  return shaped
}

function sortAdminProducts(products, sort = 'newest') {
  const price = (product) => getCheapestActiveInStockVariant(product)?.price || 0
  return [...products].sort((a, b) => {
    if (sort === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt)
    if (sort === 'name-asc') return String(a.name).localeCompare(String(b.name))
    if (sort === 'name-desc') return String(b.name).localeCompare(String(a.name))
    if (sort === 'price-asc') return price(a) - price(b)
    if (sort === 'price-desc') return price(b) - price(a)
    if (sort === 'stock-asc') return Number(a.totalStock || 0) - Number(b.totalStock || 0)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

function matchesStatus(product, status) {
  if (!status) return true
  if (status === 'active') return product.isActive
  if (status === 'inactive') return !product.isActive
  if (status === 'in-stock') return product.inStock
  if (status === 'low-stock') return product.variants?.some((variant) => variant.stock > 0 && variant.stock <= 5)
  if (status === 'out-of-stock') return !product.inStock || product.totalStock === 0
  return true
}

function filterAdminProducts(products, params) {
  const badge = params.featured ? 'featured' : params.bestseller ? 'bestseller' : params.newArrival ? 'newArrival' : ''
  return filterProducts(products, {
    search: params.search || '',
    category: params.category || '',
    badge,
  }).filter((product) => matchesStatus(product, params.status || ''))
}

export async function getMockAdminProducts(params = {}) {
  const filtered = filterAdminProducts(getAllProducts(), params)
  const sorted = sortAdminProducts(filtered, params.sort || 'newest')
  const { products, pagination } = paginateProducts(sorted, params.page || 1, params.limit || 20)
  return { success: true, products, pagination }
}

export async function getMockAdminProductById(id) {
  const product = getAllProducts().find((item) => item._id === id || item.id === id)
  if (!product) {
    const error = new Error('Product was not found in the local admin preview store.')
    error.status = 404
    throw error
  }
  return { success: true, product }
}

export async function createMockAdminProduct(payload) {
  const products = getAllProducts()
  const product = ensureProductShape({
    ...payload,
    _id: createPreviewId(),
    id: createPreviewId('local-product'),
    slug: payload.slug || createSlugPreview(payload.name),
    rating: 0,
    reviewCount: 0,
  })
  saveMockProducts([product, ...products])
  return { success: true, product }
}

export async function updateMockAdminProduct(id, payload) {
  const products = getAllProducts()
  const existing = products.find((product) => product._id === id || product.id === id)
  if (!existing) {
    const error = new Error('Product was not found in the local admin preview store.')
    error.status = 404
    throw error
  }

  const product = ensureProductShape({
    ...existing,
    ...payload,
    _id: existing._id,
    id: existing.id,
    slug: payload.slug || existing.slug,
    rating: existing.rating,
    reviewCount: existing.reviewCount,
    createdAt: existing.createdAt,
  })

  saveMockProducts(products.map((item) => (item._id === id || item.id === id ? product : item)))
  return { success: true, product }
}

export async function updateMockAdminProductStatus(id, payload) {
  return updateMockAdminProduct(id, payload)
}

export async function deactivateMockAdminProduct(id) {
  return updateMockAdminProduct(id, { isActive: false })
}

export async function resetMockAdminProducts() {
  const products = resetMockProducts()
  return { success: true, products }
}
