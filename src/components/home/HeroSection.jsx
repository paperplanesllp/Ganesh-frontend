import { useState } from 'react'
import { Link } from 'react-router-dom'

function HeroSection() {
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)

  return (
    <section className="relative h-screen min-h-screen w-full max-w-full overflow-hidden bg-[#4b090c]">
      {/* The muted hero video loops continuously. */}
      <div className="absolute inset-0 flex w-full max-w-full items-center justify-end overflow-hidden bg-[#4b090c]">
        <video
          className="absolute inset-0 h-full w-full max-w-full object-cover md:inset-auto md:right-0 md:top-1/2 md:w-auto md:max-w-none md:-translate-y-1/2 md:object-contain"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Ganesh traditional food preparation"
        >
          <source src="/images/IMG_9873.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_38%,rgba(0,0,0,0.3)_58%,transparent_78%)] lg:w-3/5"
        aria-hidden="true"
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex h-full min-h-screen w-full max-w-[1320px] items-center px-4 py-10 md:px-0 sm:py-14 lg:py-16">
        <div className="w-full min-w-0 max-w-2xl">
          <h1
            className="max-w-full whitespace-normal font-[Georgia,serif] text-[clamp(2rem,2.4vw,2.5rem)] font-bold leading-[1.1] text-white [text-shadow:0_3px_12px_rgba(0,0,0,0.95),0_1px_3px_rgba(0,0,0,1)] md:whitespace-nowrap"
          >
            Spicing Up Tradition in Every Jar
          </h1>

          <div
            className="mt-4 w-full max-w-xl text-xs font-medium leading-5 text-white [text-shadow:0_2px_7px_rgba(0,0,0,1),0_1px_2px_rgba(0,0,0,1)] sm:mt-5 sm:text-sm sm:leading-6 lg:text-base lg:leading-7"
          >
            <p>
              For over 20 years, Ganesh has been bringing the authentic flavors of Palakkad to homes with a carefully crafted range of traditional pickles, vathals, and spice powders. Rooted in heritage and inspired by time-honored recipes, every product is made to capture the rich taste and aroma of Kerala's culinary traditions.
            </p>
            <p className="mt-3 sm:mt-4">
              From handcrafted pickles bursting with authentic flavor to premium spice powders and traditional vathals, Ganesh combines quality ingredients with trusted expertise to deliver products that make every meal memorable. With a commitment to purity, consistency, and traditional taste, we continue to preserve recipes that have been cherished for generations.
            </p>
          </div>

          <div
            className="mt-6 flex flex-col gap-3 min-[380px]:flex-row sm:mt-8 sm:flex-wrap"
          >
            <div className="relative flex w-fit rounded-full bg-black text-white shadow-lg shadow-black/10">
              <Link
                to="/products?category=Pickles"
                className="group inline-flex items-center justify-center gap-2 rounded-l-full px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 md:rounded-full"
              >
                Shop Pickles

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <button
                type="button"
                aria-expanded={isShopMenuOpen}
                aria-haspopup="menu"
                aria-label="Choose a product category"
                onClick={() => setIsShopMenuOpen((isOpen) => !isOpen)}
                className="rounded-r-full border-l border-white/25 px-3 transition-colors hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 md:hidden"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-4 w-4 transition-transform duration-200 ${isShopMenuOpen ? 'rotate-180' : ''}`}
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isShopMenuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-[calc(100%+0.5rem)] z-20 min-w-44 overflow-hidden rounded-2xl border border-white/15 bg-black/95 p-1 text-sm shadow-2xl backdrop-blur-sm md:hidden"
                >
                  {['Vathals', 'Powders'].map((category) => (
                    <Link
                      key={category}
                      to={`/products?category=${category}`}
                      role="menuitem"
                      onClick={() => setIsShopMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-dark focus:bg-brand-dark focus:outline-none"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/90 px-6 py-3 font-semibold text-brand shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-brand-light hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
