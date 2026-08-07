import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import WriteReviewModal from '../components/reviews/WriteReviewModal'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import {
  getApprovedReviews,
  markReviewHelpful,
  reportReview,
  submitReview,
} from '../services/reviewService'
import { getMyOrders } from '../services/orderService'

const AUTO_ROTATE_DELAY = 4500
const LIVE_REFRESH_DELAY = 30000
const VISIBLE_REVIEW_COUNT = 4

const DEMO_PRODUCTS = [
  { id: 'mango-pickle', name: 'Mango Pickle' },
  { id: 'lemon-pickle', name: 'Lemon Pickle' },
  { id: 'garlic-pickle', name: 'Garlic Pickle' },
  { id: 'tender-mango-pickle', name: 'Tender Mango Pickle' },
  { id: 'mixed-vegetable-pickle', name: 'Mixed Vegetable Pickle' },
  { id: 'fish-pickle', name: 'Fish Pickle' },
]

const CARD_STYLES = [
  {
    wrapper: 'lg:ml-3 lg:mr-16 lg:-rotate-[1.5deg]',
    card: 'bg-[#ffbd2e] text-[#171717]',
    avatar: 'bg-[#fff4d7] text-[#9a5700]',
    rating: 'bg-white text-[#f3a400]',
    meta: 'text-black/65',
    border: 'border-[#efaa13]',
  },
  {
    wrapper: 'lg:ml-14 lg:mr-2 lg:rotate-[1.4deg]',
    card: 'bg-white text-[#171717]',
    avatar: 'bg-[#ffd374] text-[#7b4300]',
    rating: 'bg-white text-[#f3a400] shadow-[0_12px_24px_rgba(28,20,10,0.12)]',
    meta: 'text-black/60',
    border: 'border-[#eee8df]',
  },
  {
    wrapper: 'lg:ml-4 lg:mr-14 lg:-rotate-[1.2deg]',
    card: 'bg-[#ffbd2e] text-[#171717]',
    avatar: 'bg-[#e8f1c9] text-[#4d5d16]',
    rating: 'bg-white text-[#f3a400]',
    meta: 'text-black/65',
    border: 'border-[#efaa13]',
  },
  {
    wrapper: 'lg:ml-12 lg:mr-4 lg:rotate-[1.2deg]',
    card: 'bg-white text-[#171717]',
    avatar: 'bg-[#c7efff] text-[#006789]',
    rating: 'bg-white text-[#f3a400] shadow-[0_12px_24px_rgba(28,20,10,0.12)]',
    meta: 'text-black/60',
    border: 'border-[#eee8df]',
  },
]

function getReviewId(review, index = 0) {
  return review?.id || review?._id || `review-${index}`
}

function getReviewerName(review) {
  return (
    review?.customerName ||
    review?.userName ||
    review?.name ||
    review?.user?.name ||
    'Valued Customer'
  )
}

function getProductName(review) {
  return (
    review?.productName ||
    review?.product?.name ||
    review?.productTitle ||
    'Ganesh Pickles'
  )
}

function getReviewContent(review) {
  return (
    review?.comment ||
    review?.review ||
    review?.content ||
    review?.description ||
    'Thank you for sharing your experience with Ganesh Pickles.'
  )
}

function getRating(review) {
  const rating = Number(review?.rating || 0)

  if (Number.isNaN(rating)) return 0

  return Math.min(5, Math.max(0, rating))
}

function getInitials(name) {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return 'VC'

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

function formatReviewDate(value) {
  if (!value) return 'Recently'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Recently'

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function StarIcon({ filled = true, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 2.75 2.79 5.65 6.24.91-4.51 4.4 1.06 6.21L12 17l-5.58 2.92 1.06-6.21-4.51-4.4 6.24-.91L12 2.75Z"
      />
    </svg>
  )
}

function StarRating({ rating, compact = false }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= Math.round(rating)
              ? 'text-[#f3a400]'
              : 'text-[#ddd6ca]'
          }
        >
          <StarIcon
            filled={star <= Math.round(rating)}
            className={compact ? 'h-4 w-4' : 'h-5 w-5 sm:h-6 sm:w-6'}
          />
        </span>
      ))}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-1.99 3.02v2.54h3.23c1.89-1.74 2.98-4.3 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.36l-3.23-2.54c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.08v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.93A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.93V7.45H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.55l3.33-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.92 5.45l3.33 2.62C7.2 7.71 9.4 5.95 12 5.95Z"
      />
    </svg>
  )
}

