import ConfirmationModal from './ConfirmationModal'
import { FieldError } from './ProductFormFields'

function stockLabel(stockValue) {
  const stock = Number(stockValue)
  if (stock === 0) return 'Out of stock'
  if (stock > 0 && stock <= 5) return 'Low stock'
  return 'In stock'
}

function ProductVariantFields({ variants, errors, onVariantChange, addVariant, removeVariant, pendingRemove, setPendingRemove }) {
  const packSizePresets = [
    ['100 g', '100'],
    ['200 g', '200'],
    ['300 g', '300'],
    ['500 g', '500'],
    ['1 kg', '1000'],
  ]

  const variantFields = [
    ['label', 'Pack size', 'text', '250 g'],
    ['grams', 'Weight in grams', 'number', '250'],
    ['price', 'Selling price', 'number', '199'],
    ['originalPrice', 'Original price', 'number', '249'],
    ['stock', 'Stock quantity', 'number', '25'],
    ['sku', 'Product code (SKU)', 'text', 'GPM-MANGO-250'],
  ]

  const choosePackSize = (index, label, grams, packageType = 'pouch') => {
    onVariantChange(index, 'label', packageType === 'bottle' ? `Bottle ${label}` : label)
    onVariantChange(index, 'grams', grams)
    onVariantChange(index, 'packageType', packageType)
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-brand/20 bg-brand-light/40 p-3 text-sm leading-6 text-gray-700">
        Add one variant for every price. For example: choose <strong>100 g</strong> and enter ₹20, then select <strong>Add another pack size</strong>, choose <strong>200 g</strong> and enter ₹30. Choose <strong>Custom size</strong> to type any other pack size manually.
      </div>
      {variants.map((variant, index) => {
        const prefix = `variants.${index}`
        const title = variant.label ? `${variant.label} variant` : `Variant ${index + 1}`
        return (
          <article key={variant._id || variant.clientId} className="rounded-xl border border-gray-200 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <p className="mt-1 text-sm text-gray-600">{stockLabel(variant.stock)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {packSizePresets.map(([label, grams]) => (
                  <button
                    key={label}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-medium ${variant.grams === grams ? 'bg-brand text-white' : 'bg-brand-light text-brand'}`}
                    onClick={() => choosePackSize(index, label, grams)}
                  >
                    {label}
                  </button>
                ))}
                {packSizePresets.filter(([, grams]) => grams === '300' || grams === '500').map(([label, grams]) => (
                  <button
                    key={`bottle-${label}`}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-medium ${variant.packageType === 'bottle' && variant.grams === grams ? 'bg-brand text-white' : 'bg-brand-light text-brand'}`}
                    onClick={() => choosePackSize(index, label, grams, 'bottle')}
                  >
                    Bottle {label}
                  </button>
                ))}
                <button
                  type="button"
                  className="rounded-full border border-brand/30 bg-white px-3 py-1 text-xs font-medium text-brand"
                  onClick={() => {
                    onVariantChange(index, 'label', '')
                    onVariantChange(index, 'grams', '')
                  }}
                >
                  Custom size
                </button>
                <button type="button" disabled={variants.length === 1} className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Remove ${title}`} onClick={() => variant._id ? setPendingRemove(index) : removeVariant(index)}>
                  Remove
                </button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {variantFields.map(([field, label, type, placeholder]) => (
                <label key={field} className="grid gap-2 text-sm font-medium text-gray-900">
                  <span>{label}</span>
                  <span className={field === 'price' || field === 'originalPrice' ? 'flex min-h-11 overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15' : 'block'}>
                    {(field === 'price' || field === 'originalPrice') && <span className="grid w-10 place-items-center border-r border-gray-200 text-sm text-gray-600">₹</span>}
                    <input
                      type={type}
                      name={`${prefix}.${field}`}
                      value={variant[field]}
                      min={type === 'number' ? '0' : undefined}
                      placeholder={placeholder}
                      aria-invalid={Boolean(errors[`${prefix}.${field}`])}
                      aria-describedby={errors[`${prefix}.${field}`] ? `${prefix}-${field}-error` : undefined}
                      className={field === 'price' || field === 'originalPrice' ? 'min-w-0 flex-1 px-3 text-sm outline-none' : 'min-h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15'}
                      onChange={(event) => onVariantChange(index, field, field === 'sku' ? event.target.value.toUpperCase() : event.target.value)}
                    />
                  </span>
                  {field === 'originalPrice' && <span className="text-xs font-normal text-gray-600">Leave empty when there is no discount.</span>}
                  {field === 'sku' && <span className="text-xs font-normal text-gray-600">A unique internal code, for example GPM-MANGO-250.</span>}
                  <FieldError id={`${prefix}-${field}-error`} message={errors[`${prefix}.${field}`]} />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-medium text-gray-900 md:col-span-2 xl:col-span-3">
                <span>Pack image path or URL</span>
                <input
                  type="text"
                  name={`${prefix}.image`}
                  value={variant.image || ''}
                  placeholder="/images/products/mango-bottle-300.jpg"
                  aria-invalid={Boolean(errors[`${prefix}.image`])}
                  className="min-h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
                  onChange={(event) => onVariantChange(index, 'image', event.target.value)}
                />
                <span className="text-xs font-normal text-gray-600">This becomes the main product image when the customer selects this pack.</span>
                <FieldError id={`${prefix}-image-error`} message={errors[`${prefix}.image`]} />
              </label>
              <label className="flex min-h-11 items-center gap-3 rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-900">
                <input type="checkbox" checked={variant.isActive} onChange={(event) => onVariantChange(index, 'isActive', event.target.checked)} className="h-4 w-4 accent-brand" />
                Available for sale
              </label>
            </div>
          </article>
        )
      })}
      <FieldError id="variants-error" message={errors.variants} />
      <button type="button" className="min-h-11 rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand hover:bg-brand-light" onClick={addVariant}>
        + Add another price / pack size
      </button>
      <ConfirmationModal
        isOpen={pendingRemove !== null}
        title="Remove this pack size?"
        message="This variant will be removed from the product when you save changes."
        confirmLabel="Remove"
        danger
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          removeVariant(pendingRemove)
          setPendingRemove(null)
        }}
      />
    </div>
  )
}

export default ProductVariantFields
