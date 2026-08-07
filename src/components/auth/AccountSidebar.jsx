import { NavLink } from 'react-router-dom'

function AccountIcon({ name }) {
  const paths = {
    orders: <path d="M6.5 8.5h11l-.8 10a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8l-.8-10ZM9 8.5V7a3 3 0 0 1 6 0v1.5" />,
    profile: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20c1.1-3.7 3.6-5.6 7.5-5.6s6.4 1.9 7.5 5.6" />,
    address: <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10ZM12 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
    recent: <path d="M5 5v5h5M5.5 13a6.5 6.5 0 1 0 1.9-6.1L5 10" />,
    logout: <path d="M9.5 7.5 5 12l4.5 4.5M5 12h11M12 4.75h4.25A2.75 2.75 0 0 1 19 7.5v9a2.75 2.75 0 0 1-2.75 2.75H12" />,
  }

  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  )
}

function AccountSidebar({ user, onLogout, isLoggingOut }) {
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || 'Customer'
  const isAdmin = user?.role === 'admin'
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand ${
      isActive ? 'bg-brand text-white' : 'text-brand hover:bg-brand-light'
    }`

  return (
    <aside className="grid gap-4 lg:sticky lg:top-28 lg:self-start">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-light text-brand">
            <AccountIcon name="profile" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Hello,</p>
            <p className="text-xl font-bold tracking-tight text-gray-900">{firstName}</p>
            {isAdmin && <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-brand">Administrator</p>}
          </div>
        </div>
      </section>

      <nav className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm" aria-label="Account navigation">
        <div className="grid gap-1">
          {!isAdmin && (
            <NavLink to="/account/orders" className={linkClass}>
              <AccountIcon name="orders" />
              My Orders
            </NavLink>
          )}

          <div className={isAdmin ? '' : 'mt-3 border-t border-gray-200 pt-3'}>
            <p className="px-4 pb-2 text-xs font-bold uppercase text-brand">Account Settings</p>
            <NavLink to="/account/profile" className={linkClass}>
              <AccountIcon name="profile" />
              Profile Information
            </NavLink>
            <NavLink to="/account/addresses" className={linkClass}>
              <AccountIcon name="address" />
              Manage Addresses
            </NavLink>
          </div>

          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="px-4 pb-2 text-xs font-bold uppercase text-brand">My Activity</p>
            <NavLink to="/account/recently-viewed" className={linkClass}>
              <AccountIcon name="recent" />
              Recently Viewed
            </NavLink>
          </div>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onLogout}
            className="mt-3 flex items-center gap-3 rounded-xl border-t border-gray-200 px-4 py-3 text-left text-sm font-bold text-brand transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:text-gray-400"
          >
            <AccountIcon name="logout" />
            {isLoggingOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>
      </nav>
    </aside>
  )
}

export { AccountIcon }
export default AccountSidebar
