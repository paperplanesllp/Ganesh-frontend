import { useEffect, useMemo, useState } from 'react'
import RatingStars from '../reviews/RatingStars'

const FALLBACK_REVIEWS = [
  {
    id: 'fallback-anjali-nair',
    name: 'Anjali Nair',
    product: 'Mango Pickle',
    rating: 5,
    title: 'Authentic flavour that feels homemade',
    comment:
      'The mango pickle has the exact balance of spice, tang and oil that I look for. It tastes traditional and full of warmth, just like a family recipe.',
  },
  {
    id: 'fallback-vishnu-menon',
    name: 'Vishnu Menon',
    product: 'Lemon Pickle',
    rating: 5,
    title: 'Bright, clean and consistently fresh',
    comment:
      'I keep a jar stocked for school lunch boxes and quick meals. The lemon pickle is lively, premium and never overpowered by excess oil.',
  },
  {
    id: 'fallback-suhana-raj',
    name: 'Suhana Raj',
    product: 'Garlic Pickle',
    rating: 4,
    title: 'A beautiful aroma with just the right heat',
    comment:
      'The garlic pickle pairs perfectly with dosa and hot rice. It feels carefully made and the punchy flavour remains balanced throughout.',
  },
  {
    id: 'fallback-rahul-krishnan',
    name: 'Rahul Krishnan',
    product: 'Tender Mango Pickle',
    rating: 5,
    title: "My family's favourite pickle now",
    comment:
      "We've tried several brands, but this one stands out with its clean seasoning and genuine Kerala taste. Every spoon feels special.",
  },
  {
    id: 'fallback-meera-suresh',
    name: 'Meera Suresh',
    product: 'Mixed Vegetable Pickle',
    rating: 5,
    title: 'Fresh, flavourful and perfectly packed',
    comment:
      'The vegetables still have a lovely bite and the masala tastes beautifully balanced. Delivery was quick and the jar arrived safely.',
  },
]

const DEFAULT_GOOGLE_REVIEW_URL =
  'https://www.google.com/search?gs_ssp=eJzj4tVP1zc0TIk3zCs3yM4zYLRSNagwTkq0MEtJM082TjVPSjQ3tjKoSLE0MDExT0w0SjYyMDQxM_TiS0_MSy3OUCjITM7OSS0GAMYSFMk&q=ganesh+pickles&oq=ganesh+pickles&gs_lcrp=EgZjaHJvbWUqEAgAEC4YrwEYxwEYugIYgAQyEAgAEC4YrwEYxwEYugIYgAQyCggBEAAY4wIYgAQyBwgCEAAYgAQyCAgDEAAYFhgeMggIBBAAGBYYHjINCAUQABiGAxiABBiKBTINCAYQABiGAxiABBiKBTIKCAcQABiABBiiBNIBCDQxNzRqMGo3qAIUsAIB8QXWVByIpA_-9g&client=ms-android-samsung-ga-rev1&sourceid=chrome-mobile&source=chrome.ob&ie=UTF-8#ebo=0'

const CARD_ROTATIONS = [-1.6, 1.3, -1.1, 1.5]

const AVATAR_STYLES = [
  'bg-[#bde7ff] text-[#12334a]',
  'bg-[#ffd17a] text-[#4a2d00]',
  'bg-[#b9d88c] text-[#20320d]',
  'bg-[#ff9fc5] text-[#4c1128]',
]

const GOOGLE_REVIEWS_REFRESH_INTERVAL = 30 * 60 * 1000

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4.5 w-4.5 shrink-0"
      aria-hidden="true"
    >
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

