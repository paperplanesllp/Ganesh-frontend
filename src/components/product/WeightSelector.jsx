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

function WeightSelector({ variants, selectedVariant, onChange }) {
  const pouchVariants = variants.filter((variant) => variant.packageType !== 'bottle')
  const bottleVariants = variants.filter((variant) => variant.packageType === 'bottle')
  const bottleSizes = [300, 500]

  return (
    <div className="grid gap-4">
      {pouchVariants.length > 0 && (
        <VariantButtons variants={pouchVariants} selectedVariant={selectedVariant} onChange={onChange} />
      )}
      <div>
        <p className="mb-2 text-sm font-bold uppercase text-gray-600">Bottle</p>
        <div className="flex flex-wrap gap-2">
          {bottleSizes.map((grams) => {
            const variant = bottleVariants.find((item) => Number(item.grams) === grams)
            const variantId = variant?._id || variant?.id
            const selectedVariantId = selectedVariant?._id || selectedVariant?.id
            const isSelected = Boolean(variant && selectedVariantId === variantId)
            const isDisabled = !variant || variant.stock < 1

            return (
              <button
                key={grams}
                type="button"
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-default disabled:bg-white disabled:text-brand disabled:hover:bg-white ${
                  isSelected
                    ? 'border-brand bg-brand text-white'
                    : 'border-gray-200 bg-white text-brand hover:bg-brand-light'
                }`}
                onClick={() => variant && onChange(variant)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                title={!variant ? `Add the Bottle ${grams} g variant in Admin to enable this option` : undefined}
              >
                {grams} g
              </button>
            )
          })}
        </div>
      </div>
      {selectedVariant && (
        <p className="text-sm font-semibold text-gray-600">
          Selected pack: <span className="text-gray-900">{selectedVariant.label}</span>
        </p>
      )}
    </div>
  )
}

export default WeightSelector
