// Backend integration point: admin image upload is disabled during frontend preview mode.
import { USE_MOCK_DATA } from '../config/appConfig'
import { authenticatedApiRequest } from './api'
import { validateProductImageFile } from '../utils/imageValidation'

function uploadErrorMessage(error) {
  if (error?.status === 401) return 'Your session has expired. Please sign in again.'
  if (error?.status === 403) return 'Only admins can upload product images.'
  if (error?.status === 429) return 'Too many image upload requests. Please try again later.'
  return error?.message || 'Image upload is currently unavailable. Please try again.'
}

export async function requestProductUploadSignature(file, auth = {}) {
  if (USE_MOCK_DATA) {
    throw new Error('Upload API requests are disabled in frontend preview mode.')
  }

  try {
    const data = await authenticatedApiRequest(
      '/uploads/product-signature',
      {
        method: 'POST',
        body: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
      },
      auth,
    )
    return data.upload
  } catch (error) {
    throw new Error(uploadErrorMessage(error))
  }
}

export async function uploadImageToCloudinary(file, upload) {
  if (USE_MOCK_DATA) {
    throw new Error('Cloudinary upload is disabled in frontend preview mode.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('timestamp', String(upload.timestamp))
  formData.append('signature', upload.signature)
  formData.append('api_key', upload.apiKey)
  formData.append('folder', upload.folder)
  if (upload.uploadPreset) formData.append('upload_preset', upload.uploadPreset)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${upload.cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.secure_url || !data?.public_id) {
    throw new Error('Image upload is currently unavailable. Please try again.')
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  }
}

export async function uploadProductImage(file, auth = {}) {
  const validationError = validateProductImageFile(file)
  if (validationError) throw new Error(validationError)

  const upload = await requestProductUploadSignature(file, auth)
  return uploadImageToCloudinary(file, upload)
}

export async function deleteUnattachedProductImage(publicId, auth = {}) {
  if (!publicId) return null
  if (USE_MOCK_DATA) {
    throw new Error('Upload cleanup is disabled in frontend preview mode.')
  }

  try {
    return await authenticatedApiRequest(
      '/uploads/product-image',
      {
        method: 'DELETE',
        body: { publicId },
      },
      auth,
    )
  } catch (error) {
    throw new Error(uploadErrorMessage(error))
  }
}
