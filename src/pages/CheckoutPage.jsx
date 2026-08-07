import { Link } from 'react-router-dom'
import CheckoutForm from '../components/checkout/CheckoutForm'
import OrderSummary from '../components/checkout/OrderSummary'
import PageHeader from '../components/common/PageHeader'
import { useCart } from '../context/CartContext'

function CheckoutPage() {
  const { cartItems } = useCart()

  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Complete your order"
        description="Add delivery details and choose a secure payment method."
      />
      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {cartItems.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm sm:p-8">
              <h2 className="font-[Georgia,serif] text-2xl font-bold text-brand-dark">Your cart is empty</h2>
              <p className="mt-3 text-gray-600">
                Add products to your cart before starting checkout.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <CheckoutForm />
              <OrderSummary />
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CheckoutPage
