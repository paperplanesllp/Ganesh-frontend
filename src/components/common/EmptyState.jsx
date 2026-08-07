import { Link } from 'react-router-dom'

function EmptyState({ title, message, actionLabel = 'Shop pickles', actionTo = '/products', onAction }) {
  const actionClassName =
    'mt-6 inline-flex rounded-full bg-brand px-5 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2'

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h2 className="font-[Georgia,serif] text-2xl font-bold text-brand-dark">{title}</h2>
      <p className="mt-3 text-gray-600">{message}</p>
      {onAction ? (
        <button type="button" className={actionClassName} onClick={onAction}>
          {actionLabel}
        </button>
      ) : (
        <Link to={actionTo} className={actionClassName}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default EmptyState
