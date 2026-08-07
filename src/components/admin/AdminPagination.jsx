function AdminPagination({ pagination, onPageChange, itemLabel = 'products' }) {
  if (!pagination || pagination.totalPages <= 1) return null

  const current = pagination.page
  const start = Math.max(1, current - 2)
  const end = Math.min(pagination.totalPages, current + 2)
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index)

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
      <p className="text-sm text-gray-600">
        Showing page {pagination.page} of {pagination.totalPages} ({pagination.totalProducts} {itemLabel})
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" disabled={!pagination.hasPreviousPage} onClick={() => onPageChange(current - 1)} className="min-h-10 rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand disabled:cursor-not-allowed disabled:opacity-50">
          Previous
        </button>
        {pages.map((page) => (
          <button key={page} type="button" onClick={() => onPageChange(page)} className={`h-10 w-10 rounded-lg text-sm font-medium ${page === current ? 'bg-brand text-white' : 'border border-gray-200 text-brand'}`}>
            {page}
          </button>
        ))}
        <button type="button" disabled={!pagination.hasNextPage} onClick={() => onPageChange(current + 1)} className="min-h-10 rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand disabled:cursor-not-allowed disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  )
}

export default AdminPagination
