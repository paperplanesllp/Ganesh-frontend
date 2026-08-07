function AdminEmptyState({ title, message, action }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default AdminEmptyState
