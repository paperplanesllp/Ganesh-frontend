import RatingStars from './RatingStars'

function RatingSummary({ summary }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="rounded-2xl bg-brand-light p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-brand">Average Rating</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <span className="font-[Georgia,serif] text-5xl font-bold text-brand-dark">{summary.average.toFixed(1)}</span>
            <div className="pb-1">
              <RatingStars rating={summary.average} showValue={false} />
              <p className="mt-2 text-sm font-semibold text-gray-600">{summary.total} reviews</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {summary.distribution.map((item) => (
            <div key={item.stars} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm font-semibold text-gray-700">
              <span>{item.stars}★</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-brand" style={{ width: `${item.percent}%` }} />
              </div>
              <span>{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RatingSummary