function DotPattern({ className = '' }) {
  return (
    <div
      className={`grid grid-cols-5 gap-2 opacity-55 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <span
          key={index}
          className="h-1 w-1 rounded-full bg-[#222222]"
        />
      ))}
    </div>
  )
}

function getInitials(name) {
  const safeName = String(name || 'Google Customer').trim()

  return safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function normaliseRating(rating) {
  const numericRating = Number(rating)

  if (!Number.isFinite(numericRating)) {
    return 0
  }

  return Math.min(5, Math.max(0, Math.round(numericRating)))
}

function normaliseGoogleReviews(payload, fallbackGoogleUrl) {
  const responseData = payload?.data || payload
  const rawReviews = Array.isArray(responseData?.reviews)
    ? responseData.reviews
    : []

  const googleMapsUrl =
    String(responseData?.googleMapsUrl || '').trim() || fallbackGoogleUrl

  return rawReviews
    .map((review, index) => {
      const name = String(
        review?.authorName || review?.name || 'Google Customer',
      ).trim()

      const comment = String(
        review?.comment || review?.text || '',
      ).trim()

      if (!comment) {
        return null
      }

      const relativeTime = String(
        review?.relativeTime || review?.relativePublishTimeDescription || '',
      ).trim()

      const reviewUrl =
        String(review?.googleReviewUrl || review?.reviewUrl || '').trim() ||
        googleMapsUrl

      return {
        id:
          reviewUrl ||
          `google-review-${name}-${index}-${comment.slice(0, 24)}`,
        name,
        product: 'Google Review',
        rating: normaliseRating(review?.rating),
        title: relativeTime || 'Customer review on Google',
        comment,
        reviewUrl,
      }
    })
    .filter(Boolean)
}

function TestimonialSection() {
  const [startIndex, setStartIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS)

  const googleReviewUrl =
    import.meta.env.VITE_GOOGLE_REVIEW_URL?.trim() ||
    DEFAULT_GOOGLE_REVIEW_URL

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') || '/api'

  const googleReviewsEndpoint = `${apiBaseUrl}/google-reviews`

  const visibleReviews = useMemo(() => {
    if (reviews.length === 0) {
      return []
    }

    return Array.from({
      length: Math.min(4, reviews.length),
    }).map(
      (_, position) =>
        reviews[(startIndex + position) % reviews.length],
    )
  }, [reviews, startIndex])

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const loadGoogleReviews = async () => {
      try {
        const response = await fetch(googleReviewsEndpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Google reviews request failed: ${response.status}`)
        }

        const payload = await response.json()

        if (payload?.success === false) {
          throw new Error(payload?.message || 'Unable to load Google reviews')
        }

        const liveReviews = normaliseGoogleReviews(
          payload,
          googleReviewUrl,
        )

        if (isMounted && liveReviews.length > 0) {
          setReviews(liveReviews)
        }
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          import.meta.env.DEV
        ) {
          console.error('Unable to load Google reviews.')
        }
      }
    }

    loadGoogleReviews()

    const refreshIntervalId = window.setInterval(
      loadGoogleReviews,
      GOOGLE_REVIEWS_REFRESH_INTERVAL,
    )

    return () => {
      isMounted = false
      controller.abort()
      window.clearInterval(refreshIntervalId)
    }
  }, [googleReviewUrl, googleReviewsEndpoint])

  useEffect(() => {
    setStartIndex((currentIndex) =>
      reviews.length > 0 ? currentIndex % reviews.length : 0,
    )
  }, [reviews.length])

  useEffect(() => {
    if (isPaused || reviews.length <= 4) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setStartIndex(
        (currentIndex) =>
          (currentIndex + 1) % reviews.length,
      )
    }, 6000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isPaused, reviews.length])

  return (
    <section className="home-reviews-section relative isolate w-full overflow-hidden bg-[#fbfaf7] py-12 sm:py-14 lg:py-16">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-36 -top-24 h-[380px] w-[380px] rounded-full border-[38px] border-[#efeee9] opacity-80" />

        <div className="absolute -right-40 top-24 h-[430px] w-[430px] rounded-full border-[44px] border-[#f0efea] opacity-80" />

        <div className="absolute bottom-[-220px] left-[32%] h-[500px] w-[500px] rounded-full border-[50px] border-[#f1f0ec] opacity-75" />

        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.65)_42%,transparent_75%)]" />
      </div>

      <DotPattern className="absolute left-[7%] top-[8%] hidden sm:grid" />
      <DotPattern className="absolute right-[8%] top-[7%] hidden sm:grid" />
      <DotPattern className="absolute bottom-[8%] left-[6%] hidden sm:grid" />
      <DotPattern className="absolute bottom-[7%] right-[7%] hidden sm:grid" />

      <div className="mx-auto w-full max-w-[920px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-[#f5aa16]">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#bfe4f7] text-base shadow-sm">
              💬
            </span>

            <p
              className="text-2xl leading-none sm:text-3xl"
              style={{
                fontFamily:
                  "'Brush Script MT', 'Segoe Script', cursive",
              }}
            >
              What Our Customers Say
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2.5 sm:gap-3">
            <span className="text-3xl text-[#ffae1a] sm:text-4xl">
              ★
            </span>

            <h2 className="text-3xl font-black tracking-[-0.035em] text-[#171717] sm:text-4xl lg:text-5xl">
              Real Reviews, Real Love
            </h2>
          </div>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b625a]">
            Honest feedback from our valued customers who enjoy
            the traditional taste and quality of Ganesh Pickles.
          </p>
        </div>

        {/* Review cards */}
        <div
          className="mx-auto mt-9 max-w-[700px] space-y-4 sm:mt-10 sm:space-y-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {visibleReviews.map((review, index) => {
            const isYellowCard = index % 2 === 0

            return (
              <div
                key={review.id || `${review.name}-${index}`}
                className="transition-all duration-700 ease-out"
                style={{
                  transform: `rotate(${CARD_ROTATIONS[index]}deg)`,
                }}
              >
                <article
                  className={`relative overflow-hidden rounded-[22px] border px-4 py-5 shadow-[0_14px_24px_rgba(38,33,25,0.14)] transition duration-300 hover:-translate-y-1 sm:px-6 sm:py-5 ${
                    isYellowCard
                      ? 'border-[#ffbd29] bg-[#ffc43d]'
                      : 'border-white bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-[#1d1d1d] text-xs font-black ${AVATAR_STYLES[index]}`}
                      >
                        {getInitials(review.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black leading-tight text-[#191919]">
                          {review.name}
                        </h3>

                        <p className="mt-0.5 text-xs font-medium text-[#3e3a35] sm:text-sm">
                          Valued Customer
                        </p>

                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c5b17] sm:text-[11px]">
                          {review.product}
                        </p>
                      </div>
                    </div>

                    <div className="w-fit rounded-full bg-white px-3 py-1.5 shadow-[0_7px_15px_rgba(70,55,20,0.11)]">
                      <RatingStars
                        rating={review.rating}
                        size="text-base"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-base font-extrabold leading-6 text-[#1d1d1d] sm:text-lg">
                      {review.title}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#33302d]">
                      {review.comment}
                    </p>
                  </div>

                  <span
                    className={`pointer-events-none absolute -bottom-10 -right-3 text-[96px] font-black leading-none ${
                      isYellowCard
                        ? 'text-white/15'
                        : 'text-[#ffc43d]/10'
                    }`}
                    aria-hidden="true"
                  >
                    ”
                  </span>
                </article>
              </div>
            )
          })}
        </div>

        {/* Slider dots and review button */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            {reviews.map((review, index) => (
              <button
                key={`${review.id || review.name}-dot`}
                type="button"
                onClick={() => setStartIndex(index)}
                aria-label={`Show reviews starting with ${review.name}`}
                className={`rounded-full transition-all duration-300 ${
                  startIndex === index
                    ? 'h-2.5 w-8 bg-[#ffae1a]'
                    : 'h-2.5 w-2.5 bg-[#d6d1c8] hover:bg-[#bdb5a8]'
                }`}
              />
            ))}
          </div>

          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#171717] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(23,23,23,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#303030] focus:outline-none focus:ring-2 focus:ring-[#ffae1a] focus:ring-offset-2 sm:w-auto"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
              <GoogleIcon />
            </span>

            Share Your Feedback
          </a>
        </div>

        <p className="mt-7 text-center text-xs font-bold text-[#272727]">
          @Ganesh Pickles
        </p>
      </div>
    </section>
  )
}

export default TestimonialSection
