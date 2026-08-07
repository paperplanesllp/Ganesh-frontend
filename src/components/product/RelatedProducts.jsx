import ProductGrid from './ProductGrid'

function RelatedProducts({ products, eyebrow = 'You may also like', title = 'Related Pickles' }) {
  if (products.length === 0) return null

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase text-brand">{eyebrow}</p>
          <h2 className="font-[Georgia,serif] text-3xl font-bold text-brand-dark">{title}</h2>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  )
}

export default RelatedProducts
