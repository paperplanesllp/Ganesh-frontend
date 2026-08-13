import { useEffect } from 'react'

function PolicyPageLayout({ title, sections }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | Ganesh Pickles`

    return () => {
      document.title = previousTitle
    }
  }, [title])

  return (
    <div className="bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="text-sm font-bold uppercase tracking-wide text-brand">Legal</p>
          <h1 className="mt-3 font-[Georgia,serif] text-3xl font-bold leading-tight text-brand-dark sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Last Updated:</span> 13 August 2026
          </p>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="space-y-9 sm:space-y-10">
          {sections.map((section, index) => (
            <section key={section.title}>
              <h2 className="font-[Georgia,serif] text-xl font-bold leading-snug text-brand-dark sm:text-2xl">
                {index + 1}. {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-[15px] leading-7 text-gray-700 sm:text-base sm:leading-8">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  )
}

export default PolicyPageLayout
