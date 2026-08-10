import { products as seedProducts } from '../data/products'

// Versioned so browsers do not restore the removed demo catalog from local storage.
export const ADMIN_MOCK_PRODUCTS_STORAGE_KEY = 'ganesh_pickles_admin_products_v3'
export const PRODUCT_STORE_UPDATED_EVENT = 'ganesh-pickles-product-store-updated'

const NOW_ISO = new Date().toISOString()
const LEGACY_PLACEHOLDER_IMAGE = '/images/products/mango-pickle.jpg'

function getId(value) {
  return value?._id || value?.id || ''
}

export function getProductId(product) {
  return getId(product)
}

export function getVariantId(variant) {
  return getId(variant) || variant?.sku || ''
}

function hasBrowserStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function isValidProductEntry(product) {
  return (
    product &&
    typeof product === 'object' &&
    typeof product.name === 'string' &&
    product.name.trim() &&
    typeof product.slug === 'string' &&
    product.slug.trim() &&
    Array.isArray(product.variants) &&
    product.variants.length > 0
  )
}

export function normalizeProduct(product) {
  if (!isValidProductEntry(product)) return null
  const productId = getProductId(product) || product.slug
  const variants = (product?.variants || []).map((variant, index) => {
    const variantId = getVariantId(variant) || `${productId || 'product'}-variant-${index + 1}`
    return {
      ...variant,
      id: variant.id || variantId,
      _id: variant._id || variantId,
      isActive: variant.isActive !== false,
      price: Number(variant.price) || 0,
      originalPrice: variant.originalPrice === undefined || variant.originalPrice === null ? undefined : Number(variant.originalPrice),
      stock: Math.max(0, Number.parseInt(variant.stock || 0, 10) || 0),
    }
  })
  const totalStock = variants
    .filter((variant) => variant.isActive !== false)
    .reduce((total, variant) => total + variant.stock, 0)

  const normalized = {
    ...product,
    delivery: {
      type: product?.delivery?.type === 'fixed' ? 'fixed' : 'free',
      charge: product?.delivery?.type === 'fixed'
        ? Math.max(0, Number(product?.delivery?.charge) || 0)
        : 0,
    },
    id: product?.id || productId,
    _id: product?._id || productId,
    flavour: product?.flavour || product?.tags?.[2] || product?.category || '',
    isActive: product?.isActive !== false,
    inStock: product?.inStock !== false && totalStock > 0,
    totalStock,
    startingPrice: getCheapestActiveInStockVariant({ ...product, variants })?.price || 0,
    bestseller: Boolean(product?.bestseller),
    newArrival: Boolean(product?.newArrival),
    createdAt: product?.createdAt || NOW_ISO,
    updatedAt: product?.updatedAt || NOW_ISO,
    variants,
  }

  return variants.length > 0 ? normalized : null
}

export function getSeedProducts() {
  return seedProducts.map(normalizeProduct).filter(Boolean)
}

export function readStoredMockProducts() {
  if (!hasBrowserStorage()) return []

  try {
    const parsed = JSON.parse(window.localStorage.getItem(ADMIN_MOCK_PRODUCTS_STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) {
      window.localStorage.removeItem(ADMIN_MOCK_PRODUCTS_STORAGE_KEY)
      return []
    }

    const normalizedProducts = parsed.map(normalizeProduct).filter(Boolean)
    if (normalizedProducts.length !== parsed.length) {
      if (normalizedProducts.length > 0) {
        window.localStorage.setItem(ADMIN_MOCK_PRODUCTS_STORAGE_KEY, JSON.stringify(normalizedProducts))
      } else {
        window.localStorage.removeItem(ADMIN_MOCK_PRODUCTS_STORAGE_KEY)
      }
    }

    return normalizedProducts
  } catch {
    window.localStorage.removeItem(ADMIN_MOCK_PRODUCTS_STORAGE_KEY)
    return []
  }
}

export function getCurrentProducts() {
  const storedProducts = readStoredMockProducts()
  if (storedProducts.length === 0) return getSeedProducts()

  const seedProductsById = new Map(getSeedProducts().map((product) => [getProductId(product), product]))

  return storedProducts.map((product) => {
    const seedProduct = seedProductsById.get(getProductId(product))
    let correctedProduct =
      product.slug === 'vathakuzhambu-mix' && product.category === 'Powders'
        ? { ...product, category: 'Pickles' }
        : product

    if (correctedProduct.slug === 'idly-powder' && correctedProduct.image === '/images/idily.png') {
      correctedProduct = {
        ...correctedProduct,
        image: '/images/id.png',
        images: ['/images/id.png'],
        media: (correctedProduct.media || []).map((item) =>
          item.url === '/images/idily.png' ? { ...item, url: '/images/id.png' } : item,
        ),
      }
    }
    const usesLegacyPlaceholder = !correctedProduct.image || correctedProduct.image === LEGACY_PLACEHOLDER_IMAGE

    if (!seedProduct || !usesLegacyPlaceholder || seedProduct.image === LEGACY_PLACEHOLDER_IMAGE) {
      return correctedProduct
    }

    return {
      ...correctedProduct,
      image: seedProduct.image,
      images: seedProduct.images,
    }
  })
}

export function notifyProductStoreUpdated() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(PRODUCT_STORE_UPDATED_EVENT))
}

