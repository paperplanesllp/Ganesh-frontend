import { Link, useLocation } from 'react-router-dom'

function OrderSuccessPage() {
  const { state } = useLocation()
  const hasVerifiedOrder = Boolean(state?.verified && state?.orderId)

  if (!hasVerifiedOrder) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="mb-3 text-sm font-bold uppercase text-brand">No verified order</p>
            <h1 className="font-[Georgia,serif] text-4xl font-bold text-brand-dark">
              Payment confirmation is not available
            </h1>
            <p className="mt-4 text-gray-600">
              This page only shows success after a verified payment. If you reached this page directly,
              please continue shopping or return to checkout from your cart.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                Browse Products
              </Link>
              <Link
                to="/cart"
                className="rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase text-brand">Payment verified</p>
          <h1 className="font-[Georgia,serif] text-4xl font-bold text-brand-dark">
            Thank you for your order
          </h1>
          <div className="mt-6 rounded-xl bg-brand-light p-4 text-left text-sm text-gray-600">
            <p>
              <span className="font-bold text-gray-900">Order ID:</span> {state.orderId}
            </p>
            {state.paymentId && (
              <p className="mt-2">
                <span className="font-bold text-gray-900">Payment ID:</span> {state.paymentId}
              </p>
            )}
          </div>
          <Link
            to="/products"
            className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  )
}

export default OrderSuccessPage
