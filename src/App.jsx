import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import GuestRoute from './components/auth/GuestRoute'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'
import Toast from './components/common/Toast'
import AdminLayout from './components/admin/AdminLayout'
import AdminRoute from './components/admin/AdminRoute'
import AccountPage from './pages/AccountPage'
import AboutPage from './pages/AboutPage'
import AdminCreateProductPage from './pages/admin/AdminCreateProductPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminEditProductPage from './pages/admin/AdminEditProductPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminNotAuthorizedPage from './pages/admin/AdminNotAuthorizedPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ProductsPage from './pages/ProductsPage'
import PhonePeStatusPage from './pages/PhonePeStatusPage'
import SignupPage from './pages/SignupPage'

function App() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')
  const isAuthPath = ['/login', '/signup'].includes(location.pathname)
  const usesStandaloneLayout = isAdminPath || isAuthPath

  return (
    <div className="min-h-screen bg-white font-[Inter,Arial,sans-serif] text-black">
      <ScrollToTop />
      {!usesStandaloneLayout && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/payment/phonepe/status" element={<ProtectedRoute><PhonePeStatusPage /></ProtectedRoute>} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          {['/account/orders', '/account/orders/:orderId', '/account/profile', '/account/addresses', '/account/recently-viewed'].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
          ))}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Navigate to="/admin/dashboard" replace />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout title="Dashboard">
                  <AdminDashboardPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminLayout title="Products">
                  <AdminProductsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminLayout title="Orders">
                  <AdminOrdersPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <AdminRoute>
                <AdminLayout title="Create Product">
                  <AdminCreateProductPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <AdminRoute>
                <AdminLayout title="Edit Product">
                  <AdminEditProductPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route path="/admin/not-authorized" element={<AdminNotAuthorizedPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!usesStandaloneLayout && <Footer />}
      <Toast />
    </div>
  )
}

export default App
