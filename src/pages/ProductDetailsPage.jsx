import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import QuantitySelector from '../components/product/QuantitySelector'
import RelatedProducts from '../components/product/RelatedProducts'
import WeightSelector from '../components/product/WeightSelector'
import { useCart } from '../context/CartContext'
import { useProductData } from '../context/ProductDataContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'
import { getPrimaryProductImage, getProductGalleryImages, resolveProductImage } from '../utils/productImages'
import { getProductId, getVariantId } from '../utils/localProductCatalog'
import { AUTH_ACTIONS, saveAuthIntent } from '../utils/authIntent'

const RECENTLY_VIEWED_KEY = 'ganesh_pickles_recently_viewed_products'

function getFirstAvailableVariant(product) {
  return product?.variants.find((variant) => variant.isActive !== false && variant.stock > 0) || product?.variants[0] || null
}

function readRecentlyViewed() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((slug) => typeof slug === 'string') : []
  } catch {
    window.localStorage.removeItem(RECENTLY_VIEWED_KEY)
    return []
  }
}

function ProductDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { activeProducts } = useProductData()
  const product = useMemo(() => activeProducts.find((item) => item.slug === slug) || null, [activeProducts, slug])
  const relatedProducts = useMemo(() => {
    if (!product) return []
    const currentTags = new Set([product.category, product.spiceLevel, product.flavour, ...(product.tags || [])].filter(Boolean))
    return activeProducts
      .filter((item) => item.slug !== product.slug)
      .map((item) => ({
        product: item,
        score: [item.category, item.spiceLevel, item.flavour, ...(item.tags || [])].filter((tag) => currentTags.has(tag)).length,
      }))
      .sort((a, b) => b.score - a.score || Number(b.product.bestseller) - Number(a.product.bestseller))
      .slice(0, 4)
      .map((item) => item.product)
  }, [activeProducts, product])
  const recentlyViewedProducts = useMemo(() => {
    if (!product) return []
    return readRecentlyViewed()
      .filter((recentSlug) => recentSlug !== product.slug)
      .map((recentSlug) => activeProducts.find((item) => item.slug === recentSlug))
      .filter(Boolean)
      .slice(0, 4)
  }, [activeProducts, product])
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    setSelectedVariant(getFirstAvailableVariant(product))
    setSelectedImage(product ? getPrimaryProductImage(product) : '')
    setQuantity(1)
  }, [product])

  useEffect(() => {
    if (!product) return

    const nextSlugs = [product.slug, ...readRecentlyViewed().filter((recentSlug) => recentSlug !== product.slug)].slice(0, 8)
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(nextSlugs))
  }, [product])

  useEffect(() => {
    if (selectedVariant && quantity > selectedVariant.stock) {
      setQuantity(Math.max(1, selectedVariant.stock))
    }
  }, [quantity, selectedVariant])

  const productImages = useMemo(() => {
    if (!product) return []
    return getProductGalleryImages(product)
  }, [product])
  const hasProductImage = productImages.length > 0

  if (!product) {
    return (
      <section className="bg-white py-16">
        <EmptyState
          title="Product not found"
          message="This pickle jar is not in the current local catalog."
          actionLabel="Back to products"
          actionTo="/products"
        />
      </section>
    )
  }

  const isAvailable = product.inStock && selectedVariant?.stock > 0
  const selectedPrice = selectedVariant ? selectedVariant.price * quantity : 0
  const selectedOriginalPrice = selectedVariant?.originalPrice ? selectedVariant.originalPrice * quantity : 0
  const discountPercent =
    selectedVariant?.originalPrice && selectedVariant.originalPrice > selectedVariant.price
      ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
      : 0

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant)
    setSelectedImage(variant.image || getPrimaryProductImage(product))
    setQuantity((currentQuantity) => Math.min(currentQuantity, Math.max(1, variant.stock)))
  }

  const handleAddToCart = () => {
    if (!isAvailable) return
    addToCart(product, selectedVariant, quantity)
  }

  const handleBuyNow = () => {
    if (!isAvailable) return

    if (!isAuthenticated) {
      const returnTo = `${location.pathname}${location.search}`
      saveAuthIntent({
        action: AUTH_ACTIONS.BUY_NOW,
        returnTo,
        productId: getProductId(product),
        variantId: getVariantId(selectedVariant),
        selectedVariant: {
          id: getVariantId(selectedVariant),
          label: selectedVariant.label,
          grams: selectedVariant.grams,
        },
        quantity,
      })
      navigate('/login', {
        state: { from: returnTo, message: 'Please log in to continue to checkout.' },
      })
      return
    }

    const wasAdded = addToCart(product, selectedVariant, quantity)
    if (wasAdded) navigate('/checkout')
  }

  return (
    <>
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="text-sm font-bold text-brand transition duration-200 hover:text-brand-dark">
            Back to products
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-brand-light">
                {hasProductImage ? (
                  <img
                    src={resolveProductImage(selectedImage || getPrimaryProductImage(product))}
                    alt={product.name}
                    className="aspect-square h-full w-full object-cover sm:h-[420px] lg:h-[520px]"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center px-6 text-center text-sm font-semibold text-gray-500 sm:h-[420px] lg:h-[520px]">
                    Product image coming soon
                  </div>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image) => (
                    <button
                      key={image.url}
                      type="button"
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-brand-light transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                        selectedImage === image.src ? 'border-brand' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImage(image.src)}
                    >
                      <img src={image.src} alt={image.alt} className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="self-center">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-bold uppercase text-brand">
                  {product.category}
                </span>
                <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-bold text-brand">
                  Spice: {product.spiceLevel}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    isAvailable ? 'bg-brand-light text-brand' : 'bg-brand text-white'
                  }`}
                >
                  {isAvailable ? 'In stock' : 'Out of stock'}
                </span>
              </div>

              <h1 className="mt-4 font-[Georgia,serif] text-3xl font-bold text-brand-dark sm:text-4xl md:text-5xl">
                {product.name}
              </h1>
              {Number(product.reviewCount) > 0 && (
                <p className="mt-3 text-sm font-semibold text-gray-600">
                  {product.rating} rating ({product.reviewCount} reviews)
                </p>
              )}
              <p className="mt-5 leading-8 text-gray-600">{product.description}</p>

              <div className="mt-7 grid gap-4">
                <div>
                  <p className="mb-2 text-sm font-bold uppercase text-gray-600">Weight</p>
                  <WeightSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onChange={handleVariantChange}
                    showBottleOptions={product.category === 'Pickles'}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold uppercase text-gray-600">Quantity</p>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    max={selectedVariant?.stock || 1}
                  />
                </div>
              </div>

              <div className="mt-7">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-bold text-brand-dark">
                    {selectedVariant ? formatCurrency(selectedPrice) : 'Unavailable'}
                  </span>
                  {discountPercent > 0 && (
                    <>
                      <span className="pb-1 text-lg font-semibold text-gray-600 line-through">
                        {formatCurrency(selectedOriginalPrice)}
                      </span>
                      <span className="pb-1 text-sm font-bold text-brand">{discountPercent}% off</span>
                    </>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {isAvailable ? 'Price updates with selected quantity.' : 'This product is currently out of stock.'}
                </p>
              </div>

              <div className="mt-7 grid gap-3 min-[380px]:grid-cols-2 sm:flex sm:flex-wrap">
                <button
                  type="button"
                  className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-600"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="rounded-full border border-brand bg-white px-6 py-3 font-semibold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-600"
                  onClick={handleBuyNow}
                  disabled={!isAvailable}
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
      <RelatedProducts products={relatedProducts} />
      <RelatedProducts products={recentlyViewedProducts} eyebrow="Recently viewed" title="Pickles You Viewed" />
    </>
  )
}

export default ProductDetailsPage
