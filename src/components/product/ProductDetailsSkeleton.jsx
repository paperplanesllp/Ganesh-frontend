function ProductDetailsSkeleton() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="h-[520px] animate-pulse rounded-2xl bg-brand-light" />
          <div className="mt-4 flex gap-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-20 w-20 animate-pulse rounded-xl bg-brand-light" />
            ))}
          </div>
        </div>
        <div className="self-center">
          <div className="h-6 w-40 animate-pulse rounded-full bg-brand-light" />
          <div className="mt-5 h-12 w-4/5 animate-pulse rounded bg-brand-light" />
          <div className="mt-6 grid gap-3">
            <div className="h-4 w-full animate-pulse rounded bg-brand-light" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-brand-light" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-brand-light" />
          </div>
          <div className="mt-8 h-12 w-56 animate-pulse rounded-full bg-brand-light" />
          <div className="mt-8 h-12 w-72 animate-pulse rounded-full bg-brand-light" />
        </div>
      </div>
    </section>
  )
}

export default ProductDetailsSkeleton
