import type { CreateStudentInput } from '../types/student'

export type StudentValidationErrors = Partial<
  Record<keyof CreateStudentInput, string>
>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateStudentInput(
  input: CreateStudentInput,
): StudentValidationErrors {
  const errors: StudentValidationErrors = {}

  if (!input.driving_school_id.trim()) {
    errors.driving_school_id = 'Driving school is required.'
  }

  if (!input.full_name.trim()) {
    errors.full_name = 'Full name is required.'
  } else if (input.full_name.trim().length < 2) {
    errors.full_name = 'Full name must contain at least 2 characters.'
  }

  if (!input.registration_date) {
    errors.registration_date = 'Registration date is required.'
  }

  if (
    input.email &&
    input.email.trim() &&
    !EMAIL_PATTERN.test(input.email.trim())
  ) {
    errors.email = 'Enter a valid email address.'
  }

  if (input.date_of_birth) {
    const dateOfBirth = new Date(`${input.date_of_birth}T00:00:00`)
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    if (Number.isNaN(dateOfBirth.getTime())) {
      errors.date_of_birth = 'Enter a valid date of birth.'
    } else if (dateOfBirth > today) {
      errors.date_of_birth = 'Date of birth cannot be in the future.'
    }
  }

  return errors
}

export function hasStudentValidationErrors(
  errors: StudentValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

export function normalizeOptionalText(
  value: string | null | undefined,
): string | null {
  if (value == null) {
    return null
  }

  const normalizedValue = value.trim()

  return normalizedValue.length > 0 ? normalizedValue : null
}