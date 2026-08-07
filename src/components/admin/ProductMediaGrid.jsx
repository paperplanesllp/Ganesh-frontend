import ProductMediaCard from './ProductMediaCard'

function ProductMediaGrid({ media, errors, onAltChange, onSetPrimary, onMove, onRemove, onRetry }) {
  if (!media.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-100 p-4 text-sm font-bold text-gray-600">
        No images uploaded yet.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {media.map((item, index) => (
        <ProductMediaCard
          key={item.id || item.url || index}
          item={item}
          index={index}
          total={media.length}
          onAltChange={onAltChange}
          onSetPrimary={onSetPrimary}
          onMove={onMove}
          onRemove={onRemove}
          onRetry={onRetry}
        />
      ))}
      {errors.media && (
        <p className="rounded-xl bg-brand-light p-3 text-sm font-bold text-brand sm:col-span-2 xl:col-span-3" role="alert">
          {errors.media}
        </p>
      )}
    </div>
  )
}

export default ProductMediaGrid
