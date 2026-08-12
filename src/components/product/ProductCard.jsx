import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/currency'
import { getCheapestActiveInStockVariant } from '../../utils/localProductCatalog'
import { getPrimaryProductImage, getPrimaryProductImageAlt } from '../../utils/productImages'

function ProductImage({ src, alt }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (!src || hasError) {
    return (
      <div className="grid aspect-square w-full place-items-center bg-brand-light text-brand sm:aspect-[4/3]">
        <svg className="h-16 w-16" viewBox="0 0 64 64" role="img" aria-label="Product image unavailable">
          <rect x="14" y="18" width="36" height="34" rx="8" fill="white" stroke="currentColor" strokeWidth="3" />
          <path d="M24 18c0-6 16-6 16 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
          <circle cx="31" cy="35" r="8" fill="currentColor" opacity="0.18" />
          <path d="M26 35h10" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="aspect-square w-full object-contain p-3 transition duration-300 hover:scale-[1.03] sm:aspect-[4/3]"
      onError={() => setHasError(true)}
    />
  )
}

function ProductCard({ product }) {
  const selectedVariant = useMemo(() => getCheapestActiveInStockVariant(product), [product])
  const lowestPrice = selectedVariant?.price || product.startingPrice || Math.min(...(product.variants || []).map((variant) => variant.price))
  const hasStock = product.inStock && product.variants?.some((variant) => variant.stock > 0)
  const productImage = getPrimaryProductImage(product)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Link to={`/products/${product.slug}`} className="block overflow-hidden bg-brand-light">
        <ProductImage src={productImage} alt={getPrimaryProductImageAlt(product)} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase text-brand">
            {product.spiceLevel}
          </span>
          <span
            className={`text-sm font-semibold ${hasStock ? 'text-brand' : 'text-brand'}`}
          >
            {hasStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>
        <Link
          to={`/products/${product.slug}`}
          className="rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          <h2 className="break-words font-[Georgia,serif] text-xl font-bold leading-snug text-brand-dark">{product.name}</h2>
        </Link>
        <p className="product-card-description mt-2 flex-1 text-gray-600">{product.shortDescription}</p>
        <div className="mt-5 text-sm">
          <span className="font-semibold text-gray-900">
            From <span className="text-lg font-bold text-brand-dark">{formatCurrency(lowestPrice)}</span>
          </span>
        </div>
        <Link
          to={`/products/${product.slug}`}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          View Product
        </Link>
      </div>
    </article>
  )
}

export default ProductCard
