import RatingStars from './RatingStars'

function formatReviewDate(value) {
  if (!value) return 'Recently'
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function getInitials(name = 'Customer') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'CP'
}

function ReviewCard({ review, onHelpful, onReport }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-light text-sm font-bold text-brand">
          {getInitials(review.customerName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">{review.customerName}</h3>
                {review.verifiedPurchase && (
                  <span className="rounded-full bg-brand-light px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
                    Verified Purchase
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600">
                <RatingStars rating={review.rating} size="text-sm" />
                <span>{formatReviewDate(review.createdAt)}</span>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700">
              {review.productName}
            </div>
          </div>

          <div className="mt-3 text-xs font-semibold text-gray-600">
            {review.variantLabel || 'Standard pack'} · {review.weightLabel || '500g'}
          </div>

          <h4 className="mt-3 text-lg font-bold text-brand-dark">{review.title}</h4>
          <p className="mt-2 text-sm leading-7 text-gray-700">{review.comment}</p>

          {review.images?.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {review.images.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${review.productName} review ${index + 1}`}
                  className="h-40 w-full rounded-xl border border-gray-200 bg-gray-50 object-cover"
                />
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              className="rounded-full border border-gray-200 px-3 py-2 font-semibold text-brand transition duration-200 hover:bg-brand-light hover:text-brand-dark"
              onClick={() => onHelpful?.(review.id)}
            >
              Helpful · {review.helpfulCount || 0}
            </button>
            <button
              type="button"
              className="rounded-full border border-gray-200 px-3 py-2 font-semibold text-gray-700 transition duration-200 hover:bg-gray-100"
              onClick={() => onReport?.(review.id)}
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ReviewCard
