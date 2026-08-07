import { calculatePasswordStrength } from '../../utils/authValidation'

const strengthColors = ['', 'bg-brand', 'bg-brand', 'bg-brand', 'bg-brand']

function PasswordStrength({ password }) {
  const strength = calculatePasswordStrength(password)

  if (!password) return null

  return (
    <div className="rounded-xl bg-brand-light p-3" aria-live="polite">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-gray-900">Password strength</span>
        <span className="font-bold text-brand">{strength.label}</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={`h-2 rounded-full ${step <= strength.score ? strengthColors[strength.score] : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default PasswordStrength

