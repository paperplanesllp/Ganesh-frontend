// Frontend validation improves UX only. The backend must independently validate every auth field.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INDIAN_PHONE_PATTERN = /^[6-9]\d{9}$/

export function validateFullName(value) {
  const normalized = String(value || '').trim()
  if (!normalized) return 'Full name is required.'
  if (normalized.length < 2) return 'Full name must be at least 2 characters.'
  return ''
}

export function normalizeIndianPhone(value) {
  return String(value || '')
    .trim()
    .replace(/[\s-]/g, '')
    .replace(/^\+91/, '')
    .replace(/^91(?=[6-9]\d{9}$)/, '')
}

export function validateIndianPhone(value) {
  const normalized = normalizeIndianPhone(value)
  if (!normalized) return 'Mobile number is required.'
  if (!INDIAN_PHONE_PATTERN.test(normalized)) return 'Enter a valid 10-digit Indian mobile number.'
  return ''
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function validateEmail(value) {
  const normalized = normalizeEmail(value)
  if (!normalized) return 'Email address is required.'
  if (!EMAIL_PATTERN.test(normalized)) return 'Enter a valid email address.'
  return ''
}

export function validatePassword(value) {
  const password = String(value || '')
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (password.length > 128) return 'Password must be 128 characters or fewer.'
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.'
  if (!/\d/.test(password)) return 'Password must include a number.'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include a special character.'
  return ''
}

export function validatePasswordConfirmation(password, confirmation) {
  if (!confirmation) return 'Please confirm your password.'
  if (password !== confirmation) return 'Passwords do not match.'
  return ''
}

export function calculatePasswordStrength(value) {
  const password = String(value || '')
  if (!password) return { label: '', score: 0 }

  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 2) return { label: 'Weak', score: 1 }
  if (score === 3) return { label: 'Fair', score: 2 }
  if (score === 4) return { label: 'Good', score: 3 }
  return { label: 'Strong', score: 4 }
}

