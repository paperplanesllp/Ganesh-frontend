function RatingStars({ rating = 0, size = 'text-base', showValue = false }) {
  const roundedRating = Math.max(0, Math.min(5, Number(rating) || 0))
  const starArray = Array.from({ length: 5 }, (_, index) => index < Math.round(roundedRating))

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1 text-amber-500" aria-label={`${roundedRating} out of 5 stars`}>
        {starArray.map((filled, index) => (
          <span
            key={`${filled}-${index}`}
            className={`${size} ${filled ? 'text-amber-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
      {showValue && <span className="ml-1 text-sm font-semibold text-gray-700">{roundedRating.toFixed(1)}</span>}
    </div>
  )
}

export default RatingStars
