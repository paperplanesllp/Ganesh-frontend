function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {eyebrow && <p className="mb-3 text-sm font-bold uppercase text-brand">{eyebrow}</p>}
        <h1 className="max-w-3xl font-[Georgia,serif] text-3xl font-bold leading-tight text-black sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">{description}</p>}
      </div>
    </section>
  )
}

export default PageHeader
