import { useState } from 'react'

function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.75 12s3.5-6.25 9.25-6.25S21.25 12 21.25 12 17.75 18.25 12 18.25 2.75 12 2.75 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14.75A2.75 2.75 0 1 0 12 9.25a2.75 2.75 0 0 0 0 5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.58 10.58a2.75 2.75 0 0 0 3.84 3.84" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.2 7.53C4.39 9.06 2.75 12 2.75 12s3.5 6.25 9.25 6.25c1.55 0 2.94-.45 4.15-1.12M10.45 5.91c.5-.1 1.02-.16 1.55-.16 5.75 0 9.25 6.25 9.25 6.25s-.74 1.32-2.07 2.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PasswordInput({
  label,
  name,
  value,
  placeholder,
  error,
  required = false,
  autoComplete,
  disabled = false,
  onChange,
  onBlur,
  helperText,
  inputRef,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const inputId = `auth-${name}`
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-brand"> *</span>}
      </label>
      <div className="relative mt-2">
        <input
          id={inputId}
          name={name}
          type={isVisible ? 'text' : 'password'}
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
          className={`min-h-12 w-full rounded-xl border bg-[#fcfcfb] py-3 pl-4 pr-12 text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
            error ? 'border-brand' : 'border-gray-200'
          }`}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition duration-200 hover:bg-brand-light hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          disabled={disabled}
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
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

export default PasswordInput
