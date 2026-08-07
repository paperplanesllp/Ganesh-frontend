export const PRODUCT_IMAGE_FALLBACK = '/images/products/mango-pickle.jpg'

function isString(value) {
  return typeof value === 'string'
}

export function resolveProductImage(src) {
  const value = isString(src) ? src.trim() : src?.url?.trim?.() || ''
  if (!value) return PRODUCT_IMAGE_FALLBACK

  if (value.startsWith('https://') || value.startsWith('http://')) return value
  if (value.startsWith('/images/')) return value
  if (value.startsWith('/')) return value

  return `/${value}`
}

export function normalizeProductMedia(productOrMedia) {
  const media = Array.isArray(productOrMedia) ? productOrMedia : productOrMedia?.media
  if (Array.isArray(media) && media.length > 0) {
    return media
      .map((item, index) => ({
        url: item?.url || '',
        publicId: item?.publicId || '',
        alt: item?.alt || '',
        isPrimary: item?.isPrimary === true,
        sortOrder: Number.isFinite(Number(item?.sortOrder)) ? Number(item.sortOrder) : index,
      }))
      .filter((item) => item.url)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item, index, values) => ({
        ...item,
        sortOrder: index,
        isPrimary: values.some((candidate) => candidate.isPrimary) ? item.isPrimary : index === 0,
      }))
  }

  const product = Array.isArray(productOrMedia) ? {} : productOrMedia || {}
  const urls = [product.image, ...(product.images || [])]
    .filter(Boolean)
    .filter((url, index, values) => values.indexOf(url) === index)

  return urls.map((url, index) => ({
    url,
    publicId: '',
    alt: product.name || '',
    isPrimary: index === 0,
    sortOrder: index,
  }))
}

export function getPrimaryProductImage(product) {
  const media = normalizeProductMedia(product)
  const primary = media.find((item) => item.isPrimary) || media[0]
  return resolveProductImage(primary?.url || product?.image || product?.images?.[0] || PRODUCT_IMAGE_FALLBACK)
}

export function getPrimaryProductImageAlt(product) {
  const media = normalizeProductMedia(product)
  const primary = media.find((item) => item.isPrimary) || media[0]
  return primary?.alt || product?.name || 'Product image'
}

export function getProductGalleryImages(product) {
  const media = normalizeProductMedia(product)
  return media.map((item) => ({
    ...item,
    src: resolveProductImage(item.url),
    alt: item.alt || product?.name || 'Product image',
  }))
}
