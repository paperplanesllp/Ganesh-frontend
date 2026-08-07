import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1280px] px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase text-brand">404</p>
          <h1 className="mt-3 font-[Georgia,serif] text-4xl font-bold text-brand-dark">Page not found</h1>
          <p className="mt-4 text-gray-600">
            The page you are looking for may have moved, or the link may be incorrect.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Go Home
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-brand transition duration-200 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
