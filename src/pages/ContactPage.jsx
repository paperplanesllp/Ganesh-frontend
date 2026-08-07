import { useState } from 'react'
import { validateContact } from '../utils/validation'

const ganeshPickleImage = '/images/ganu.jpeg'

const initialValues = {
  fullName: '',
  phone: '',
  email: '',
  message: '',
}

const pickleVarieties = [
  {
    name: 'Mango Pickle',
    icon: 'mango',
    position: '-left-10 top-10',
  },
  {
    name: 'Lemon Pickle',
    icon: 'lemon',
    position: 'right-0 top-16',
  },
  {
    name: 'Garlic Pickle',
    icon: 'garlic',
    position: '-left-16 top-[42%]',
  },
  {
    name: 'Gooseberry Pickle',
    icon: 'gooseberry',
    position: '-right-5 top-[48%]',
  },
  {
    name: 'Cut Mango Pickle',
    icon: 'cutMango',
    position: '-left-10 bottom-12',
  },
  {
    name: 'Tender Mango',
    icon: 'tenderMango',
    position: 'right-3 bottom-5',
  },
]

function InstagramIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="17"
        cy="7"
        r="1"
        fill="currentColor"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8.5V7.2c0-.8.4-1.2 1.3-1.2h1.4V3.6c-.7-.1-1.5-.2-2.3-.2-2.5 0-4.2 1.5-4.2 4.3v.8H7.7v2.8h2.5v8.9H14v-8.9h2.5l.4-2.8H14Z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.2 18.8 6.1 16A8 8 0 1 1 9 18.7l-3.8.1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M9.3 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.3 0 .5-.2.7l-.4.4c.7 1.2 1.6 2.1 2.9 2.7l.4-.5c.2-.2.4-.3.7-.2l1.4.7c.3.1.4.3.4.6v.5c0 .4-.2.7-.5.9-.5.3-1.1.4-1.7.3-2.9-.5-5.5-3-6.1-5.9-.2-.7 0-1.3.2-1.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ContactIcon({ type }) {
  if (type === 'location') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="12"
          cy="10"
          r="2.5"
        />
      </svg>
    )
  }

  if (type === 'phone') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M5.5 4.5 8 4l2 5-2 1.5c1.2 2.5 3 4.3 5.5 5.5l1.5-2 5 2-.5 2.5c-.2 1-1.1 1.7-2.1 1.6C10.1 19.6 4.4 13.9 3.9 6.6c-.1-1 .6-1.9 1.6-2.1Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === 'email') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />

        <path
          d="m4 7 8 6 8-6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path
        d="M12 7v5l3 2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PickleIcon({ type }) {
  if (type === 'lemon') {
    return (
      <svg
        viewBox="0 0 40 40"
        className="h-7 w-7"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r="13"
          fill="#FFF3B0"
          stroke="#E3AA16"
          strokeWidth="2"
        />

        <path
          d="M20 7v26M8 20h24M11 12l18 16M29 12 11 28"
          stroke="#E3AA16"
          strokeWidth="1.5"
        />
      </svg>
    )
  }

  if (type === 'garlic') {
    return (
      <svg
        viewBox="0 0 40 40"
        className="h-7 w-7"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 8c2 4 7 6 9 11 3 7-2 14-9 14S8 26 11 19c2-5 7-7 9-11Z"
          fill="#FFF8E8"
          stroke="#9A7857"
          strokeWidth="2"
        />

        <path
          d="M20 12v20M15 15c-1 7 1 12 5 17M25 15c1 7-1 12-5 17"
          stroke="#B19878"
          strokeWidth="1.5"
        />

        <path
          d="M20 8c0-3 2-5 5-6"
          stroke="#6F8D2D"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'gooseberry') {
    return (
      <svg
        viewBox="0 0 40 40"
        className="h-7 w-7"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="21"
          r="13"
          fill="#DFEA93"
          stroke="#78952B"
          strokeWidth="2"
        />

        <path
          d="M20 8v26M14 9c4 7 4 17 0 24M26 9c-4 7-4 17 0 24"
          stroke="#8DA63A"
          strokeWidth="1.5"
        />

        <path
          d="M20 8c2-4 5-5 9-4"
          stroke="#658128"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'tenderMango') {
    return (
      <svg
        viewBox="0 0 40 40"
        className="h-7 w-7"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 23C9 13 16 7 26 8c6 1 8 6 5 11-3 8-10 15-17 14-4 0-5-5-5-10Z"
          fill="#B9D75C"
          stroke="#6F9129"
          strokeWidth="2"
        />

        <path
          d="M24 9c2-4 5-6 9-6"
          stroke="#587822"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'cutMango') {
    return (
      <svg
        viewBox="0 0 40 40"
        className="h-7 w-7"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 26C12 15 20 9 32 9c-2 12-8 21-19 24-4 1-7-3-5-7Z"
          fill="#FBC84B"
          stroke="#D88B14"
          strokeWidth="2"
        />

        <path
          d="M12 28c5-7 11-12 18-16"
          stroke="#D88B14"
          strokeWidth="1.5"
        />

        <path
          d="M27 10c1-4 4-6 8-7"
          stroke="#66842B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 40 40"
      className="h-7 w-7"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 23C8 13 15 7 25 8c7 1 9 6 6 12-3 8-10 14-17 13-4 0-6-5-6-10Z"
        fill="#FBC84B"
        stroke="#D18712"
        strokeWidth="2"
      />

      <path
        d="M24 9c2-4 5-6 9-6"
        stroke="#66842B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PickleBadge({
  name,
  icon,
  position,
}) {
  return (
    <div
      className={`absolute z-30 hidden items-center gap-3 rounded-[20px] border border-[#dce5bd] bg-white/95 px-4 py-3 shadow-[0_14px_35px_rgba(55,67,26,0.12)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(55,67,26,0.16)] lg:flex ${position}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f5dd]">
        <PickleIcon type={icon} />
      </span>

      <span className="whitespace-nowrap text-sm font-bold text-[#3b4423]">
        {name}
      </span>
    </div>
  )
}

function ProductImageDisplay() {
  return (
    <div className="relative mx-auto w-full max-w-[590px]">
      {/* Decorative rings behind product */}
      <div className="pointer-events-none absolute -right-8 -top-14 h-56 w-56">
        <div className="absolute inset-0 rounded-full border-[6px] border-[#a9c757]/35" />

        <div className="absolute inset-[28px] rounded-full border-[6px] border-[#a9c757]/35" />

        <div className="absolute inset-[58px] rounded-full border-[5px] border-[#a9c757]/35" />
      </div>

      {/* Organic product background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[min(390px,92vw)] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] rounded-[46%_54%_42%_58%/52%_44%_56%_48%] border-[3px] border-[#a9c757]/45 sm:h-[520px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[415px] w-[min(365px,86vw)] -translate-x-1/2 -translate-y-1/2 rounded-[46%_54%_42%_58%/52%_44%_56%_48%] bg-[#e9f0cb] sm:h-[490px]" />

      {/* Real image */}
      <div className="relative z-20 mx-auto w-full max-w-[360px] overflow-hidden rounded-[42px] border-[9px] border-white/80 bg-white shadow-[0_35px_80px_rgba(60,65,33,0.24)] sm:max-w-[400px]">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={ganeshPickleImage}
            alt="Ganesh mixed vegetable pickle jar"
            className="h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
        </div>

 
      </div>

      {/* Product variety cards */}
      {pickleVarieties.map((pickle) => (
        <PickleBadge
          key={pickle.name}
          name={pickle.name}
          icon={pickle.icon}
          position={pickle.position}
        />
      ))}

      {/* Mobile variety list */}
      <div className="relative z-30 mt-7 flex flex-wrap justify-center gap-2 lg:hidden">
        {pickleVarieties.map((pickle) => (
          <span
            key={pickle.name}
            className="inline-flex items-center gap-2 rounded-full border border-[#dce5bd] bg-white px-3 py-2 text-xs font-bold text-[#53651f] shadow-sm"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f5dd]">
              <PickleIcon type={pickle.icon} />
            </span>

            {pickle.name}
          </span>
        ))}
      </div>
    </div>
  )
}

function ContactPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => {
      if (!current[name]) return current

      const nextErrors = { ...current }
      delete nextErrors[name]

      return nextErrors
    })

    if (notice) {
      setNotice('')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateContact(values)

    setErrors(nextErrors)
    setNotice('')

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = Object.keys(nextErrors)[0]

      window.requestAnimationFrame(() => {
        document
          .querySelector(`[name="${firstInvalid}"]`)
          ?.focus?.()
      })

      return
    }

    setNotice(
      'Your message is ready. Submission will be enabled after the backend API is connected.',
    )
  }

  const whatsappMessage = encodeURIComponent(
    `Hello Ganesh Pickles, my name is ${
      values.fullName || 'your customer'
    }. I would like to know more about your pickles.`,
  )

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/ganeshpickles',
      icon: <InstagramIcon />,
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/ganeshpickles',
      icon: <FacebookIcon />,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/919876543210?text=${whatsappMessage}`,
      icon: <WhatsAppIcon />,
    },
  ]

  const contactDetails = [
    {
      title: 'Visit us',
      value: 'Palakkad, Kerala',
      type: 'location',
    },
    {
      title: 'Call us',
      value: '+91 98765 43210',
      href: 'tel:+919876543210',
      type: 'phone',
    },
    {
      title: 'Email us',
      value: 'nuraniganeshpickles@yahoo.com',
      href: 'mailto:nuraniganeshpickles@yahoo.com',
      type: 'email',
    },
    {
      title: 'Business hours',
      value: 'Monday – Saturday, 9 AM – 6 PM',
      type: 'clock',
    },
  ]

  const getFieldClass = (fieldName) =>
    `w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:ring-4 ${
      errors[fieldName]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-[#dfe4cd] focus:border-[#88ad24] focus:ring-[#88ad24]/10'
    }`

  return (
    <main className="overflow-hidden bg-[#fbfaf4] text-[#302b1d]">
      {/* Contact hero */}
      <section className="relative overflow-hidden border-b border-[#e2e7d3]">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(91,103,67,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(91,103,67,0.075)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-16 sm:px-6 lg:min-h-[760px] lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
          {/* Hero text */}
          <div className="relative z-40">
            <p className="font-['Segoe_Print',cursive] text-xl font-bold text-[#332d18] sm:text-2xl">
              Bold flavours, honest conversations
            </p>

            <p className="mt-3 text-xs font-black uppercase tracking-[0.24em] text-[#7f9e20]">
              Contact Ganesh Pickles
            </p>

            <h1 className="mt-4 font-['Arial_Black',sans-serif] text-[clamp(2.5rem,12vw,3.75rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#88ad24] lg:text-10xl">
              Let&apos;s talk
              <span className="block">pickles!</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#5f594c] sm:text-lg">
              Contact us for bulk orders, delivery support, product
              information or feedback about mango, lemon, garlic,
              gooseberry, cut mango, tender mango and our other
              traditional Kerala pickle varieties.
            </p>
          </div>

          {/* Product image */}
          <ProductImageDisplay />
        </div>
      </section>

      {/* Contact form area */}
      <section className="relative py-14 lg:py-20">
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#dfe9b6]/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1280px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          {/* Business details */}
          <aside className="rounded-[32px] bg-[#2f351d] p-6 text-white shadow-[0_24px_65px_rgba(47,53,29,0.18)] sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8d15e]">
              Business details
            </p>

            <h2 className="mt-3 font-['Segoe_Print',cursive] text-3xl font-bold sm:text-4xl">
              Reach Ganesh Pickles
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Contact our team for product enquiries, order support,
              deliveries and bulk purchases.
            </p>

            <div className="mt-8 grid gap-3">
              {contactDetails.map((detail) => {
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#c2da6a]">
                      <ContactIcon type={detail.type} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-[0.12em] text-white/45">
                        {detail.title}
                      </span>

                      <span className="mt-1 block break-words text-sm font-semibold">
                        {detail.value}
                      </span>
                    </span>
                  </>
                )

                if (detail.href) {
                  return (
                    <a
                      key={detail.title}
                      href={detail.href}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#b8d15e]/40 hover:bg-white/[0.08]"
                    >
                      {content}
                    </a>
                  )
                }

                return (
                  <div
                    key={detail.title}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    {content}
                  </div>
                )
              })}
            </div>

            <div className="mt-8 border-t border-white/10 pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                Follow and message us
              </p>

              <div className="mt-4 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] transition duration-300 hover:-translate-y-1 hover:border-[#b8d15e] hover:bg-[#b8d15e] hover:text-[#2f351d] focus:outline-none focus:ring-2 focus:ring-[#b8d15e] focus:ring-offset-2 focus:ring-offset-[#2f351d]"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[32px] border border-[#e0e5d2] bg-white p-6 shadow-[0_24px_65px_rgba(65,72,38,0.08)] sm:p-8 lg:p-10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bf1c1c]">
              Send a message
            </p>

            <h2 className="mt-3 font-['Segoe_Print',cursive] text-3xl font-bold sm:text-4xl">
              How can we help You?
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Complete the form below and share your question with our
              team.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Full name

                <input
                  className={getFieldClass('fullName')}
                  name="fullName"
                  type="text"
                  value={values.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(errors.fullName)}
                />

                {errors.fullName && (
                  <span className="text-xs font-semibold text-red-600">
                    {errors.fullName}
                  </span>
                )}
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Phone number

                <input
                  className={getFieldClass('phone')}
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  aria-invalid={Boolean(errors.phone)}
                />

                {errors.phone && (
                  <span className="text-xs font-semibold text-red-600">
                    {errors.phone}
                  </span>
                )}
              </label>

              <label className="grid gap-2 text-sm font-bold md:col-span-2">
                Email address

                <input
                  className={getFieldClass('email')}
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                />

                {errors.email && (
                  <span className="text-xs font-semibold text-red-600">
                    {errors.email}
                  </span>
                )}
              </label>

              <label className="grid gap-2 text-sm font-bold md:col-span-2">
                Message

                <textarea
                  className={`${getFieldClass(
                    'message',
                  )} min-h-40 resize-y`}
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  aria-invalid={Boolean(errors.message)}
                />

                {errors.message && (
                  <span className="text-xs font-semibold text-red-600">
                    {errors.message}
                  </span>
                )}
              </label>
            </div>

            {notice && (
              <div className="mt-6 rounded-2xl border border-[#dbe5b7] bg-[#f3f7e5] p-4 text-sm font-semibold text-[#5c7118]">
                {notice}
              </div>
            )}

            <button
              type="submit"
              className="group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#902411] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(113,143,26,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#718f1a] hover:shadow-[0_16px_35px_rgba(113,143,26,0.3)] focus:outline-none focus:ring-2 focus:ring-[#88ad24] focus:ring-offset-2 sm:w-auto"
            >
              Send Message

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
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default ContactPage
