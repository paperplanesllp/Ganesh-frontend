import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="bg-white py-12 text-black">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.9fr_0.9fr] lg:px-8">
        <section>
          <Link to="/" aria-label="Ganesh Pickles home" className="inline-block">
            <img
              src="/images/ganesh-logo-header.png"
              alt="Ganesh — Spicing up tradition in every jar"
              className="h-auto w-36"
            />
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-black">
            Bringing the authentic taste of Kerala to every home with traditional pickles, spice powders, and vathals for over two decades. 

          </p>
          <p className="mt-4 text-sm font-semibold text-black">
           
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-black">Quick links</h2>
          <nav className="mt-4 grid gap-2 text-sm text-black" aria-label="Footer navigation">
            <Link className="transition duration-200 text-black hover:text-black" to="/">Home</Link>
            <Link className="transition duration-200 text-black hover:text-black" to="/products">Products</Link>
            <Link className="transition duration-200 text-black hover:text-black" to="/about">About</Link>
            <Link className="transition duration-200 text-black hover:text-black" to="/contact">Contact</Link>
          </nav>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-black">Policies</h2>
          <nav className="mt-4 grid gap-2 text-sm text-black" aria-label="Policy navigation">
            <Link className="transition duration-200 text-black hover:text-black" to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link className="transition duration-200 text-black hover:text-black" to="/privacy-policy">Privacy Policy</Link>
            <Link className="transition duration-200 text-black hover:text-black" to="/refund-policy">Refund Policy</Link>
            <Link className="transition duration-200 text-black hover:text-black" to="/return-policy">Return Policy</Link>
            <Link className="transition duration-200 text-black hover:text-black" to="/shipping-policy">Shipping Policy</Link>
          </nav>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-black">Contact</h2>
          <address className="mt-4 grid gap-2 text-sm not-italic text-black">
            <span>Palakkad, Kerala</span>
            <a className="transition duration-200 text-black hover:text-black" href="tel:+919447960265">
              +91 94479 60265
            </a>
            <a className="transition duration-200 text-black hover:text-black" href="tel:+919872348112">
              +91 98723 48112
            </a>
            <a className="transition duration-200 text-black hover:text-black" href="tel:04912528207">
              0491-2528207
            </a>
            <a className="transition duration-200 text-black hover:text-black" href="mailto:nuraniganeshpickles@yahoo.com">
             nuraniganeshpickles@yahoo.com
            </a>
          </address>
        </section>
      </div>

      <div className="mx-auto mt-10 max-w-[1280px] border-t border-brand px-4 pt-6 text-sm text-black sm:px-6 lg:px-8">
        <p>© {currentYear} Ganesh Pickles. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
