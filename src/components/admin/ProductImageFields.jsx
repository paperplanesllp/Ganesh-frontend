import { useState } from 'react'
import { resolveProductImage } from '../../utils/productImages'
import { FieldError, TextInput } from './ProductFormFields'
import ProductMediaGrid from './ProductMediaGrid'
import ProductImageUploader from './ProductImageUploader'

function normalizeMediaOrder(media) {
  if (!media.length) return media
  const hasPrimary = media.some((item) => item.isPrimary)
  return media.map((item, index) => ({
    ...item,
    sortOrder: index,
    isPrimary: hasPrimary ? item.isPrimary === true : index === 0,
  }))
}

function ProductImageFields({
  formState,
  errors,
  onChange,
  onArrayChange,
  addArrayItem,
  removeArrayItem,
  onMediaChange,
  isEdit,
}) {
  const [cleanupWarning, setCleanupWarning] = useState('')
  const [legacyOpen, setLegacyOpen] = useState(true)
  const media = formState.media || []

  const updateMedia = (updater) => {
    onMediaChange((currentMedia) => normalizeMediaOrder(typeof updater === 'function' ? updater(currentMedia) : updater))
  }

  const handleAltChange = (index, value) => {
    updateMedia((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, alt: value.slice(0, 160) } : item)))
  }

  const handleSetPrimary = (index) => {
    updateMedia((current) => current.map((item, itemIndex) => ({ ...item, isPrimary: itemIndex === index })))
  }

  const handleMove = (index, direction) => {
    updateMedia((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  const handleRemove = (index) => {
    const item = media[index]
    if (!item) return
    if (item.wasPersisted && !window.confirm('Remove this saved image from the product preview?')) return

    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
    updateMedia((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleFilesSelected = (files) => {
    const nextItems = files.map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      url: '',
      publicId: '',
      alt: formState.name || '',
      isPrimary: media.length === 0 && index === 0,
      sortOrder: media.length + index,
      status: 'pending',
      error: '',
      previewUrl: URL.createObjectURL(file),
      file,
      fileName: file.name,
      fileSize: file.size,
      isNew: true,
      wasPersisted: false,
    }))
    updateMedia((current) => [...current, ...nextItems])
  }

  return (
    <div className="grid gap-5">
      <ProductImageUploader media={media} onFilesSelected={handleFilesSelected} />
      <ProductMediaGrid
        media={media}
        errors={errors}
        onAltChange={handleAltChange}
        onSetPrimary={handleSetPrimary}
        onMove={handleMove}
        onRemove={handleRemove}
        onRetry={() => setCleanupWarning('Remove the invalid image and select it again.')}
      />
      {cleanupWarning && (
        <p className="rounded-lg border border-brand-light bg-brand-light p-3 text-sm font-medium text-brand-dark" role="alert">
          {cleanupWarning}
        </p>
      )}
      <details className="rounded-xl border border-gray-200 bg-gray-100 p-4" open={legacyOpen} onToggle={(event) => setLegacyOpen(event.currentTarget.open)}>
        <summary className="cursor-pointer text-sm font-medium text-brand">
          Image paths
        </summary>
        <div className="mt-4 grid gap-5">
          <TextInput label="Main image" name="image" value={formState.image} error={errors.image} helper="Use /images/products/name.jpg or an HTTPS URL." onChange={onChange} required={!media.length} />
          {formState.image && (
            <div className="max-w-xs overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              <img src={resolveProductImage(formState.image)} alt="Main product preview" className="h-40 w-full object-contain" />
            </div>
          )}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-900">Gallery images</p>
              <button type="button" disabled={formState.images.length >= 6 || media.length > 0} className="min-h-10 rounded-lg border border-gray-200 px-3 text-sm font-medium text-brand hover:bg-brand-light disabled:opacity-50" onClick={() => addArrayItem('images')}>
                Add image
              </button>
            </div>
            <div className="grid gap-3">
              {formState.images.map((image, index) => (
                <div key={index} className="grid gap-2 md:grid-cols-[1fr_auto]">
                  <input
                    value={image}
                    aria-label={`Gallery image ${index + 1}`}
                    disabled={media.length > 0}
                    className="min-h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:bg-gray-100"
                    onChange={(event) => onArrayChange('images', index, event.target.value)}
                  />
                  <button type="button" disabled={media.length > 0} className="min-h-11 rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand hover:bg-brand-light disabled:opacity-50" aria-label={`Remove gallery image ${index + 1}`} onClick={() => removeArrayItem('images', index)}>
                    Remove
                  </button>
                  <FieldError id={`images-${index}-error`} message={errors[`images.${index}`]} />
                </div>
              ))}
            </div>
          </div>
          {media.length > 0 && (
            <p className="rounded-lg bg-brand-light p-3 text-sm text-brand">
              Uploaded image previews are being used for this product.
            </p>
          )}
          {isEdit && (
            <p className="text-sm text-gray-600">
              Existing local seed images can remain alongside images uploaded securely through the backend.
            </p>
          )}
        </div>
      </details>
    </div>
  )
}

export default ProductImageFields
