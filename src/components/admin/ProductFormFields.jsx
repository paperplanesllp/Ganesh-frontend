export function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-sm font-medium text-brand">
      {message}
    </p>
  )
}

export function TextInput({ label, name, value, error, onChange, type = 'text', required = false, placeholder = '', helper = '', children, ...inputProps }) {
  const errorId = `${name.replaceAll('.', '-')}-error`
  const helperId = helper ? `${name.replaceAll('.', '-')}-helper` : undefined
  const describedBy = [helperId, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
  return (
    <label className="grid gap-2 text-sm font-medium text-gray-900">
      <span>{label}</span>
      {helper && <span id={helperId} className="-mt-1 text-xs font-normal text-gray-600">{helper}</span>}
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className="min-h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        onChange={onChange}
        {...inputProps}
      />
      {children}
      <FieldError id={errorId} message={error} />
    </label>
  )
}

export function TextArea({ label, name, value, error, onChange, rows = 4, required = false, helper = '' }) {
  const errorId = `${name.replaceAll('.', '-')}-error`
  const helperId = helper ? `${name.replaceAll('.', '-')}-helper` : undefined
  const describedBy = [helperId, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
  return (
    <label className="grid gap-2 text-sm font-medium text-gray-900">
      <span>{label}</span>
      {helper && <span id={helperId} className="-mt-1 text-xs font-normal text-gray-600">{helper}</span>}
      <textarea
        name={name}
        value={value}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        onChange={onChange}
      />
      <FieldError id={errorId} message={error} />
    </label>
  )
}

export function SelectField({ label, name, value, error, onChange, options }) {
  const errorId = `${name.replaceAll('.', '-')}-error`
  return (
    <label className="grid gap-2 text-sm font-medium text-gray-900">
      {label}
      <select
        name={name}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="min-h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </label>
  )
}

export function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>}
      </div>
      {children}
    </section>
  )
}
