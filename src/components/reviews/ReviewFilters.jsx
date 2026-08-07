const filters = [
  { id: 'all', label: 'All Reviews' },
  { id: '5', label: '5 Stars' },
  { id: '4', label: '4 Stars' },
  { id: '3', label: '3 Stars' },
  { id: 'photos', label: 'Reviews with Photos' },
  { id: 'recent', label: 'Most Recent' },
  { id: 'top', label: 'Highest Rated' },
]

function ReviewFilters({ activeFilter, onChange }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id

          return (
            <button
              key={filter.id}
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                isActive
                  ? 'border-brand bg-brand text-white'
                  : 'border-gray-200 bg-white text-brand hover:bg-brand-light hover:text-brand-dark'
              }`}
              onClick={() => onChange(filter.id)}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ReviewFilters
