import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/currency'

function CartSummary({ cartCount, subtotal, deliveryCharge, total, checkout = true, shippingPending = false }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showToast } = useCart()

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout')
      return
    }

    const message = 'Please log in to continue to checkout.'
    showToast(message, 'info')
    navigate('/login', {
      state: {
        from: '/checkout',
        message,
      },
    })
  }

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="font-[Georgia,serif] text-2xl font-bold text-brand-dark">Cart Summary</h2>
      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total items</span>
          <span className="font-semibold text-gray-900">{cartCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-brand">
            {shippingPending ? 'Calculated at checkout' : formatCurrency(deliveryCharge)}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold text-brand-dark">
            <span>Total</span>
            <span>{shippingPending ? formatCurrency(subtotal) : formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      {checkout && (
        <div className="mt-6 grid gap-3">
          <button
            type="button"
            className="flex justify-center rounded-full bg-brand px-5 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          <Link
            to="/products"
            className="flex justify-center rounded-full border border-gray-200 bg-white px-5 py-3 font-semibold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </aside>
  )
}

export default CartSummary
