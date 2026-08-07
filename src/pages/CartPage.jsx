import { Link } from 'react-router-dom'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import PageHeader from '../components/common/PageHeader'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { cartItems, cartCount, subtotal, deliveryCharge, total, clearCart } = useCart()

  const handleClearCart = () => {
    if (window.confirm('Clear every item from your cart?')) {
      clearCart()
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title="Your pickle basket"
        description="Review your jars, adjust quantities, and continue to checkout."
      />
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {cartItems.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm sm:p-8">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-light text-brand">
                <svg className="h-14 w-14" viewBox="0 0 64 64" role="img" aria-label="Empty cart">
                  <path
                    d="M18 22h36l-5 20H23L18 14H9"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                  />
                  <circle cx="27" cy="50" r="3" fill="currentColor" />
                  <circle cx="45" cy="50" r="3" fill="currentColor" />
                  <path d="M30 29h12" stroke="currentColor" strokeLinecap="round" strokeWidth="4" opacity="0.35" />
                </svg>
              </div>
              <h2 className="mt-5 font-[Georgia,serif] text-2xl font-bold text-brand-dark">
                Your cart is empty
              </h2>
              <p className="mt-3 text-gray-600">Add a few traditional pickle jars and come back here.</p>
              <Link
                to="/products"
                className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="grid gap-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.key} item={item} />
                  ))}
                </div>
              </div>
              <CartSummary
                cartCount={cartCount}
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
                total={total}
              />
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CartPage
