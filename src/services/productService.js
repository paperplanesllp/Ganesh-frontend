// Backend integration point: product pages currently use src/data/products.js instead of these API helpers.
import { apiRequest } from './api'

const MOCK_PRODUCTS_ENABLED = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_PRODUCTS === 'true'

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

function buildEndpoint(path, queryInput = '') {
  if (!queryInput) return path

  if (typeof queryInput === 'string') {
    const query = queryInput.startsWith('?') ? queryInput.slice(1) : queryInput
    return query ? `${path}?${query}` : path
  }

  return `${path}${buildQuery(queryInput)}`
}

function normalizeRequestOptions(signalOrOptions) {
  if (!signalOrOptions) return {}
  if (typeof AbortSignal !== 'undefined' && signalOrOptions instanceof AbortSignal) {
    return { signal: signalOrOptions }
  }
  return signalOrOptions
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

function normalizeProductList(data) {
  return {
    ...data,
    products: (data?.products || []).map(normalizeProduct),
  }
}

async function requestProducts(endpoint, options = {}) {
  try {
    const data = await apiRequest(endpoint, options)
    if (!data?.success) throw new Error('Unexpected product response.')
    return data
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    if (MOCK_PRODUCTS_ENABLED) throw error
    throw error
  }
}

export async function getProducts(queryString = '', signal) {
  const data = await requestProducts(buildEndpoint('/products', queryString), normalizeRequestOptions(signal))
  return normalizeProductList(data)
}

export async function getCategoryVisibility(options = {}) {
  const data = await requestProducts('/products/categories', options)
  return data.categories || []
}

export async function getFeaturedProducts(params = {}, options = {}) {
  const data = await requestProducts(`/products/featured${buildQuery(params)}`, options)
  return normalizeProductList(data)
}

export async function getBestsellers(params = {}, options = {}) {
  const data = await requestProducts(`/products/bestsellers${buildQuery(params)}`, options)
  return normalizeProductList(data)
}

export async function getNewArrivals(params = {}, options = {}) {
  const data = await requestProducts(`/products/new-arrivals${buildQuery(params)}`, options)
  return normalizeProductList(data)
}

export async function getProductBySlug(slug, options = {}) {
  const data = await requestProducts(`/products/slug/${encodeURIComponent(slug)}`, options)
  return {
    ...data,
    product: normalizeProduct(data.product),
  }
}

export async function getProductById(id, options = {}) {
  const data = await requestProducts(`/products/${encodeURIComponent(id)}`, options)
  return {
    ...data,
    product: normalizeProduct(data.product),
  }
}
