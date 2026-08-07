function AdminPageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-medium uppercase tracking-wide text-gray-600">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-semibold text-gray-900 lg:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default AdminPageHeader
