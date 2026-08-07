function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-60 animate-pulse bg-brand-light" />
      <div className="grid gap-4 p-5">
        <div className="h-5 w-24 animate-pulse rounded-full bg-brand-light" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-brand-light" />
        <div className="h-4 w-full animate-pulse rounded bg-brand-light" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-brand-light" />
        <div className="h-10 w-full animate-pulse rounded-full bg-brand-light" />
      </div>
    </div>
  )
}

export default ProductCardSkeleton
