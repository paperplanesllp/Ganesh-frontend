import { useEffect, useMemo, useState } from 'react'

const initialForm = {
  productId: '',
  rating: '',
  title: '',
  comment: '',
}

function isValidImage(file) {
  if (!file) return false
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  return allowedTypes.includes(file.type)
}

function WriteReviewModal({ isOpen, onClose, onSubmit, products, isSubmitting, submitMessage }) {
  const [values, setValues] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])

  useEffect(() => {
    if (!isOpen) {
      setValues(initialForm)
      setErrors({})
      setSelectedFiles([])
      setPreviewUrls([])
    }
  }, [isOpen])

  const productOptions = useMemo(() => products || [], [products])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    const nextFiles = files.slice(0, 5)
    const invalidFiles = nextFiles.filter((file) => !isValidImage(file))

    if (invalidFiles.length > 0) {
      setErrors((current) => ({ ...current, images: 'Only JPEG, PNG, or WebP images are supported.' }))
      return
    }

    const nextUrls = nextFiles.map((file) => URL.createObjectURL(file))

    setSelectedFiles(nextFiles)
    setPreviewUrls(nextUrls)
    setErrors((current) => ({ ...current, images: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!values.productId) nextErrors.productId = 'Please select a product.'
    if (!values.rating) nextErrors.rating = 'Please choose a rating.'
    if (!values.title.trim()) nextErrors.title = 'Please enter a short review title.'
    if (values.comment.trim().length < 20) nextErrors.comment = 'Review description must contain at least 20 characters.'
    if (selectedFiles.length > 5) nextErrors.images = 'You can upload up to 5 images.'

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    await onSubmit({
      ...values,
      title: values.title.trim(),
      comment: values.comment.trim(),
      images: selectedFiles.map((file) => file.name),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-sm font-bold uppercase text-brand">Share feedback</p>
            <h3 className="font-[Georgia,serif] text-2xl font-bold text-brand-dark">Write a Review</h3>
          </div>
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="grid gap-4 px-5 py-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-gray-900">
              Product
              <select
                name="productId"
                value={values.productId}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand"
              >
                <option value="">Select a product</option>
                {productOptions.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productId && <span className="text-xs font-semibold text-brand">{errors.productId}</span>}
            </label>

            <label className="grid gap-2 text-sm font-semibold text-gray-900">
              Rating
              <select
                name="rating"
                value={values.rating}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand"
              >
                <option value="">Choose stars</option>
                {[5, 4, 3, 2, 1].map((item) => (
                  <option key={item} value={item}>
                    {item} star{item > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              {errors.rating && <span className="text-xs font-semibold text-brand">{errors.rating}</span>}
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-gray-900">
            Review title
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand"
              placeholder="What stood out most?"
            />
            {errors.title && <span className="text-xs font-semibold text-brand">{errors.title}</span>}
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-900">
            Review description
            <textarea
              name="comment"
              value={values.comment}
              onChange={handleChange}
              className="min-h-36 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand"
              placeholder="Tell other customers about your taste experience, texture, aroma, or packaging."
            />
            {errors.comment && <span className="text-xs font-semibold text-brand">{errors.comment}</span>}
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-900">
            Upload up to 5 images
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleFileChange}
              className="w-full rounded-xl border border-dashed border-gray-200 px-4 py-3"
            />
            {errors.images && <span className="text-xs font-semibold text-brand">{errors.images}</span>}
          </label>

          {previewUrls.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {previewUrls.map((preview, index) => (
                <img
                  key={preview}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-full rounded-xl border border-gray-200 bg-gray-50 object-cover"
                />
              ))}
            </div>
          )}

          {submitMessage && (
            <div className="rounded-xl bg-brand-light px-4 py-3 text-sm font-semibold text-brand">{submitMessage}</div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-brand px-5 py-2.5 font-semibold text-white transition duration-200 hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-600"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteReviewModal
