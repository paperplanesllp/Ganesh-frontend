export const isRequired = (value) => String(value ?? '').trim().length > 0

export const isIndianMobileNumber = (value) => /^[6-9]\d{9}$/.test(String(value).trim())

export const isEmailAddress = (value) => /^\S+@\S+\.\S+$/.test(String(value).trim())

export const isIndianPinCode = (value) => /^\d{6}$/.test(String(value).trim())

export function validateCheckout(values) {
  const errors = {}

  if (!isRequired(values.fullName)) errors.fullName = 'Full name is required.'
  if (!isIndianMobileNumber(values.phone)) errors.phone = 'Enter a valid Indian mobile number.'
  if (!isEmailAddress(values.email)) errors.email = 'Enter a valid email address.'
  if (!isRequired(values.addressLine1)) errors.addressLine1 = 'Address line 1 is required.'
  if (!isRequired(values.city)) errors.city = 'City is required.'
  if (!isRequired(values.district)) errors.district = 'District is required.'
  if (!isRequired(values.state)) errors.state = 'State is required.'
  if (!isIndianPinCode(values.pincode)) errors.pincode = 'Enter a valid 6-digit PIN code.'

  return errors
}

export function validateContact(values) {
  const errors = {}

  if (!isRequired(values.from_name)) errors.from_name = 'Full name is required.'
  if (!isIndianMobileNumber(values.phone)) errors.phone = 'Enter a valid Indian mobile number.'
  if (!isEmailAddress(values.from_email)) errors.from_email = 'Enter a valid email address.'
  if (!isRequired(values.subject)) errors.subject = 'Subject is required.'
  if (!isRequired(values.message)) errors.message = 'Message is required.'

  return errors
}
