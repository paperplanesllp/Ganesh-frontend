import { Link } from 'react-router-dom'

const benefits = [
  '20+ years of trusted expertise in traditional Kerala foods',
  'Authentic Palakkad recipes passed down through generations',
  'Premium-quality ingredients sourced with care',
  'Homemade-style pickles, flavourful spice powders and traditional vathals',
  'Hygienically prepared and carefully packed for lasting freshness',
  'A perfect blend of heritage, quality and authentic taste',
]

const values = [
  {
    number: '01',
    title: 'Traditional Recipes',
    text: 'Authentic Palakkad recipes prepared using time-honoured methods that preserve the familiar homemade taste loved across generations.',
  },
  {
    number: '02',
    title: 'Quality Ingredients',
    text: 'Carefully selected fruits, vegetables, spices, and seasonings come together to create rich, balanced flavours in every batch.',
  },
  {
    number: '03',
    title: 'Crafted with Care',
    text: 'Prepared in hygienic conditions using quality ingredients, with vinegar used to help maintain freshness and consistency.',
  },
  {
    number: '04',
    title: 'Honest & Transparent',
    text: 'Clear ingredient information, fair pricing, and a commitment to delivering products you can trust every time.',
  },
]

function CheckIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#88ad24] text-white">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3 w-3"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <path
          d="m6 12 4 4 8-9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#fbfaf4] text-[#292417]">
      {/* Main about section */}
      <section className="relative overflow-hidden">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(93,103,72,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(93,103,72,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 top-12 h-52 w-52 rounded-full border-[10px] border-[#a8c854]/30" />
        <div className="pointer-events-none absolute -right-10 top-20 h-36 w-36 rounded-full border-[8px] border-[#a8c854]/30" />
        <div className="pointer-events-none absolute right-4 top-28 h-20 w-20 rounded-full border-[6px] border-[#a8c854]/30" />

        <div className="relative mx-auto grid min-h-[680px] max-w-[1280px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <p className="font-['Segoe_Print',cursive] text-xl font-bold tracking-wide text-[#332d18] sm:text-2xl">
              OVER 20 YEARS OF AUTHENTIC FLAVOURS
            </p>

            <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#799a1d]">
              From Palakkad
            </p>

            <h1 className="mt-4 font-['Arial_Black',sans-serif] text-[clamp(2.75rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#88ad24]">
              Ganesh
              <span className="block">Pickles!</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#554f42] sm:text-lg">
              Traditional Kerala pickles prepared with carefully selected
              ingredients, balanced spices and patient methods that bring
              familiar homemade flavour to every jar.
            </p>

            <div className="mt-8">
              <h2 className="text-lg font-black uppercase tracking-[0.12em] text-[#789719]">
              WHY FAMILIES TRUST GANESH
              </h2>

              <div className="mt-4 grid gap-2.5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-2.5"
                  >
                    <CheckIcon />

                    <p className="text-xs leading-5 text-[#383326] sm:text-sm">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-[#88ad24] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(113,143,26,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#718f1a] hover:shadow-[0_16px_35px_rgba(113,143,26,0.3)] focus:outline-none focus:ring-2 focus:ring-[#88ad24] focus:ring-offset-2"
              >
                Explore Our Products

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
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[#d5ddbb] bg-white/80 px-7 py-3.5 text-sm font-bold text-[#526610] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#88ad24] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#88ad24] focus:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="absolute -inset-8 rounded-[45%_55%_46%_54%/58%_43%_57%_42%] bg-[#e7efc9]" />

            <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-[#88ad24]/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[44%_56%_48%_52%/58%_42%_58%_42%] border-[10px] border-white/70 bg-[#edf3d7] shadow-[0_30px_70px_rgba(57,65,29,0.18)]">
              <img
                src="/images/mango.png"
                alt="Ganesh Mango Pickle product pack"
                loading="lazy"
                className="h-[360px] w-full object-cover object-center min-[420px]:h-[440px] sm:h-[580px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
            </div>

            <div className="absolute -bottom-5 left-4 rounded-3xl border border-white/70 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md sm:left-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b931f]">
                Made with care
              </p>

              <p className="mt-1 font-['Segoe_Print',cursive] text-lg font-bold text-[#312b18]">
                Traditional taste in every jar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="border-y border-[#e2e5d5] bg-white py-14">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div className="flex items-center justify-center py-4 lg:min-h-[260px]">
            <div className="inline-flex flex-col items-center text-center">
              <p className="text-2xl font-black uppercase tracking-[0.14em] text-[#302a19] sm:text-3xl">
                Brand Story
              </p>
              <svg
                className="mt-2 h-4 w-44 text-[#b51f24]"
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
          </div>

          <div className="grid gap-5 text-base leading-8 text-gray-600">
            <p>
              For more than two decades, Ganesh has been preserving the rich culinary heritage of Palakkad through authentic pickles, vathals, and spice powders. Built on traditional recipes and uncompromising quality, our products are crafted to bring the familiar taste of home to every dining table.
            </p>

            <p>
              Every jar and every pack reflects our commitment to using carefully selected ingredients, balanced spice blends, and time-tested preparation methods. As a trusted Kerala food brand, we continue to celebrate the flavours passed down through generations while ensuring the highest standards of quality and hygiene.
            </p>

            <p>
              Ganesh is more than a brand—it's a tradition that brings families together over every meal.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f4f7e9] py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="mb-9 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7d9b20]">
              WHAT WE VALUE
            </p>

          </div>

          <div className="grid border-t border-[#d9dfc2] sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="border-b border-[#d9dfc2] px-0 py-7 sm:px-6 lg:border-r lg:last:border-r-0"
              >
                <span className="text-xs font-black tracking-[0.18em] text-[#88ad24]">
                  {value.number}
                </span>

                <h3 className="mt-4 font-[Georgia,serif] text-xl font-bold text-[#332d1c]">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {value.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
