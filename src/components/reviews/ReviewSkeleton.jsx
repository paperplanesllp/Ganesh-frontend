function ReviewSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-28 rounded bg-gray-100" />
          <div className="h-3 w-44 rounded bg-gray-100" />
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-4/5 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

export default ReviewSkeleton
