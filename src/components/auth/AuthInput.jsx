function AuthInput({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  error,
  required = false,
  autoComplete,
  disabled = false,
  onChange,
  onBlur,
  helperText,
  icon,
  inputRef,
}) {
  const inputId = `auth-${name}`
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-brand"> *</span>}
      </label>
      <div className="relative mt-2">
        {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">{icon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          ref={inputRef}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`min-h-12 w-full rounded-xl border bg-[#fcfcfb] py-3 pr-4 text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
            icon ? 'pl-11' : 'pl-4'
          } ${error ? 'border-brand' : 'border-gray-200'}`}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-2 text-sm font-semibold text-brand">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-2 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default AuthInput
