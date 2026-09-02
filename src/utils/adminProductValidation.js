import { cleanStringArray, createSlugPreview, spiceLevelOptions } from './adminProductFormHelpers'

function addError(errors, path, message) {
  if (!errors[path]) errors[path] = message
}

function requiredString(errors, values, field, label, max) {
  const value = String(values[field] || '').trim()
  if (!value) addError(errors, field, `Enter ${label.toLowerCase()}.`)
  else if (max && value.length > max) addError(errors, field, `${label} must be ${max} characters or less.`)
}

function isValidImagePath(value) {
  return value.startsWith('/images/products/') || value.startsWith('https://')
}

function validateMedia(errors, values) {
  const media = values.media || []
  if (!Array.isArray(media)) {
    addError(errors, 'media', 'Product media is invalid.')
    return
  }

  if (media.some((item) => item.status === 'error')) {
    addError(errors, 'media', 'Remove image preview errors before saving.')
    return
  }

  if (media.length > 5) addError(errors, 'media', 'A product can contain up to 5 images.')
  if (media.length === 0) return

  const uploaded = media.filter((item) => item.url)
  if (uploaded.length === 0 && !media.some((item) => item.file)) addError(errors, 'media', 'At least one product image is required.')
  if (uploaded.filter((item) => item.isPrimary).length > 1) addError(errors, 'media', 'Only one image can be primary.')

  const seenUrls = new Set()
  const seenPublicIds = new Set()

  uploaded.forEach((item, index) => {
    if (!isValidImagePath(item.url)) addError(errors, `media.${index}.url`, 'Use a trusted /images/products path or an HTTPS preview URL.')
    if (seenUrls.has(item.url)) addError(errors, `media.${index}.url`, 'Duplicate image URLs are not allowed.')
    seenUrls.add(item.url)

    if (item.publicId) {
      if (seenPublicIds.has(item.publicId)) addError(errors, `media.${index}.publicId`, 'Duplicate image public IDs are not allowed.')
      seenPublicIds.add(item.publicId)
    }

    if (String(item.alt || '').length > 160) addError(errors, `media.${index}.alt`, 'Image alt text must be 160 characters or less.')
  })
}

function validateArray(errors, values, field, label, maxItems) {
  const cleaned = cleanStringArray(values[field])
  if (cleaned.length > maxItems) addError(errors, field, `${label} can contain at most ${maxItems} items.`)
  cleaned.forEach((item, index) => {
    if (item.length > 300) addError(errors, `${field}.${index}`, `${label} item is too long.`)
  })
}

export function validateProductForm(values) {
  const errors = {}

  requiredString(errors, values, 'name', 'Product name', 120)
  if (errors.name === 'Enter product name.') errors.name = 'Enter a product name.'
  if (String(values.name || '').trim().length === 1) addError(errors, 'name', 'Product name must be at least 2 characters.')

  const slug = String(values.slug || '').trim()
  if (slug && !createSlugPreview(slug)) addError(errors, 'slug', 'Slug contains unsupported characters.')

  requiredString(errors, values, 'shortDescription', 'Short description', 220)
  requiredString(errors, values, 'description', 'Full description', 3000)
  validateMedia(errors, values)
  if (!values.media?.length) {
    requiredString(errors, values, 'image', 'Main image', 500)
  }
  if (!values.media?.length && values.image && !isValidImagePath(values.image.trim())) {
    addError(errors, 'image', 'Use a /images/products path or an HTTPS URL.')
  }
  requiredString(errors, values, 'category', 'Category', 80)
  if (errors.category === 'Enter category.') errors.category = 'Choose a category.'
  requiredString(errors, values, 'flavour', 'Flavour', 80)
  if (!spiceLevelOptions.includes(values.spiceLevel)) addError(errors, 'spiceLevel', 'Choose a supported spice level.')
  if (values.foodType !== 'Vegetarian') addError(errors, 'foodType', 'Food type must be Vegetarian.')
  validateArray(errors, values, 'images', 'Images', 6)
  values.images.forEach((image, index) => {
    const nextImage = String(image || '').trim()
    if (!values.media?.length && nextImage && !isValidImagePath(nextImage)) addError(errors, `images.${index}`, 'Use a /images/products path or an HTTPS URL.')
  })
  validateArray(errors, values, 'highlights', 'Highlights', 12)
  validateArray(errors, values, 'usageSuggestions', 'Usage suggestions', 12)

  if (!Array.isArray(values.variants) || values.variants.length < 1) {
    addError(errors, 'variants', 'Add at least one pack size.')
    return errors
  }

  const seenSkus = new Set()
  const seenPackSizes = new Set()

  values.variants.forEach((variant, index) => {
    const prefix = `variants.${index}`
    if (!variant.label.trim()) addError(errors, `${prefix}.label`, 'Enter a pack size.')

    const packageType = variant.packageType === 'bottle' ? 'bottle' : 'pouch'
    const variantImage = String(variant.image || '').trim()
    if (variantImage && !isValidImagePath(variantImage)) addError(errors, `${prefix}.image`, 'Use a valid product image path or HTTPS URL.')

    const grams = Number(variant.grams)
    if (!Number.isFinite(grams) || grams <= 0) addError(errors, `${prefix}.grams`, 'Enter a valid weight.')
    else if (seenPackSizes.has(`${packageType}:${grams}`)) addError(errors, `${prefix}.grams`, 'This package already has the same weight.')
    else seenPackSizes.add(`${packageType}:${grams}`)

    const price = Number(variant.price)
    if (!Number.isFinite(price) || price <= 0) addError(errors, `${prefix}.price`, 'Enter a valid price.')

    if (variant.originalPrice !== '') {
      const originalPrice = Number(variant.originalPrice)
      if (!Number.isFinite(originalPrice) || originalPrice <= 0) addError(errors, `${prefix}.originalPrice`, 'Enter a valid original price.')
      else if (Number.isFinite(price) && originalPrice < price) addError(errors, `${prefix}.originalPrice`, 'Original price must be equal to or higher than the selling price.')
    }

    const stock = Number(variant.stock)
    if (!Number.isInteger(stock) || stock < 0) addError(errors, `${prefix}.stock`, 'Stock cannot be negative.')

    const sku = String(variant.sku || '').trim().toUpperCase()
    if (sku) {
      if (seenSkus.has(sku)) addError(errors, `${prefix}.sku`, 'Each pack size needs a unique SKU.')
      else seenSkus.add(sku)
    }
  })

  return errors
}
