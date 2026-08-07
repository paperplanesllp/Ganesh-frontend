import { formatCurrency } from '../../utils/currency'
import { getStartingPriceFromForm, getTotalStockFromForm } from '../../utils/adminProductFormHelpers'
import { getPrimaryProductImage } from '../../utils/productImages'
import ProductStatusBadge from './ProductStatusBadge'

function ProductPreviewModal({ isOpen, formState, onClose }) {
  if (!isOpen) return null

  const startingPrice = getStartingPriceFromForm(formState)
  const totalStock = getTotalStockFromForm(formState)

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-2 sm:p-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div className="max-h-[calc(100svh-1rem)] w-full max-w-3xl overflow-auto rounded-xl bg-white p-4 shadow-xl sm:max-h-[90vh] sm:rounded-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="preview-title">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="preview-title" className="text-xl font-extrabold text-gray-900">Product preview</h2>
            <p className="mt-1 text-sm font-bold text-brand-dark">Preview based on unsaved form data.</p>
          </div>
          <button type="button" className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-brand" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <img src={getPrimaryProductImage(formState)} alt="" className="h-64 w-full rounded-2xl object-contain" />
          <div>
            <div className="flex flex-wrap gap-2">
              <ProductStatusBadge type={formState.isActive ? 'active' : 'inactive'}>{formState.isActive ? 'Active' : 'Inactive'}</ProductStatusBadge>
              {formState.featured && <ProductStatusBadge type="badge">Featured</ProductStatusBadge>}
              {formState.bestseller && <ProductStatusBadge type="badge">Bestseller</ProductStatusBadge>}
              {formState.newArrival && <ProductStatusBadge type="badge">New Arrival</ProductStatusBadge>}
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-gray-900">{formState.name || 'Untitled product'}</h3>
            <p className="mt-2 text-sm font-bold text-gray-600">{formState.category} • {formState.flavour}</p>
            <p className="mt-4 text-sm leading-6 text-gray-600">{formState.shortDescription || 'Short description preview appears here.'}</p>
            <p className="mt-5 text-xl font-extrabold text-brand">{startingPrice ? `From ${formatCurrency(startingPrice)}` : 'Price unavailable'}</p>
            <p className="mt-2 text-sm font-bold text-gray-600">Total active stock: {totalStock}</p>
            <p className="mt-4 text-sm text-gray-600">Weights: {formState.variants.map((variant) => variant.label).filter(Boolean).join(', ') || 'No weights yet'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPreviewModal
