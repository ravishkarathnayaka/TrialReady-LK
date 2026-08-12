export interface BranchValidationInput {
  name: string
  address: string
  phone: string
  email: string
}

export type BranchValidationErrors = Partial<
  Record<keyof BranchValidationInput, string>
>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+\-()\s]+$/

export function validateBranch(
  input: BranchValidationInput,
): BranchValidationErrors {
  const errors: BranchValidationErrors = {}

  if (!input.name.trim()) {
    errors.name = 'Branch name is required.'
  }

  if (input.email.trim()) {
    if (!EMAIL_PATTERN.test(input.email.trim())) {
      errors.email = 'Enter a valid email address.'
    }
  }

  if (input.phone.trim()) {
    if (!PHONE_PATTERN.test(input.phone.trim())) {
      errors.phone = 'Enter a valid phone number.'
    }
  }

  return errors
}

export function hasBranchValidationErrors(
  errors: BranchValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

export function optionalText(value: string): string | null {
  const trimmedValue = value.trim()

  return trimmedValue ? trimmedValue : null
}