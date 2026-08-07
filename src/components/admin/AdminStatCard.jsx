import { Link } from 'react-router-dom'
import { AdminIcon } from './AdminIcons'

function AdminStatCard({ label, count, description, icon = 'products', to }) {
  const content = (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 transition hover:border-brand/35">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-brand">{count}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-light text-brand">
          <AdminIcon name={icon} className="h-4.5 w-4.5" />
        </span>
      </div>
      {description && <p className="mt-3 text-sm text-gray-600">{description}</p>}
    </div>
  )

  return to ? <Link to={to} className="block h-full">{content}</Link> : content
}

export default AdminStatCard
