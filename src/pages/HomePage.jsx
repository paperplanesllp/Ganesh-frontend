import FeaturedProducts from '../components/home/FeaturedProducts'
import HeroSection from '../components/home/HeroSection'
import ProcessSection from '../components/home/ProcessSection'
import TestimonialSection from '../components/home/TestimonialSection'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <ProcessSection />
      <TestimonialSection />
      <section className="bg-brand-light py-16">
        <div className="mx-auto max-w-[1280px] px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex flex-col items-center">
            <p className="text-xl font-extrabold uppercase ">Ready for your next meal?</p>
            <svg
              className="mt-1 h-3 w-44 text-brand"
              viewBox="0 0 180 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 13C45 4.5 101 1.5 176 13"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="butt"
              />
            </svg>
          </div>
          <h2 className="mx-auto mt-3 max-w-2xl font-[Georgia,serif] text-3xl font-bold text-brand md:text-4xl">
            Bring home the taste of traditional Kerala pickles.
          </h2>
          <Link
            to="/products"
            className="mt-8 inline-flex rounded-full bg-black px-6 py-3 font-semibold text-white transition duration-200 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            Shop Pickles
          </Link>
        </div>
      </section>
    </>
  )
}

export default HomePage
