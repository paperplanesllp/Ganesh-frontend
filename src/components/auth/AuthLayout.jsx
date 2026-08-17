import { Link } from 'react-router-dom'

function DecorativeDots({ className = '' }) {
  return (
    <div className={`grid grid-cols-5 gap-1.5 opacity-45 ${className}`} aria-hidden="true">
      {Array.from({ length: 15 }).map((_, index) => (
        <span key={index} className="h-1 w-1 rounded-full bg-[#171717]" />
      ))}
    </div>
  )
}

function AuthLayout({ badge, title, subtitle, variant = 'split', children }) {
  const isSingleColumn = variant === 'single'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ee] px-4 py-6 text-[#171717] sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-44 top-10 h-[520px] w-[520px] rounded-full border-[70px] border-white/45" />
        <div className="absolute -right-56 top-1/3 h-[620px] w-[620px] rounded-full border-[86px] border-white/50" />
        <div className="absolute left-1/3 top-0 h-[420px] w-[420px] rounded-full border-[64px] border-white/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),transparent_55%)]" />
      </div>

      <DecorativeDots className="absolute left-5 top-24 sm:left-12" />
      <DecorativeDots className="absolute right-5 top-20 sm:right-12" />
      <DecorativeDots className="absolute bottom-20 left-5 sm:left-12" />
      <DecorativeDots className="absolute bottom-16 right-5 sm:right-12" />

      <div className={`relative mx-auto flex min-h-[calc(100vh-3rem)] flex-col sm:min-h-[calc(100vh-5rem)] ${isSingleColumn ? 'max-w-2xl' : 'max-w-5xl justify-center'}`}>
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
            <img
              src="/images/ganesh-logo-navbar.png"
              alt="Ganesh Pickles"
              className="h-10 w-auto object-contain transition group-hover:opacity-90 sm:h-12"
            />
            <span>
              <span className="block font-[Georgia,serif] text-xl font-bold leading-tight text-brand-dark">Ganesh Pickles</span>
              <span className="hidden text-xs font-medium text-gray-500 sm:block">Traditional taste, made with care</span>
            </span>
          </Link>
          <Link
            to="/products"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand"
          >
            Back to shop
          </Link>
        </header>

        <div className={`grid overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_24px_70px_rgba(50,30,20,0.10)] ${isSingleColumn ? '' : 'lg:grid-cols-[0.82fr_1.18fr]'}`}>
          {!isSingleColumn && <aside className="relative hidden overflow-hidden bg-brand-dark p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[44px] border-white/5" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full border-[52px] border-white/5" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">{badge}</p>
              <h2 className="mt-5 max-w-sm font-[Georgia,serif] text-4xl font-bold leading-[1.12]">{title}</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/75">{subtitle}</p>
            </div>
            <p className="relative mt-16 border-t border-white/15 pt-6 text-xs leading-5 text-white/60">
              Small-batch Kerala flavours, delivered from our kitchen to your table.
            </p>
          </aside>}

          <section className={`p-6 sm:p-10 ${isSingleColumn ? 'lg:p-10' : 'lg:p-12'}`}>{children}</section>
        </div>

        <p className="mt-5 text-center text-xs text-gray-500">© Ganesh Pickles · Secure account access</p>
      </div>
    </main>
  )
}

export default AuthLayout
