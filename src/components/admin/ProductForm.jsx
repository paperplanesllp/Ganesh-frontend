import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildProductPayload,
  createEmptyVariant,
  createInitialProductFormState,
  getFirstErrorPath,
  getStartingPriceFromForm,
  getTotalStockFromForm,
  mapBackendValidationErrors,
} from '../../utils/adminProductFormHelpers'
import { validateProductForm } from '../../utils/adminProductValidation'
import { formatCurrency } from '../../utils/currency'
import { resolveProductImage } from '../../utils/productImages'
import AdminErrorState from './AdminErrorState'
import ProductBasicFields from './ProductBasicFields'
import ProductContentFields from './ProductContentFields'
import ProductImageFields from './ProductImageFields'
import ProductPreviewModal from './ProductPreviewModal'
import ProductStatusFields from './ProductStatusFields'
import ProductVariantFields from './ProductVariantFields'
import { SectionCard } from './ProductFormFields'

function ProductForm({
  mode = 'create',
  initialState,
  onSubmit,
  onCancel,
  submitLabel = 'Save Product',
  isSubmitting = false,
  submitError = '',
}) {
  const [formState, setFormState] = useState(initialState || createInitialProductFormState())
  const [errors, setErrors] = useState({})
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [pendingRemove, setPendingRemove] = useState(null)
  const formRef = useRef(null)
  const formStateRef = useRef(formState)
  const isEdit = mode === 'edit'

  useEffect(() => {
    if (initialState) setFormState(initialState)
  }, [initialState])

  useEffect(() => {
    formStateRef.current = formState
  }, [formState])

  useEffect(
    () => () => {
      ;(formStateRef.current.media || []).forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      })
    },
    [],
  )

  const ratingInfo = useMemo(() => {
    if (!isEdit) return ''
    return `Preview reviews: ${formState.rating || 0} rating, ${formState.reviewCount || 0} reviews.`
  }, [formState.rating, formState.reviewCount, isEdit])

  const productSummary = useMemo(() => ({
    image: formState.media?.find((item) => item.isPrimary)?.previewUrl || formState.media?.find((item) => item.isPrimary)?.url || formState.media?.[0]?.previewUrl || formState.media?.[0]?.url || formState.image,
    startingPrice: getStartingPriceFromForm(formState),
    totalStock: getTotalStockFromForm(formState),
    variantCount: formState.variants?.length || 0,
  }), [formState])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormState((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const onArrayChange = (field, index, value) => {
    setFormState((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }))
  }

  const addArrayItem = (field) => {
    setFormState((current) => ({
      ...current,
      [field]: [...current[field], ''],
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormState((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleMediaChange = (updater) => {
    setFormState((current) => {
      const nextMedia = typeof updater === 'function' ? updater(current.media || []) : updater
      return { ...current, media: nextMedia }
    })
    setErrors((current) => {
      if (!current.media) return current
      const next = { ...current }
      delete next.media
      return next
    })
  }

  const onVariantChange = (index, field, value) => {
    setFormState((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant,
      ),
    }))
  }

  const addVariant = () => {
    setFormState((current) => ({
      ...current,
      variants: [...current.variants, createEmptyVariant()],
    }))
  }

  const removeVariant = (index) => {
    setFormState((current) => {
      if (current.variants.length === 1) return current
      return {
        ...current,
        variants: current.variants.filter((_, variantIndex) => variantIndex !== index),
      }
    })
  }

  const focusFirstError = (nextErrors) => {
    const firstPath = getFirstErrorPath(nextErrors)
    if (!firstPath) return
    const firstName = firstPath.split('.').slice(0, 1).join('.')
    const target = formRef.current?.querySelector(`[name="${firstPath}"], [name="${firstName}"], [aria-label*="${firstName}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    target?.focus?.()
  }

  const submit = async (event, returnAfterSave = false) => {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors = validateProductForm(formState)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return
    }

    try {
      await onSubmit(buildProductPayload(formState, { isEdit }), returnAfterSave)
    } catch (error) {
      const backendErrors = mapBackendValidationErrors(error)
      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors)
        focusFirstError(backendErrors)
      }
    }
  }

  const handleCancel = async () => {
    onCancel?.()
  }

  return (
    <form ref={formRef} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]" onSubmit={(event) => submit(event, false)} noValidate>
      {submitError && <div className="xl:col-span-2"><AdminErrorState title="Product could not be saved" message={submitError} /></div>}
      <div className="grid gap-6">
        <SectionCard title="Basic Information" description="Name, category and customer-facing summary.">
          <ProductBasicFields formState={formState} errors={errors} onChange={handleChange} isEdit={isEdit} />
          {ratingInfo && <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-600">{ratingInfo}</p>}
        </SectionCard>
        <SectionCard title="Product Details" description="Description and serving ideas.">
          <ProductContentFields formState={formState} errors={errors} onChange={handleChange} onArrayChange={onArrayChange} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
        </SectionCard>
        <SectionCard title="Pricing and Stock" description="Pack sizes, prices, stock and product codes.">
          <ProductVariantFields variants={formState.variants} errors={errors} onVariantChange={onVariantChange} addVariant={addVariant} removeVariant={removeVariant} pendingRemove={pendingRemove} setPendingRemove={setPendingRemove} />
        </SectionCard>
        <SectionCard title="Product Images" description="Add a main image and optional gallery images.">
          <ProductImageFields
            formState={formState}
            errors={errors}
            onChange={handleChange}
            onArrayChange={onArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            onMediaChange={handleMediaChange}
            isEdit={isEdit}
          />
        </SectionCard>
      </div>
      <div className="grid gap-6 xl:sticky xl:top-24 xl:self-start">
        <SectionCard title="Visibility" description="Choose where this product appears.">
          <ProductStatusFields formState={formState} onChange={handleChange} />
        </SectionCard>
        <SectionCard title="Product Summary" description="Live preview of the saved product details.">
          <div className="flex gap-3">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-gray-100">
              {productSummary.image ? <img src={resolveProductImage(productSummary.image)} alt="" className="h-full w-full object-contain" /> : <span className="text-xs text-gray-600">Image</span>}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{formState.name || 'Untitled product'}</p>
              <p className="mt-1 text-xs text-gray-600">{formState.category || 'Category'}</p>
              <p className="mt-2 text-sm font-semibold text-brand">{productSummary.startingPrice ? formatCurrency(productSummary.startingPrice) : 'No price yet'}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-xs text-gray-600">Pack sizes</p>
              <p className="mt-1 font-semibold text-gray-900">{productSummary.variantCount}</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-xs text-gray-600">Total stock</p>
              <p className="mt-1 font-semibold text-gray-900">{productSummary.totalStock}</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Save Product" description="Review your changes before saving.">
          <div className="grid gap-3">
            <button type="submit" disabled={isSubmitting} className="min-h-11 rounded-lg bg-brand px-5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60">
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
            <button type="button" disabled={isSubmitting} className="min-h-11 rounded-lg border border-brand px-5 text-sm font-medium text-brand disabled:opacity-60" onClick={(event) => submit(event, true)}>
              Save and Close
            </button>
            <button type="button" className="min-h-11 rounded-lg border border-gray-200 px-5 text-sm font-medium text-brand hover:bg-brand-light" onClick={() => setIsPreviewOpen(true)}>
              Preview
            </button>
            {onCancel && (
              <button type="button" className="min-h-11 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-600 hover:bg-gray-100" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </SectionCard>
      </div>
      <ProductPreviewModal isOpen={isPreviewOpen} formState={formState} onClose={() => setIsPreviewOpen(false)} />
    </form>
  )
}

export default ProductForm
