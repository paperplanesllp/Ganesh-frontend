export const ALLOWED_PRODUCT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_PRODUCT_MEDIA_ITEMS = 5

export const uploadMessages = {
  invalidFormat: 'Choose a JPEG, PNG or WebP image.',
  tooLarge: 'Each image must be smaller than 5 MB.',
  maxReached: 'A product can contain up to 5 images.',
}

export function validateProductImageFile(file) {
  if (!file) return 'Choose an image to upload.'
  if (!ALLOWED_PRODUCT_IMAGE_TYPES.includes(file.type)) return uploadMessages.invalidFormat
  if (file.size > MAX_PRODUCT_IMAGE_BYTES) return uploadMessages.tooLarge
  return ''
}

export function validateProductImageSelection(files, currentMedia = []) {
  const list = Array.from(files || [])
  const errors = []

  if (currentMedia.length + list.length > MAX_PRODUCT_MEDIA_ITEMS) {
    return {
      validFiles: [],
      errors: [uploadMessages.maxReached],
    }
  }

  const existingFingerprints = new Set(
    currentMedia
      .map((item) => item.fileName && item.fileSize ? `${item.fileName}:${item.fileSize}` : '')
      .filter(Boolean),
  )
  const batchFingerprints = new Set()

  const validFiles = list.filter((file) => {
    const error = validateProductImageFile(file)
    if (error) {
      errors.push(`${file.name}: ${error}`)
      return false
    }

    const fingerprint = `${file.name}:${file.size}`
    if (existingFingerprints.has(fingerprint) || batchFingerprints.has(fingerprint)) {
      errors.push(`${file.name}: This image is already selected.`)
      return false
    }

    batchFingerprints.add(fingerprint)
    return true
  })

  return { validFiles, errors }
}
