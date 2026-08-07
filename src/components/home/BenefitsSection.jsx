const benefits = [
  ['Traditional recipes', 'Kerala-style spice balances that feel familiar, warm, and homemade.'],
  ['Carefully selected ingredients', 'Produce and spices are chosen for texture, aroma, and freshness.'],
  ['Hygienically prepared', 'Small batches are handled carefully in a clean preparation flow.'],
  ['Secure online ordering', 'A simple cart and checkout flow is ready for safe payment integration.'],
]

function BenefitsSection() {
  return (
    <section className="bg-brand-light py-16">
      <div className="mx-auto grid max-w-[1280px] gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {benefits.map(([title, text]) => (
          <article key={title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-[Georgia,serif] text-xl font-bold text-brand-dark">{title}</h2>
            <p className="mt-3 leading-7 text-gray-600">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BenefitsSection
