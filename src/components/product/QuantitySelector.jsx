function QuantitySelector({ value, onChange, max = Infinity, min = 1, compact = false }) {
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : min
  const numericMin = Number.isFinite(Number(min)) ? Number(min) : 1
  const numericMax = Number.isFinite(Number(max)) ? Number(max) : Infinity
  const buttonSize = compact ? 'h-9 w-9' : 'h-11 w-11'
  const canDecrease = numericValue > numericMin
  const canIncrease = numericValue < numericMax

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-200 bg-white">
      <button
        type="button"
        className={`${buttonSize} font-bold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-inset disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={() => onChange(Math.max(numericMin, numericValue - 1))}
        aria-label="Decrease quantity"
        disabled={!canDecrease}
      >
        -
      </button>
      <span className="grid min-w-10 place-items-center px-2 text-sm font-bold text-gray-900">
        {numericValue}
      </span>
      <button
        type="button"
        className={`${buttonSize} font-bold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-inset disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={() => onChange(Math.min(numericMax, numericValue + 1))}
        aria-label="Increase quantity"
        disabled={!canIncrease}
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector
