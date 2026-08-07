import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AdminIcon } from './AdminIcons'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'products' },
  { to: '/admin/orders', label: 'Orders', icon: 'orders' },
  { to: '/admin/products/new', label: 'Add Product', icon: 'plus' },
  { to: '/', label: 'View Store', icon: 'store' },
  { to: '/account', label: 'My Account', icon: 'account' },
]

function AdminSidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || 'Admin'
  const initials = firstName.slice(0, 2).toUpperCase()

  const linkClass = ({ isActive }) =>
    `flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand/25 ${
      isActive ? 'bg-brand text-white' : 'text-gray-900 hover:bg-brand-light'
    }`

  const handleLogout = async () => {
    await logout()
    if (onNavigate) onNavigate()
    navigate('/', { replace: true })
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-gray-200 bg-white px-4 py-5 lg:block">
      <div className="border-b border-gray-200 pb-5">
        <p className="font-[Georgia,serif] text-xl font-semibold text-brand">Ganesh Pickles</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-600">Admin</p>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-light text-xs font-semibold text-brand">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{firstName}</p>
          <p className="text-xs text-gray-600">Admin</p>
        </div>
      </div>
      <nav className="mt-6 grid gap-1.5" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={onNavigate}>
            <AdminIcon name={item.icon} className="h-4.5 w-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        className="absolute bottom-5 left-4 right-4 flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-brand transition hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand/25"
        onClick={handleLogout}
      >
        <AdminIcon name="logout" className="h-4.5 w-4.5" />
        Logout
      </button>
    </aside>
  )
}

export default AdminSidebar
