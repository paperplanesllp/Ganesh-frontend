function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" />
    </svg>
  )
}

function IconButton({ label, children, disabled, danger = false, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`grid h-9 w-9 place-items-center rounded-lg border text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-45 ${
        danger ? 'border-brand-light bg-brand-light text-brand' : 'border-gray-200 bg-white text-brand'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function ProductMediaCard({
  item,
  index,
  total,
  onAltChange,
  onSetPrimary,
  onMove,
  onRemove,
  onRetry,
}) {
  const isUploading = item.status === 'uploading'
  const src = item.previewUrl || item.url

  return (
    <article className="grid gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {src ? (
          <img src={src} alt={item.alt || 'Product image preview'} className="h-40 w-full object-contain" />
        ) : (
          <div className="grid h-40 place-items-center text-sm font-bold text-gray-600">Image preview</div>
        )}
        {item.isPrimary && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-1 text-xs font-extrabold text-white">
            Primary
          </span>
        )}
        {isUploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/75 text-brand" role="status" aria-live="polite">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold shadow">
              <Spinner /> Uploading image...
            </span>
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-extrabold uppercase text-gray-600" htmlFor={`media-alt-${item.id}`}>
          Alt text
        </label>
        <input
          id={`media-alt-${item.id}`}
          value={item.alt || ''}
          maxLength={160}
          disabled={isUploading}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:bg-gray-100"
          onChange={(event) => onAltChange(index, event.target.value)}
        />
      </div>

      {item.fileName && <p className="break-words text-xs font-bold text-gray-600">{item.fileName}</p>}
      {item.error && (
        <p className="rounded-lg bg-brand-light p-2 text-sm font-bold text-brand" role="alert">
          {item.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={item.isPrimary || isUploading || item.status === 'error'}
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-brand disabled:opacity-45"
          onClick={() => onSetPrimary(index)}
        >
          Set Primary
        </button>
        <IconButton label="Move image left" disabled={index === 0 || isUploading} onClick={() => onMove(index, -1)}>
          <span aria-hidden="true">←</span>
        </IconButton>
        <IconButton label="Move image right" disabled={index === total - 1 || isUploading} onClick={() => onMove(index, 1)}>
          <span aria-hidden="true">→</span>
        </IconButton>
        {item.status === 'error' && (
          <button type="button" className="rounded-lg bg-brand px-3 py-2 text-xs font-extrabold text-white" onClick={() => onRetry(index)}>
            Retry
          </button>
        )}
        <IconButton label="Remove image" danger disabled={isUploading} onClick={() => onRemove(index)}>
          <span aria-hidden="true">×</span>
        </IconButton>
      </div>
    </article>
  )
}

export default ProductMediaCard
