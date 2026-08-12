export interface InstructorValidationInput {
  employee_code: string
  full_name: string
  nic: string
  phone: string
  email: string
  driving_licence_number: string
  driving_licence_expiry_date: string
  joined_date: string
}

export type InstructorValidationErrors = Partial<
  Record<keyof InstructorValidationInput, string>
>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+\-()\s]+$/

export function validateInstructor(
  input: InstructorValidationInput,
): InstructorValidationErrors {
  const errors: InstructorValidationErrors = {}

  if (!input.full_name.trim()) {
    errors.full_name = 'Instructor name is required.'
  }

  if (
    input.email.trim() &&
    !EMAIL_PATTERN.test(input.email.trim())
  ) {
    errors.email = 'Enter a valid email address.'
  }

  if (
    input.phone.trim() &&
    !PHONE_PATTERN.test(input.phone.trim())
  ) {
    errors.phone = 'Enter a valid phone number.'
  }

  if (
    input.driving_licence_expiry_date &&
    input.joined_date &&
    input.driving_licence_expiry_date < input.joined_date
  ) {
    errors.driving_licence_expiry_date =
      'Licence expiry date cannot be before the joined date.'
  }

  return errors
}

export function hasInstructorValidationErrors(
  errors: InstructorValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

export function optionalInstructorText(
  value: string,
): string | null {
  const trimmedValue = value.trim()

  return trimmedValue ? trimmedValue : null
}