function DecorativeDots({ className = '' }) {
  return (
    <div
      className={`grid grid-cols-5 gap-1.5 opacity-45 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 15 }).map((_, index) => (
        <span key={index} className="h-1 w-1 rounded-full bg-[#171717]" />
      ))}
    </div>
  )
}

function ReviewCard({ review, index, onHelpful, onReport }) {
  const style = CARD_STYLES[index % CARD_STYLES.length]
  const reviewId = getReviewId(review, index)
  const reviewerName = getReviewerName(review)

  return (
    <article
      className={`relative transition-all duration-500 ${style.wrapper}`}
    >
      <div
        className={`relative overflow-hidden rounded-[26px] border px-5 py-5 shadow-[0_22px_35px_rgba(44,33,20,0.16)] sm:px-7 sm:py-6 ${style.card} ${style.border}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-black/75 text-sm font-black ${style.avatar}`}
            >
              {getInitials(reviewerName)}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-black leading-tight sm:text-xl">
                {reviewerName}
              </h2>
              <p className={`text-sm font-medium ${style.meta}`}>
                Valued Customer
              </p>
            </div>
          </div>

          <div
            className={`w-fit rounded-full px-4 py-2 ${style.rating}`}
          >
            <StarRating rating={getRating(review)} compact />
          </div>
        </div>

        <p className="mt-5 text-base font-medium leading-7 sm:text-lg sm:leading-8">
          {getReviewContent(review)}
        </p>

        <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex flex-wrap items-center gap-2 text-xs font-bold ${style.meta}`}>
            <span>{getProductName(review)}</span>
            <span aria-hidden="true">•</span>
            <span>{formatReviewDate(review?.createdAt)}</span>
            {review?.verifiedPurchase && (
              <>
                <span aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                  Verified purchase
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onHelpful(reviewId)}
              className="rounded-full px-3 py-1.5 text-xs font-black text-black/60 transition hover:bg-black/5 hover:text-black"
            >
              Helpful {Number(review?.helpfulCount || 0)}
            </button>
            <button
              type="button"
              onClick={() => onReport(reviewId)}
              className="rounded-full px-3 py-1.5 text-xs font-black text-black/45 transition hover:bg-red-50 hover:text-red-700"
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [products] = useState(DEMO_PRODUCTS)
  const [startIndex, setStartIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isCheckingOrders, setIsCheckingOrders] = useState(false)
  const [orderedProductNames, setOrderedProductNames] = useState([])

  const touchStartX = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, accessToken, user } = useAuth()
  const { showToast } = useCart()

  const googleReviewUrl =
    import.meta.env.VITE_GOOGLE_REVIEW_URL?.trim() || ''

  const loadReviews = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true)
      setError('')
    }

    try {
      const data = await getApprovedReviews()
      const nextReviews = Array.isArray(data?.reviews) ? data.reviews : []

      setReviews(nextReviews)
      setStartIndex((current) =>
        nextReviews.length === 0 ? 0 : current % nextReviews.length,
      )
      setError('')
    } catch {
      if (!silent) {
        setError('We could not load customer feedback. Please try again.')
      }
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [])

  const checkPurchasedProducts = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      setOrderedProductNames([])
      return
    }

    setIsCheckingOrders(true)

    try {
      const data = await getMyOrders({
        accessToken,
        refreshSession: undefined,
      })

      const productNames = (data?.orders || []).flatMap((order) =>
        (order?.products || [])
          .map((product) => product?.productName)
          .filter(Boolean),
      )

      setOrderedProductNames([...new Set(productNames)])
    } catch {
      setOrderedProductNames([])
    } finally {
      setIsCheckingOrders(false)
    }
  }, [accessToken, isAuthenticated])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  useEffect(() => {
    checkPurchasedProducts()
  }, [checkPurchasedProducts])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadReviews({ silent: true })
    }, LIVE_REFRESH_DELAY)

    return () => window.clearInterval(intervalId)
  }, [loadReviews])

  useEffect(() => {
    const shouldPause =
      !isAutoPlaying ||
      isLoading ||
      Boolean(error) ||
      isReviewModalOpen ||
      reviews.length <= 1

    if (shouldPause) return undefined

    const intervalId = window.setInterval(() => {
      setStartIndex((current) => (current + 1) % reviews.length)
    }, AUTO_ROTATE_DELAY)

    return () => window.clearInterval(intervalId)
  }, [error, isAutoPlaying, isLoading, isReviewModalOpen, reviews.length])

  const visibleReviews = useMemo(() => {
    if (reviews.length === 0) return []

    const count = Math.min(VISIBLE_REVIEW_COUNT, reviews.length)

    return Array.from({ length: count }, (_, offset) => {
      const index = (startIndex + offset) % reviews.length
      return reviews[index]
    })
  }, [reviews, startIndex])

  const summary = useMemo(() => {
    if (reviews.length === 0) return { average: 0, total: 0 }

    const totalRating = reviews.reduce(
      (total, review) => total + getRating(review),
      0,
    )

    return {
      average: totalRating / reviews.length,
      total: reviews.length,
    }
  }, [reviews])

  const handlePrevious = () => {
    if (reviews.length <= 1) return

    setStartIndex((current) =>
      current === 0 ? reviews.length - 1 : current - 1,
    )
  }

  const handleNext = () => {
    if (reviews.length <= 1) return

    setStartIndex((current) => (current + 1) % reviews.length)
  }

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    setIsAutoPlaying(false)
  }

  const handleTouchEnd = (event) => {
    const startX = touchStartX.current
    const endX = event.changedTouches[0]?.clientX

    touchStartX.current = null
    setIsAutoPlaying(true)

    if (typeof startX !== 'number' || typeof endX !== 'number') return

    const distance = startX - endX

    if (Math.abs(distance) < 45) return

    if (distance > 0) handleNext()
    else handlePrevious()
  }

  const handleGoogleReviewClick = (event) => {
    if (googleReviewUrl) return

    event.preventDefault()
    showToast(
      'Add VITE_GOOGLE_REVIEW_URL to your frontend .env file.',
      'error',
    )
  }

  const handleOpenReviewModal = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location.pathname,
          message: 'Please sign in to write a review.',
        },
      })
      return
    }

    if (isCheckingOrders) {
      showToast('Checking your completed orders. Please wait.', 'info')
      return
    }

    if (orderedProductNames.length === 0) {
      showToast(
        'Only customers with an order can submit a website review.',
        'info',
      )
      return
    }

    setSubmitMessage('')
    setIsReviewModalOpen(true)
  }

  const handleReviewSubmit = async (payload) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location.pathname,
          message: 'Please sign in to write a review.',
        },
      })
      return
    }

    const selectedProduct = products.find(
      (product) => product.id === payload?.productId,
    )

    if (
      !selectedProduct ||
      !orderedProductNames.includes(selectedProduct.name)
    ) {
      showToast('You can only review products you have ordered.', 'error')
      return
    }

    setIsSubmittingReview(true)
    setSubmitMessage('')

    try {
      const response = await submitReview(
        {
          ...payload,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          verifiedPurchase: true,
        },
        { user, accessToken },
      )

      const message =
        response?.message ||
        'Review submitted successfully. It will appear after moderation.'

      setSubmitMessage(message)
      showToast('Review submitted successfully.', 'success')

      window.setTimeout(() => {
        setIsReviewModalOpen(false)
        setSubmitMessage('')
        loadReviews()
      }, 900)
    } catch (submitError) {
      const message =
        submitError?.message || 'We could not submit your review.'

      setSubmitMessage(message)
      showToast(message, 'error')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      showToast('Please sign in to mark a review as helpful.', 'info')
      return
    }

    try {
      await markReviewHelpful(reviewId, { user, accessToken })

      setReviews((currentReviews) =>
        currentReviews.map((review, index) =>
          getReviewId(review, index) === reviewId
            ? {
                ...review,
                helpfulCount: Number(review?.helpfulCount || 0) + 1,
              }
            : review,
        ),
      )

      showToast('Marked as helpful.', 'success')
    } catch {
      showToast('Could not mark this review as helpful.', 'error')
    }
  }

  const handleReport = async (reviewId) => {
    if (!isAuthenticated) {
      showToast('Please sign in to report a review.', 'info')
      return
    }

    try {
      await reportReview(reviewId, { user, accessToken })
      showToast('Review reported to our moderation team.', 'info')
    } catch {
      showToast('Could not report this review.', 'error')
    }
  }

  return (
    <>
      <main
        className="reviews-page relative min-h-screen overflow-hidden bg-[#f7f4ee] px-4 py-10 text-[#171717] sm:px-6 lg:px-8 lg:py-16"
        style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-44 top-10 h-[520px] w-[520px] rounded-full border-[70px] border-white/45" />
          <div className="absolute -right-56 top-1/3 h-[620px] w-[620px] rounded-full border-[86px] border-white/50" />
          <div className="absolute left-1/3 top-0 h-[420px] w-[420px] rounded-full border-[64px] border-white/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),transparent_55%)]" />
        </div>

        <DecorativeDots className="absolute left-5 top-24 sm:left-12" />
        <DecorativeDots className="absolute right-5 top-20 sm:right-12" />
        <DecorativeDots className="absolute bottom-20 left-5 sm:left-12" />
        <DecorativeDots className="absolute bottom-16 right-5 sm:right-12" />

        <section className="relative mx-auto w-full max-w-5xl">
          <header className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#bde7f8] text-[#267b9a] shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm4 5.75A1.25 1.25 0 1 0 8 12.25a1.25 1.25 0 0 0 0-2.5Zm4 0A1.25 1.25 0 1 0 12 12.25a1.25 1.25 0 0 0 0-2.5Zm4 0A1.25 1.25 0 1 0 16 12.25a1.25 1.25 0 0 0 0-2.5Z" />
                </svg>
              </span>

              <p
                className="text-3xl leading-none text-[#dd9d07] sm:text-4xl lg:text-5xl"
                style={{ fontFamily: '"Brush Script MT", cursive' }}
              >
                What Our Customers Say
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4">
              <StarIcon className="h-9 w-9 shrink-0 text-[#f5a400] sm:h-12 sm:w-12" />
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Real Reviews, Real Love
              </h1>
            </div>

            <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-black/60 sm:text-base">
              Honest feedback from our valuable customers who enjoy the
              traditional taste of Ganesh Pickles.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/90 px-5 py-3 shadow-sm">
                <span className="text-2xl font-black">
                  {summary.average.toFixed(1)}
                </span>
                <StarRating rating={summary.average} compact />
                <span className="text-sm font-bold text-black/50">
                  {summary.total} reviews
                </span>
              </div>

              <button
                type="button"
                onClick={handleOpenReviewModal}
                disabled={isCheckingOrders}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-sm font-black text-white shadow-[0_14px_26px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCheckingOrders ? 'Checking Orders...' : 'Write a Review'}
              </button>
            </div>
          </header>

          <div
            className="relative mt-12 space-y-5 sm:mt-14 sm:space-y-6"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onFocusCapture={() => setIsAutoPlaying(false)}
            onBlurCapture={() => setIsAutoPlaying(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {isLoading ? (
              <div className="space-y-5">
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-48 animate-pulse rounded-[26px] border border-black/5 bg-white/75 shadow-sm"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-12 text-center shadow-sm">
                <h2 className="text-2xl font-black text-red-800">
                  Feedback is unavailable
                </h2>
                <p className="mt-3 text-sm font-medium text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => loadReviews()}
                  className="mt-6 rounded-full bg-red-700 px-6 py-3 text-sm font-black text-white transition hover:bg-red-800"
                >
                  Try Again
                </button>
              </div>
            ) : visibleReviews.length === 0 ? (
              <div className="rounded-[28px] border-2 border-dashed border-[#e0d8cb] bg-white/75 px-6 py-14 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0c6] text-[#e99c00]">
                  <StarIcon className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-2xl font-black">
                  Be the first valuable customer to review us
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-black/55">
                  Approved customer feedback will appear here automatically.
                </p>
                <button
                  type="button"
                  onClick={handleOpenReviewModal}
                  className="mt-6 rounded-full bg-[#ffb617] px-6 py-3 text-sm font-black text-black transition hover:bg-[#f3a900]"
                >
                  Write the First Review
                </button>
              </div>
            ) : (
              visibleReviews.map((review, index) => (
                <ReviewCard
                  key={`${getReviewId(review, index)}-${startIndex}`}
                  review={review}
                  index={index}
                  onHelpful={handleHelpful}
                  onReport={handleReport}
                />
              ))
            )}
          </div>

          {reviews.length > 1 && !isLoading && !error && (
            <div className="mt-10 flex flex-col items-center justify-between gap-5 sm:flex-row">
              <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1">
                {reviews.map((review, index) => (
                  <button
                    key={`dot-${getReviewId(review, index)}`}
                    type="button"
                    onClick={() => setStartIndex(index)}
                    aria-label={`Show review ${index + 1}`}
                    className={`shrink-0 rounded-full transition-all duration-300 ${
                      index === startIndex
                        ? 'h-2.5 w-9 bg-[#ffb617]'
                        : 'h-2.5 w-2.5 bg-black/20 hover:bg-black/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label="Previous reviews"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition hover:-translate-y-0.5 hover:border-black/25"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15 18-6-6 6-6"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next reviews"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffb617] text-black shadow-[0_12px_24px_rgba(243,164,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#f0a900]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 18 6-6-6-6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <footer className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-black/10 pt-7 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-black">Ganesh Pickles</p>
              <p className="mt-1 text-xs font-medium text-black/45">
                Every review comes from one of our valuable customers.
              </p>
            </div>

            <a
              href={googleReviewUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGoogleReviewClick}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-black/20"
            >
              <GoogleIcon />
              Review on Google
            </a>
          </footer>
        </section>
      </main>

      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          if (!isSubmittingReview) {
            setIsReviewModalOpen(false)
            setSubmitMessage('')
          }
        }}
        onSubmit={handleReviewSubmit}
        products={products}
        isSubmitting={isSubmittingReview}
        submitMessage={submitMessage}
      />
    </>
  )
}

export default ReviewsPage
