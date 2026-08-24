import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import ProductGrid from '../components/product/ProductGrid'
import { useProductData } from '../context/ProductDataContext'
import { paginateProducts, sortProducts } from '../utils/localProductCatalog'

const CATEGORY_CONTENT = {
  Pickles: {
    heading: 'PICKLES',
    eyebrow: 'Traditional favourites',
    description: 'Explore our 18 traditional pickles, prepared with carefully selected ingredients and time-honoured recipes.',
    emptyTitle: 'No pickles available',
  },
  Powders: {
    heading: 'POWDERS',
    eyebrow: 'Everyday essentials',
    description: 'Explore our 6 aromatic South Indian powders and ready-to-use spice blends.',
    emptyTitle: 'No powders available',
  },
  Vathals: {
    heading: 'VATHALS',
    eyebrow: 'Sun-dried specialities',
    description: 'Explore our 11 traditional sun-dried vathals, ready to fry for a crisp accompaniment.',
    emptyTitle: 'No vathals available',
  },
}

function ProductsPage() {
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()
  const gridHeadingRef = useRef(null)
  const { activeProducts, categoryVisibility } = useProductData()
  const requestedCategory = searchParams.get('category')
  const selectedCategory = CATEGORY_CONTENT[requestedCategory] ? requestedCategory : 'Pickles'
  const categoryContent = CATEGORY_CONTENT[selectedCategory]
  const isCategoryVisible = categoryVisibility[selectedCategory] !== false

  const sortedProducts = useMemo(
    () => sortProducts(
      activeProducts.filter((product) => product.category === selectedCategory),
      'featured',
    ),
    [activeProducts, selectedCategory],
  )
  const { products, pagination } = useMemo(() => paginateProducts(sortedProducts, page, 12), [page, sortedProducts])

  useEffect(() => {
    setPage(1)
  }, [selectedCategory])

  useEffect(() => {
    if (page !== pagination.page) setPage(pagination.page)
  }, [page, pagination.page])

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === page) return
    setPage(nextPage)
    window.setTimeout(() => gridHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const pageNumbers = useMemo(() => {
    const total = pagination.totalPages || 1
    const start = Math.max(1, page - 2)
    const end = Math.min(total, page + 2)
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  }, [page, pagination.totalPages])

  return (
    <>
      <PageHeader
        eyebrow={categoryContent.eyebrow}
        title={categoryContent.heading}
        description={categoryContent.description}
      />
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div ref={gridHeadingRef}>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
              <h2 className="font-[Georgia,serif] text-3xl font-bold tracking-wide text-brand-dark">
                {categoryContent.heading}
              </h2>
              <p className="text-sm font-semibold text-gray-600">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            {isCategoryVisible && products.length > 0 && <ProductGrid products={products} />}
            {!isCategoryVisible && (
              <EmptyState
                title="Products in this category are currently unavailable."
                message="Please check back later or explore our other products."
              />
            )}
            {isCategoryVisible && products.length === 0 && (
              <EmptyState
                title={categoryContent.emptyTitle}
                message={`New ${selectedCategory.toLowerCase()} will appear here once they are added to the catalog.`}
              />
            )}
          </div>

          {pagination.totalPages > 1 && (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Product pages">
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!pagination.hasPreviousPage}
                onClick={() => changePage(page - 1)}
              >
                Previous
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`h-10 w-10 rounded-full text-sm font-bold ${
                    pageNumber === page
                      ? 'bg-brand text-white'
                      : 'border border-gray-200 bg-white text-brand'
                  }`}
                  onClick={() => changePage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!pagination.hasNextPage}
                onClick={() => changePage(page + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  )
}

export default ProductsPage
