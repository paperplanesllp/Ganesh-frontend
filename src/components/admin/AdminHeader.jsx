import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AdminIcon } from './AdminIcons'

function AdminHeader({ title, isMenuOpen, onMenuClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || 'Admin'
  const initials = firstName.slice(0, 2).toUpperCase()

  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
      if (event.type === 'pointerdown' && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', close)
    document.addEventListener('pointerdown', close)
    return () => {
      document.removeEventListener('keydown', close)
      document.removeEventListener('pointerdown', close)
    }
  }, [])

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[68px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gray-200 text-brand focus:outline-none focus:ring-2 focus:ring-brand/25 lg:hidden"
            aria-label="Open admin navigation"
            aria-expanded={Boolean(isMenuOpen)}
            onClick={onMenuClick}
          >
            <AdminIcon name="menu" />
          </button>
          <h1 className="truncate text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/"
            className="hidden h-10 items-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand hover:bg-brand-light sm:inline-flex"
          >
            View Store
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-lg bg-brand px-3 text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/25"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((current) => !current)}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-xs">{initials}</span>
              <span className="hidden sm:inline">{firstName}</span>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg" role="menu">
                <Link to="/account" role="menuitem" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-brand-light" onClick={() => setIsOpen(false)}>
                  My Account
                </Link>
                <Link to="/" role="menuitem" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-brand-light" onClick={() => setIsOpen(false)}>
                  View Store
                </Link>
                <button type="button" role="menuitem" className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-brand hover:bg-brand-light" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
