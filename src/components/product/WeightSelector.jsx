function VariantButtons({ variants, selectedVariant, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => {
        const variantId = variant._id || variant.id
        const selectedVariantId = selectedVariant?._id || selectedVariant?.id
        const isSelected = selectedVariantId === variantId
        const isDisabled = variant.stock < 1

        return (
          <button
            key={variantId}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isSelected
                ? 'border-brand bg-brand text-white'
                : 'border-gray-200 bg-white text-brand hover:bg-brand-light'
            }`}
            onClick={() => onChange(variant)}
            disabled={isDisabled}
            aria-pressed={isSelected}
          >
            {variant.packageType === 'bottle' ? `${variant.grams} g` : variant.label}
          </button>
        )
      })}
    </div>
  )
}

function WeightSelector({ variants, selectedVariant, onChange, showBottleOptions = false }) {
  const bottleSizes = [300, 500]
  const isBottleVariant = (variant) =>
    variant.packageType === 'bottle' || (
      showBottleOptions && !variant.packageType && bottleSizes.includes(Number(variant.grams))
    )
  const pouchVariants = variants.filter((variant) => !isBottleVariant(variant))
  const bottleVariants = [...new Map(
    variants
      .filter(isBottleVariant)
      .map((variant) => [Number(variant.grams), variant]),
  ).values()]
    .map((variant) => ({
      ...variant,
      packageType: 'bottle',
      label: `Bottle ${variant.grams} g`,
    }))

  return (
    <div className="grid gap-4">
      {pouchVariants.length > 0 && (
        <div>
          {showBottleOptions && <p className="mb-2 text-sm font-bold uppercase text-gray-600">Pouch</p>}
          <VariantButtons variants={pouchVariants} selectedVariant={selectedVariant} onChange={onChange} />
        </div>
      )}
      {showBottleOptions && bottleVariants.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold uppercase text-gray-600">Bottle</p>
          <VariantButtons variants={bottleVariants} selectedVariant={selectedVariant} onChange={onChange} />
        </div>
      )}
      {selectedVariant && (
        <p className="text-sm font-semibold text-gray-600">
          Selected pack: <span className="text-gray-900">{selectedVariant.label}</span>
        </p>
      )}
    </div>
  )
}

export default WeightSelector
