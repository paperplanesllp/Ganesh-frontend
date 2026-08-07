function AdminErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="rounded-xl border border-brand-light bg-white p-6 text-center">
      <h3 className="text-lg font-semibold text-brand">{title}</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          className="mt-5 min-h-11 rounded-lg bg-brand px-5 text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/25"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default AdminErrorState
