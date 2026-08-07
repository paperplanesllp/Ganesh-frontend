import { useRef, useState } from 'react'
import { MAX_PRODUCT_MEDIA_ITEMS, validateProductImageSelection } from '../../utils/imageValidation'

function ProductImageUploader({ media, disabled, onFilesSelected }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState([])

  const chooseFiles = (files) => {
    const { validFiles, errors: nextErrors } = validateProductImageSelection(files, media)
    setErrors(nextErrors)
    if (validFiles.length > 0) onFilesSelected(validFiles)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    if (disabled) return
    chooseFiles(event.dataTransfer.files)
  }

  const remaining = Math.max(0, MAX_PRODUCT_MEDIA_ITEMS - media.length)

  return (
    <div className="grid gap-3">
      <label htmlFor="product-images" className="text-sm font-extrabold text-gray-900">
        Upload product images
      </label>
      <input
        ref={inputRef}
        id="product-images"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled || remaining === 0}
        className="sr-only"
        onChange={(event) => chooseFiles(event.target.files)}
      />
      <div
        role="button"
        tabIndex={disabled || remaining === 0 ? -1 : 0}
        aria-describedby="product-images-help product-images-errors"
        className={`grid min-h-40 place-items-center rounded-xl border-2 border-dashed p-4 text-center outline-none transition focus:ring-2 focus:ring-brand/40 ${
          isDragging ? 'border-brand bg-brand-light' : 'border-gray-300 bg-gray-100'
        } ${disabled || remaining === 0 ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
      >
        <div>
          <svg className="mx-auto h-10 w-10 text-brand" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16h-2Zm-5 4c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 4 18v-3h2v3h12v-3h2v3c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H6Z" />
          </svg>
          <p className="mt-2 text-sm font-extrabold text-brand">Click to select or drop images here</p>
          <p id="product-images-help" className="mt-1 text-xs font-bold text-gray-600">
            JPEG, PNG or WebP. Up to 5 MB each. {remaining} slot{remaining === 1 ? '' : 's'} left.
          </p>
        </div>
      </div>
      <div id="product-images-errors" className="grid gap-2" aria-live="polite">
        {errors.map((error) => (
          <p key={error} className="rounded-lg bg-brand-light p-2 text-sm font-bold text-brand">
            {error}
          </p>
        ))}
      </div>
    </div>
  )
}

export default ProductImageUploader
