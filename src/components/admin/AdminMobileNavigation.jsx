import AdminSidebar from './AdminSidebar'
import { AdminIcon } from './AdminIcons'

function AdminMobileNavigation({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button className="absolute inset-0 bg-black/45" type="button" aria-label="Close admin menu" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-[280px] max-w-[88vw] bg-white shadow-xl">
        <button
          type="button"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          aria-label="Close admin navigation"
          onClick={onClose}
        >
          <AdminIcon name="close" />
        </button>
        <div className="[&>aside]:static [&>aside]:block [&>aside]:h-full [&>aside]:w-full [&>aside]:shadow-none">
          <AdminSidebar onNavigate={onClose} />
        </div>
      </div>
    </div>
  )
}

export default AdminMobileNavigation
