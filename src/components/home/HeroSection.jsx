import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="home-hero relative min-h-[calc(100svh-4rem)] w-full overflow-hidden bg-[#4b090c] sm:min-h-[calc(100svh-5rem)]">
      {/* The muted hero video loops continuously. */}
      <div className="home-hero-media absolute inset-0 overflow-hidden bg-[#4b090c]">
        <video
          className="home-hero-video absolute inset-0 h-full w-full object-cover object-center sm:object-right"
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
        className="pointer-events-none absolute inset-0 bg-black/65 sm:bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_45%,rgba(0,0,0,0.35)_75%,transparent_100%)] lg:w-3/5"
        aria-hidden="true"
      />

      {/* Hero content */}
      <div className="home-hero-content relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1320px] items-center px-4 py-10 sm:min-h-[calc(100svh-5rem)] sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="home-hero-copy w-full max-w-2xl">
          <h1
            className="home-hero-title font-[Georgia,serif] text-3xl font-bold leading-tight text-white [text-shadow:0_3px_12px_rgba(0,0,0,0.95),0_1px_3px_rgba(0,0,0,1)] min-[420px]:text-4xl sm:text-[clamp(2rem,4vw,2.5rem)]"
          >
            Spicing Up Tradition in Every Jar
          </h1>

          <div
            className="home-hero-description mt-4 max-w-xl text-xs font-medium leading-5 text-white [text-shadow:0_2px_7px_rgba(0,0,0,1),0_1px_2px_rgba(0,0,0,1)] sm:mt-5 sm:text-sm sm:leading-6 lg:text-base lg:leading-7"
          >
            <p>
              For over 20 years, Ganesh has been bringing the authentic flavors of Palakkad to homes with a carefully crafted range of traditional pickles, vathals, and spice powders. Rooted in heritage and inspired by time-honored recipes, every product is made to capture the rich taste and aroma of Kerala's culinary traditions.
            </p>
            <p className="mt-3 sm:mt-4">
              From handcrafted pickles bursting with authentic flavor to premium spice powders and traditional vathals, Ganesh combines quality ingredients with trusted expertise to deliver products that make every meal memorable. With a commitment to purity, consistency, and traditional taste, we continue to preserve recipes that have been cherished for generations.
            </p>
          </div>

          <div
            className="home-hero-actions mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap"
          >
            <Link
              to="/products"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 font-semibold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 sm:w-auto"
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

            <Link
              to="/about"
              className="inline-flex w-full items-center justify-center rounded-full border border-gray-200 bg-white/90 px-6 py-3 font-semibold text-brand shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-brand-light hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 sm:w-auto"
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
