import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminNotAuthorizedPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gray-100 px-4 font-[Manrope,Inter,Arial,sans-serif]">
      <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brand">Access denied</p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-900">Admin permission is required</h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">
          This area is reserved for Ganesh Pickles administrators. You can continue using the customer storefront or sign in with an admin account.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/account" className="inline-flex min-h-11 items-center rounded-lg border border-gray-200 px-5 text-sm font-medium text-brand">Go to My Account</Link>
          <Link to="/" className="inline-flex min-h-11 items-center rounded-lg border border-gray-200 px-5 text-sm font-medium text-brand">Return to Store</Link>
          <button type="button" className="min-h-11 rounded-lg bg-brand px-5 text-sm font-medium text-white" onClick={handleLogout}>
            Logout and use another account
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminNotAuthorizedPage
