import { useEffect, useState } from 'react'
import AdminHeader from './AdminHeader'
import { AdminIcon } from './AdminIcons'
import AdminMobileNavigation from './AdminMobileNavigation'
import AdminSidebar from './AdminSidebar'

function AdminLayout({ title, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    if (!isMobileOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isMobileOpen])

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100 font-[Manrope,Inter,Arial,sans-serif] text-gray-900">
      <AdminSidebar />
      <AdminMobileNavigation isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <div className="lg:pl-60">
        <AdminHeader title={title} isMenuOpen={isMobileOpen} onMenuClick={() => setIsMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-brand-light bg-brand-light px-4 py-3 text-sm text-brand-dark">
            <AdminIcon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Manage the Ganesh Pickles catalogue and store operations.</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