export function saveMockProducts(products) {
  const normalizedProducts = (Array.isArray(products) ? products : []).map(normalizeProduct).filter(Boolean)
  if (!hasBrowserStorage()) return normalizedProducts

  window.localStorage.setItem(ADMIN_MOCK_PRODUCTS_STORAGE_KEY, JSON.stringify(normalizedProducts))
  notifyProductStoreUpdated()
  return normalizedProducts
}

export function resetMockProducts() {
  if (hasBrowserStorage()) {
    window.localStorage.removeItem(ADMIN_MOCK_PRODUCTS_STORAGE_KEY)
  }
  notifyProductStoreUpdated()
  return getSeedProducts()
}

export function getCheapestActiveInStockVariant(product) {
  const variants = (product?.variants || [])
    .filter((variant) => variant.isActive !== false && Number(variant.stock) > 0 && Number(variant.price) > 0)
    .sort((a, b) => Number(a.price) - Number(b.price))

  return variants[0] || null
}

export function getCatalogFacets(products) {
  const facet = (field) =>
    [...new Set(products.map((product) => product[field]).filter(Boolean))]
      .sort((a, b) => String(a).localeCompare(String(b)))

  return {
    categories: facet('category'),
    flavours: facet('flavour'),
    spiceLevels: facet('spiceLevel'),
  }
}

export function productMatchesSearch(product, searchTerm) {
  const query = String(searchTerm || '').trim().toLowerCase()
  if (!query) return true

  const searchableText = [
    product.name,
    product.shortDescription,
    product.category,
    product.flavour,
    product.spiceLevel,
    ...(product.ingredients || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchableText.includes(query)
}

export function filterProducts(products, filters = {}) {
  const {
    search = '',
    category = '',
    flavour = '',
    spiceLevel = '',
    availability = '',
    badge = '',
    minPrice = '',
    maxPrice = '',
  } = filters

  const min = minPrice === '' ? null : Number(minPrice)
  const max = maxPrice === '' ? null : Number(maxPrice)

  return products.filter((product) => {
    if (!productMatchesSearch(product, search)) return false
    if (category && product.category !== category) return false
    if (flavour && product.flavour !== flavour) return false
    if (spiceLevel && product.spiceLevel !== spiceLevel) return false
    if (availability === 'in-stock' && !product.inStock) return false
    if (availability === 'out-of-stock' && product.inStock) return false
    if (badge === 'featured' && !product.featured) return false
    if (badge === 'bestseller' && !product.bestseller) return false
    if (badge === 'newArrival' && !product.newArrival) return false

    const price = getCheapestActiveInStockVariant(product)?.price || 0
    if (min !== null && Number.isFinite(min) && price < min) return false
    if (max !== null && Number.isFinite(max) && price > max) return false

    return true
  })
}

export function sortProducts(products, sortBy = 'featured') {
  const value = sortBy || 'featured'
  const byPrice = (product) => getCheapestActiveInStockVariant(product)?.price || Number.POSITIVE_INFINITY
  const sorted = [...products]

  sorted.sort((a, b) => {
    if (value === 'featured') return Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating
    if (value === 'popularity') return Number(b.reviewCount || 0) - Number(a.reviewCount || 0)
    if (value === 'price-asc') return byPrice(a) - byPrice(b)
    if (value === 'price-desc') return byPrice(b) - byPrice(a)
    if (value === 'rating') return Number(b.rating || 0) - Number(a.rating || 0)
    if (value === 'name-asc') return String(a.name).localeCompare(String(b.name))
    if (value === 'name-desc') return String(b.name).localeCompare(String(a.name))
    if (value === 'newest') return Number(b.newArrival) - Number(a.newArrival) || new Date(b.createdAt) - new Date(a.createdAt)
    return 0
  })

  return sorted
}

export function paginateProducts(products, page = 1, limit = 12) {
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)
  const pageSize = Math.max(1, Number.parseInt(limit, 10) || 12)
  const totalProducts = products.length
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * pageSize

  return {
    products: products.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      limit: pageSize,
      totalProducts,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  }
}
