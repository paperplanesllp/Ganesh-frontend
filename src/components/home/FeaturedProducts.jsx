import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { useProductData } from '../../context/ProductDataContext'
import { sortProducts } from '../../utils/localProductCatalog'
import ProductGrid from '../product/ProductGrid'

const AUTO_SLIDE_DELAY = 3000
const SLIDE_TRANSITION_DURATION = 700

function getProductsPerSlide() {
  if (typeof window === 'undefined') return 4

  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2

  return 4
}

function splitProducts(products, productsPerSlide) {
  const slides = []

  for (
    let index = 0;
    index < products.length;
    index += productsPerSlide
  ) {
    slides.push(
      products.slice(index, index + productsPerSlide),
    )
  }

  return slides
}

function AutoMovingProducts({ products }) {
  const [productsPerSlide, setProductsPerSlide] = useState(
    getProductsPerSlide,
  )
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [transitionEnabled, setTransitionEnabled] =
    useState(true)

  useEffect(() => {
    const handleResize = () => {
      setProductsPerSlide(getProductsPerSlide())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const slides = useMemo(
    () => splitProducts(products, productsPerSlide),
    [products, productsPerSlide],
  )

  const hasMultipleSlides = slides.length > 1

  const displaySlides = useMemo(() => {
    if (!hasMultipleSlides) return slides

    // Duplicate the first slide at the end for a smooth loop.
    return [...slides, slides[0]]
  }, [hasMultipleSlides, slides])

  useEffect(() => {
    setTransitionEnabled(false)
    setActiveSlide(0)

    const frameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransitionEnabled(true)
      })
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [products.length, productsPerSlide])

  useEffect(() => {
    if (
      isPaused ||
      !hasMultipleSlides ||
      slides.length === 0
    ) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (
        currentSlide < slides.length
          ? currentSlide + 1
          : currentSlide
      ))
    }, AUTO_SLIDE_DELAY)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [
    hasMultipleSlides,
    isPaused,
    slides.length,
  ])

  const resetToFirstSlide = useCallback(() => {
    if (activeSlide !== slides.length) return

    setTransitionEnabled(false)
    setActiveSlide(0)

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransitionEnabled(true)
      })
    })
  }, [activeSlide, slides.length])

  useEffect(() => {
    if (activeSlide !== slides.length) return undefined

    // Keep the loop working even if the browser misses transitionend,
    // for example after switching tabs or during a resize.
    const fallbackId = window.setTimeout(
      resetToFirstSlide,
      SLIDE_TRANSITION_DURATION + 100,
    )

    return () => window.clearTimeout(fallbackId)
  }, [activeSlide, resetToFirstSlide, slides.length])

  const handleTransitionEnd = (event) => {
    // Ignore transition events bubbling from buttons/cards inside the track.
    if (event.target !== event.currentTarget) return
    resetToFirstSlide()
  }

  if (products.length === 0) return null

  return (
    <div
      className="w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex w-full ${
          transitionEnabled
            ? 'transition-transform duration-700 ease-in-out'
            : ''
        }`}
        style={{
          transform: `translateX(-${activeSlide * 100}%)`,
        }}
      >
        {displaySlides.map((slideProducts, slideIndex) => (
          <div
            key={`our-products-slide-${slideIndex}`}
            className="w-full shrink-0"
          >
            <ProductGrid products={slideProducts} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductSection({ section }) {
  if (section.products.length === 0) return null

  return (
    <div className="mt-12 first:mt-0">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase text-black">
            {section.eyebrow}
          </p>

          <h2 className="font-[Georgia,serif] text-3xl font-bold text-black">
            {section.title}
          </h2>
        </div>

        <Link
          to="/products"
          className="inline-flex rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          View All Products
        </Link>
      </div>

      {section.autoMove ? (
        <AutoMovingProducts products={section.products} />
      ) : (
        <ProductGrid products={section.products} />
      )}
    </div>
  )
}

function FeaturedProducts() {
  const { activeProducts } = useProductData()

  const sections = [
    {
      key: 'bestsellers',
      eyebrow: 'Most loved',
      title: 'Best Sellers',
      products: sortProducts(
        activeProducts.filter(
          (product) => product.bestseller === true,
        ),
        'popularity',
      ).slice(0, 4),
    },

    {
      key: 'pickles',
      eyebrow: 'Traditional favorites',
      title: 'Pickles',
      products: sortProducts(
        activeProducts.filter(
          (product) => product.category === 'Pickles',
        ),
        'newest',
      ),
      autoMove: true,
    },

    {
      key: 'otherProducts',
      eyebrow: 'More from our kitchen',
      title: 'Other Products',
      products: sortProducts(
        activeProducts.filter(
          (product) => product.category !== 'Pickles',
        ),
        'newest',
      ),
      autoMove: true,
    },
  ]

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {sections.map((section) => (
          <ProductSection
            key={section.key}
            section={section}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts
