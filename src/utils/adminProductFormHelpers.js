export const spiceLevelOptions = ['Mild', 'Medium', 'Hot', 'Very Hot', 'Extra Hot']
export const categoryOptions = ['Pickles', 'Vathals', 'Powders']

let clientIdCounter = 0

function createClientId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`
  clientIdCounter += 1
  return `${prefix}-${clientIdCounter}`
}

export function createSlugPreview(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function createEmptyVariant() {
  return {
    _id: '',
    clientId: createClientId('variant'),
    label: '',
    packageType: 'pouch',
    image: '',
    grams: '',
    price: '',
    originalPrice: '',
    stock: '0',
    sku: '',
    isActive: true,
    freeShipping: false,
  }
}

export function createInitialProductFormState() {
  return {
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    image: '',
    images: [''],
    media: [],
    flavour: '',
    category: 'Pickles',
    spiceLevel: 'Medium',
    foodType: 'Vegetarian',
    highlights: [''],
    usageSuggestions: [''],
    featured: false,
    bestseller: false,
    newArrival: false,
    isActive: true,
    updateSlug: false,
    variants: [createEmptyVariant()],
    rating: 0,
    reviewCount: 0,
    createdAt: '',
    updatedAt: '',
  }
}

function stringifyNumber(value) {
  return value === undefined || value === null ? '' : String(value)
}

export function mapProductToFormState(product) {
  const media = (product.media?.length ? product.media : []).map((item, index) => ({
    id: item.publicId || item.url || `media-${index}`,
    url: item.url || '',
    publicId: item.publicId || '',
    alt: item.alt || product.name || '',
    isPrimary: item.isPrimary === true || (index === 0 && !product.media?.some((candidate) => candidate.isPrimary)),
    sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : index,
    status: 'uploaded',
    error: '',
    previewUrl: '',
    file: null,
    fileName: '',
    fileSize: 0,
    isNew: false,
    wasPersisted: true,
  }))

  return {
    ...createInitialProductFormState(),
    name: product.name || '',
    slug: product.slug || '',
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    image: product.image || '',
    images: product.images?.length ? product.images : [''],
    media,
    flavour: product.flavour || '',
    category: product.category || 'Pickles',
    spiceLevel: product.spiceLevel || 'Medium',
    foodType: product.foodType || 'Vegetarian',
    highlights: product.highlights?.length ? product.highlights : [''],
    usageSuggestions: product.usageSuggestions?.length ? product.usageSuggestions : [''],
    featured: Boolean(product.featured),
    bestseller: Boolean(product.bestseller),
    newArrival: Boolean(product.newArrival),
    isActive: product.isActive !== false,
    freeShipping: Boolean(product.freeShipping),
    updateSlug: false,
    variants: product.variants?.length
      ? product.variants.map((variant) => ({
          _id: variant._id || variant.id || '',
          clientId: variant._id || variant.id || createClientId('variant'),
          label: variant.label || '',
          packageType: variant.packageType || 'pouch',
          image: variant.image || '',
          grams: stringifyNumber(variant.grams),
          price: stringifyNumber(variant.price),
          originalPrice: stringifyNumber(variant.originalPrice),
          stock: stringifyNumber(variant.stock),
          sku: variant.sku || '',
          isActive: variant.isActive !== false,
        }))
      : [createEmptyVariant()],
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    createdAt: product.createdAt || '',
    updatedAt: product.updatedAt || '',
  }
}

export function cleanStringArray(values) {
  return (values || []).map((value) => String(value || '').trim()).filter(Boolean)
}

function numberOrUndefined(value) {
  if (value === '' || value === null || value === undefined) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function buildProductPayload(formState, { isEdit = false } = {}) {
  const cleanMedia = (formState.media || [])
    .filter((item) => item.url && item.status !== 'error' && item.status !== 'uploading')
    .map((item, index, values) => {
      const hasPrimary = values.some((candidate) => candidate.isPrimary)
      return {
        url: item.url,
        publicId: item.publicId || '',
        alt: String(item.alt || '').trim().slice(0, 160),
        isPrimary: hasPrimary ? item.isPrimary === true : index === 0,
        sortOrder: index,
      }
    })

  const payload = {
    name: formState.name.trim(),
    shortDescription: formState.shortDescription.trim(),
    description: formState.description.trim(),
    image: formState.image.trim(),
    images: cleanStringArray(formState.images),
    flavour: formState.flavour.trim(),
    category: formState.category.trim(),
    spiceLevel: formState.spiceLevel,
    foodType: 'Vegetarian',
    highlights: cleanStringArray(formState.highlights),
    usageSuggestions: cleanStringArray(formState.usageSuggestions),
    featured: Boolean(formState.featured),
    bestseller: Boolean(formState.bestseller),
    newArrival: Boolean(formState.newArrival),
    isActive: Boolean(formState.isActive),
    freeShipping: Boolean(formState.freeShipping),
    variants: formState.variants.map((variant) => {
      const nextVariant = {
        label: variant.label.trim(),
        packageType: variant.packageType === 'bottle' ? 'bottle' : 'pouch',
        image: String(variant.image || '').trim(),
        grams: numberOrUndefined(variant.grams),
        price: numberOrUndefined(variant.price),
        stock: numberOrUndefined(variant.stock),
        sku: variant.sku.trim().toUpperCase(),
        isActive: Boolean(variant.isActive),
      }

      if (variant.originalPrice !== '') nextVariant.originalPrice = numberOrUndefined(variant.originalPrice)
      if (isEdit && variant._id) nextVariant._id = variant._id

      return nextVariant
    }),
  }

  if (cleanMedia.length > 0) {
    payload.media = cleanMedia
    const primary = cleanMedia.find((item) => item.isPrimary) || cleanMedia[0]
    payload.image = primary.url
    payload.images = cleanMedia.map((item) => item.url)
  }

  payload.imageFiles = (formState.media || []).filter((item) => item.file).map((item) => item.file)
  payload.uploadMetadata = (formState.media || []).filter((item) => item.file).map((item) => ({
    alt: String(item.alt || '').trim().slice(0, 160),
    isPrimary: item.isPrimary === true,
  }))

  if (formState.slug.trim()) payload.slug = createSlugPreview(formState.slug)
  if (isEdit && formState.updateSlug) payload.updateSlug = true

  return payload
}

export function mapBackendValidationErrors(error) {
  return error?.details?.errors || error?.errors || {}
}

export function getFirstErrorPath(errors) {
  return Object.keys(errors || {})[0] || ''
}

export function getStartingPriceFromForm(formState) {
  const activePrices = formState.variants
    .filter((variant) => variant.isActive !== false)
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0)

  return activePrices.length ? Math.min(...activePrices) : 0
}

export function getTotalStockFromForm(formState) {
  return formState.variants
    .filter((variant) => variant.isActive !== false)
    .reduce((total, variant) => total + Math.max(0, Number.parseInt(variant.stock || '0', 10) || 0), 0)
}
