import { USE_MOCK_DATA } from '../config/appConfig'
import { apiRequest, authenticatedApiRequest } from './api'

const mockReviews = [
  {
    id: 'rev-1',
    customerName: 'Anjali Nair',
    rating: 5,
    title: 'Classic Kerala taste in every spoon',
    comment:
      'The mango pickle tastes like it came straight from my grandmother’s kitchen. The balance of spice, salt, and tang is perfect, and the 500g pack stayed fresh for weeks.',
    productName: 'Mango Pickle',
    variantLabel: '500g',
    weightLabel: '500g',
    createdAt: '2025-04-12T08:30:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 18,
    images: ['/images/products/mango-pickle.jpg'],
  },
  {
    id: 'rev-2',
    customerName: 'Vishnu Menon',
    rating: 5,
    title: 'Lemon pickle with a clean, bright finish',
    comment:
      'I ordered the lemon pickle for lunch boxes and it has now become a weekly order. The flavour is sharp and authentic, and the oil is just right without being too heavy.',
    productName: 'Lemon Pickle',
    variantLabel: '250g',
    weightLabel: '250g',
    createdAt: '2025-05-03T12:15:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 11,
    images: [],
  },
  {
    id: 'rev-3',
    customerName: 'Suhana Raj',
    rating: 4,
    title: 'Garlic pickle that works beautifully with dosa',
    comment:
      'The garlic pickle has a deep aroma and very balanced heat. It pairs especially well with hot rice and dosa. I would definitely buy the larger pack next time.',
    productName: 'Garlic Pickle',
    variantLabel: '1kg',
    weightLabel: '1kg',
    createdAt: '2025-02-10T17:40:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 7,
    images: ['/images/products/garlic-pickle.jpg'],
  },
  {
    id: 'rev-4',
    customerName: 'Rahul Krishnan',
    rating: 5,
    title: 'Tender mango pickle is consistently excellent',
    comment:
      'I have been buying Ganesh Pickles for months and the tender mango version is my favourite. It has that homemade texture and spice profile that feels very genuine.',
    productName: 'Tender Mango Pickle',
    variantLabel: '500g',
    weightLabel: '500g',
    createdAt: '2025-06-01T10:00:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 14,
    images: [],
  },
  {
    id: 'rev-5',
    customerName: 'Meera George',
    rating: 4,
    title: 'Mixed vegetable pickle is reliable and tasty',
    comment:
      'This one has a lovely mix of vegetables and a mild spice level that suits my family. The jars are neat, and the flavour stays fresh after opening.',
    productName: 'Mixed Vegetable Pickle',
    variantLabel: '750g',
    weightLabel: '750g',
    createdAt: '2025-03-19T15:25:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 6,
    images: [],
  },
  {
    id: 'rev-6',
    customerName: 'Jithin Kumar',
    rating: 5,
    title: 'Fish pickle tastes restaurant-level',
    comment:
      'The fish pickle is carefully seasoned and the aroma is outstanding. It tastes rich and authentic, and I was impressed by the freshness of the ingredients.',
    productName: 'Fish Pickle',
    variantLabel: '500g',
    weightLabel: '500g',
    createdAt: '2025-05-17T09:05:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 17,
    images: ['/images/products/fish-pickle.jpg'],
  },
]

function normalizeReview(review) {
  return {
    ...review,
    id: review._id || review.id,
    helpfulCount: review.helpfulCount || review.helpfulUsers?.length || 0,
    customerName: review.customerName || review.user?.fullName || 'Customer',
    productName: review.productName || review.product?.name || 'Ganesh Pickles',
    variantLabel: review.variantLabel || review.weightLabel || '500g',
    verifiedPurchase: Boolean(review.verifiedPurchase),
  }
}

function getMockReviews() {
  return mockReviews.map(normalizeReview)
}

function buildSummary(reviews) {
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length
    return { stars, count, percent: reviews.length ? Math.round((count / reviews.length) * 100) : 0 }
  })

  const total = reviews.length
  const average = total ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0

  return {
    average,
    total,
    distribution,
  }
}

export async function getApprovedReviews(params = {}, auth = {}) {
  if (USE_MOCK_DATA) {
    const reviews = getMockReviews()
    const filtered = typeof params.productId === 'string' && params.productId
      ? reviews.filter((review) => review.productId === params.productId || review.productName === params.productId)
      : reviews
    return {
      success: true,
      reviews: filtered,
      summary: buildSummary(filtered),
    }
  }

  const query = typeof params.productId === 'string' && params.productId ? `/reviews/product/${encodeURIComponent(params.productId)}` : '/reviews'
  const data = await apiRequest(query, { method: 'GET' })
  return {
    ...data,
    reviews: (data?.reviews || []).map(normalizeReview),
    summary: buildSummary(data?.reviews || []),
  }
}

export async function submitReview(payload, auth = {}) {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      message: 'Review submitted successfully in frontend preview mode.',
      review: {
        ...payload,
        id: `rev-${Date.now()}`,
        customerName: auth?.user?.fullName || 'Customer',
        verifiedPurchase: true,
        helpfulCount: 0,
        createdAt: new Date().toISOString(),
      },
    }
  }

  return authenticatedApiRequest('/reviews', { method: 'POST', body: payload }, auth)
}

export async function markReviewHelpful(reviewId, auth = {}) {
  if (USE_MOCK_DATA) {
    return { success: true, message: 'Marked as helpful.' }
  }

  return authenticatedApiRequest(`/reviews/${encodeURIComponent(reviewId)}/helpful`, { method: 'PATCH' }, auth)
}

export async function reportReview(reviewId, auth = {}) {
  if (USE_MOCK_DATA) {
    return { success: true, message: 'Review reported to our moderation team.' }
  }

  return authenticatedApiRequest(`/reviews/${encodeURIComponent(reviewId)}/report`, { method: 'POST' }, auth)
}

export async function getReviewsForProduct(productId, auth = {}) {
  return getApprovedReviews({ productId }, auth)
}
