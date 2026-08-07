import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { AUTH_ACTIONS, clearAuthIntent, saveAuthIntent } from '../../utils/authIntent'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products?category=Pickles', label: 'Pickles', category: 'Pickles' },
  { to: '/products?category=Powders', label: 'Powders', category: 'Powders' },
  { to: '/products?category=Vathals', label: 'Vathals', category: 'Vathals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function LoginIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 7.5 14.5 12 10 16.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 12H3.75" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M12.75 4.75h4.5A2.75 2.75 0 0 1 20 7.5v9a2.75 2.75 0 0 1-2.75 2.75h-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9.5 7.5 5 12l4.5 4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12h11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M12 4.75h4.25A2.75 2.75 0 0 1 19 7.5v9a2.75 2.75 0 0 1-2.75 2.75H12" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function UserPlusIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 11a3.75 3.75 0 1 0 0-7.5A3.75 3.75 0 0 0 10 11Z" stroke="currentColor" strokeWidth="1.9" />
      <path d="M3.5 20c.78-3.75 3.02-6 6.5-6 2.35 0 4.15 1.03 5.24 2.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M18.5 11.5v6M15.5 14.5h6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function PackageIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m4.5 7.5 7.5-4 7.5 4-7.5 4-7.5-4Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M4.5 7.5v9L12 20.5l7.5-4v-9M12 11.5v9" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 8.25h11l-.8 9.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8l-.8-9.2Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const accountMenuRef = useRef(null)
  const { cartCount } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || 'Account'
  const currentPath = `${location.pathname}${location.search}`

  const rememberCurrentPage = () => {
    saveAuthIntent({ action: AUTH_ACTIONS.RETURN_TO, returnTo: currentPath })
    setIsAccountOpen(false)
    setIsOpen(false)
  }

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsAccountOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    setIsAccountOpen(false)
    setIsOpen(false)
    await logout()
    clearAuthIntent()
    setIsLoggingOut(false)
    navigate('/', { replace: true })
  }

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
      isActive
        ? 'bg-brand text-white'
        : 'text-brand hover:bg-brand-light hover:text-brand-dark'
    }`

  const isNavLinkActive = (link) => {
    if (link.category) {
      const selectedCategory = new URLSearchParams(location.search).get('category') || 'Pickles'
      return location.pathname === '/products' && selectedCategory === link.category
    }

    return location.pathname === link.to
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-[1280px] items-center justify-between gap-2 px-3 sm:min-h-20 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          aria-label="Ganesh Pickles home"
        >
          <img
            src="/images/ganesh-logo-header.png"
            alt="Ganesh — Spicing up tradition in every jar"
            className="h-auto w-24 sm:w-36"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={() => navLinkClass({ isActive: isNavLinkActive(link) })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-full bg-brand-dark text-white shadow-sm ring-2 ring-brand ring-offset-2 ring-offset-white transition duration-200 hover:bg-brand focus:outline-none focus:ring-4 focus:ring-brand"
                aria-expanded={isAccountOpen}
                aria-haspopup="menu"
                aria-label={isAuthenticated ? `Account menu for ${firstName}` : 'Open customer account menu'}
                title={isAuthenticated ? firstName : 'Account'}
                onClick={() => setIsAccountOpen((current) => !current)}
              >
                <UserPlusIcon />
              </button>
              {isAccountOpen && (
                <div
                  className="absolute right-0 mt-4 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg"
                  role="menu"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3">
                        <p className="text-xs font-bold uppercase text-brand">Hello,</p>
                        <p className="font-[Georgia,serif] text-lg font-bold text-brand-dark">{firstName}</p>
                      </div>
                      <Link
                        to="/account"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <UserPlusIcon />
                        My Account
                      </Link>
                      <Link
                        to="/account/orders"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold text-brand hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <PackageIcon />
                        My Orders
                      </Link>
                      <Link
                        to="/account/addresses"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <LocationIcon />
                        Manage Addresses
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          role="menuitem"
                          className="block rounded-xl px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        type="button"
                        role="menuitem"
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-brand hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:text-gray-400"
                        onClick={handleLogout}
                      >
                        <LogoutIcon />
                        {isLoggingOut ? 'Signing out...' : 'Logout'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        state={{ from: currentPath }}
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand"
                        onClick={rememberCurrentPage}
                      >
                        <LoginIcon />
                        Login
                      </Link>
                      <div className="mt-1 rounded-xl bg-white px-4 py-3 text-sm text-gray-600">
                        <span>Don&apos;t have an account?</span>{' '}
                        <Link
                          to="/signup"
                          state={{ from: currentPath }}
                          className="font-bold text-brand underline-offset-4 hover:underline"
                          onClick={rememberCurrentPage}
                        >
                          Create Account
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <NavLink
            to="/cart"
            aria-label="Cart"
            title="Cart"
            className={({ isActive }) =>
              `relative grid h-11 w-11 place-items-center rounded-full text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                isActive
                  ? 'bg-brand-dark text-white'
                  : 'bg-brand text-white hover:bg-brand-dark'
              }`
            }
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-sm font-semibold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label="Open menu"
            onClick={() => setIsOpen((current) => !current)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-navigation"
          className="mx-auto grid max-w-[1280px] gap-2 px-4 pb-4 sm:px-6 md:hidden"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={() => navLinkClass({ isActive: isNavLinkActive(link) })}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/account" className={navLinkClass} onClick={() => setIsOpen(false)}>
                My Account
              </NavLink>
              <NavLink to="/account/orders" className={navLinkClass} onClick={() => setIsOpen(false)}>
                My Orders
              </NavLink>
              <NavLink to="/account/addresses" className={navLinkClass} onClick={() => setIsOpen(false)}>
                Manage Addresses
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setIsOpen(false)}>
                  Admin Panel
                </NavLink>
              )}
              <button
                type="button"
                disabled={isLoggingOut}
                className="rounded-full px-4 py-2 text-left text-sm font-semibold text-brand transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-400"
                onClick={handleLogout}
              >
                {isLoggingOut ? 'Signing out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" state={{ from: currentPath }} className={navLinkClass} onClick={rememberCurrentPage}>
                Login
              </NavLink>
              <NavLink to="/signup" state={{ from: currentPath }} className={navLinkClass} onClick={rememberCurrentPage}>
                Create Account
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar
