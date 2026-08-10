import { useState, type FormEvent } from 'react'
import type { CreateStudentInput, Student } from '../types/student'
import {
  hasStudentValidationErrors,
  normalizeOptionalText,
  validateStudentInput,
  type StudentValidationErrors,
} from '../utils/studentValidation'

export interface StudentSelectOption {
  value: string
  label: string
}

interface StudentFormProps {
  drivingSchoolId: string
  branchOptions?: StudentSelectOption[]
  instructorOptions?: StudentSelectOption[]
  initialStudent?: Student | null
  isSubmitting?: boolean
  onSubmit: (student: CreateStudentInput) => Promise<void> | void
  onCancel?: () => void
}

interface StudentFormState {
  branch_id: string
  primary_instructor_id: string
  student_code: string
  full_name: string
  nic: string
  date_of_birth: string
  phone: string
  email: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  registration_date: string
  is_active: boolean
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

const initialFormState: StudentFormState = {
  branch_id: '',
  primary_instructor_id: '',
  student_code: '',
  full_name: '',
  nic: '',
  date_of_birth: '',
  phone: '',
  email: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  registration_date: getTodayDate(),
  is_active: true,
}

function studentToFormState(student: Student): StudentFormState {
  return {
    branch_id: student.branch_id ?? '',
    primary_instructor_id: student.primary_instructor_id ?? '',
    student_code: student.student_code ?? '',
    full_name: student.full_name,
    nic: student.nic ?? '',
    date_of_birth: student.date_of_birth ?? '',
    phone: student.phone ?? '',
    email: student.email ?? '',
    address: student.address ?? '',
    emergency_contact_name: student.emergency_contact_name ?? '',
    emergency_contact_phone: student.emergency_contact_phone ?? '',
    registration_date: student.registration_date,
    is_active: student.is_active,
  }
}

function StudentForm({
  drivingSchoolId,
  branchOptions = [],
  instructorOptions = [],
  initialStudent = null,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const [form, setForm] = useState<StudentFormState>(() =>
    initialStudent ? studentToFormState(initialStudent) : initialFormState,
  )

  const [errors, setErrors] = useState<StudentValidationErrors>({})


  function updateField<K extends keyof StudentFormState>(
    field: K,
    value: StudentFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const studentInput: CreateStudentInput = {
      driving_school_id: drivingSchoolId,
      branch_id: normalizeOptionalText(form.branch_id),
      primary_instructor_id: normalizeOptionalText(
        form.primary_instructor_id,
      ),
      student_code: normalizeOptionalText(form.student_code),
      full_name: form.full_name.trim(),
      nic: normalizeOptionalText(form.nic),
      date_of_birth: normalizeOptionalText(form.date_of_birth),
      phone: normalizeOptionalText(form.phone),
      email: normalizeOptionalText(form.email),
      address: normalizeOptionalText(form.address),
      emergency_contact_name: normalizeOptionalText(
        form.emergency_contact_name,
      ),
      emergency_contact_phone: normalizeOptionalText(
        form.emergency_contact_phone,
      ),
      registration_date: form.registration_date,
      is_active: form.is_active,
    }

    const validationErrors = validateStudentInput(studentInput)

    if (hasStudentValidationErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    await onSubmit(studentInput)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Student Registration
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the student's personal and registration information.
        </p>
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Student Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="full_name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Full Name *
            </label>

            <input
              id="full_name"
              type="text"
              value={form.full_name}
              onChange={(event) =>
                updateField('full_name', event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter student's full name"
            />

            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.full_name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="student_code"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Student Code
            </label>

            <input
              id="student_code"
              type="text"
              value={form.student_code}
              onChange={(event) =>
                updateField('student_code', event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter student code"
            />
          </div>

          <div>
            <label
              htmlFor="nic"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              NIC
            </label>

            <input
              id="nic"
              type="text"
              value={form.nic}
              onChange={(event) => updateField('nic', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter NIC number"
            />
          </div>

          <div>
            <label
              htmlFor="date_of_birth"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Date of Birth
            </label>

            <input
              id="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={(event) =>
                updateField('date_of_birth', event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />

            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField('phone', event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField('email', event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="student@example.com"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="address"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Address
          </label>

          <textarea
            id="address"
            rows={3}
            value={form.address}
            onChange={(event) =>
              updateField('address', event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="Enter residential address"
          />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Driving School Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="branch_id"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Branch
            </label>

            <select
              id="branch_id"
              value={form.branch_id}
              onChange={(event) =>
                updateField('branch_id', event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">No branch selected</option>

              {branchOptions.map((branch) => (
                <option key={branch.value} value={branch.value}>
                  {branch.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="primary_instructor_id"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Primary Instructor
            </label>

            <select
              id="primary_instructor_id"
              value={form.primary_instructor_id}
              onChange={(event) =>
                updateField(
                  'primary_instructor_id',
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Not assigned</option>

              {instructorOptions.map((instructor) => (
                <option
                  key={instructor.value}
                  value={instructor.value}
                >
                  {instructor.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="registration_date"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Registration Date *
            </label>

            <input
              id="registration_date"
              type="date"
              value={form.registration_date}
              onChange={(event) =>
                updateField('registration_date', event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />

            {errors.registration_date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.registration_date}
              </p>
            )}
          </div>

          <div className="flex items-center pt-7">
            <input
              id="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                updateField('is_active', event.target.checked)
              }
              className="h-4 w-4"
            />

            <label
              htmlFor="is_active"
              className="ml-2 text-sm font-medium text-slate-700"
            >
              Active student
            </label>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Emergency Contact
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="emergency_contact_name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Contact Name
            </label>

            <input
              id="emergency_contact_name"
              type="text"
              value={form.emergency_contact_name}
              onChange={(event) =>
                updateField(
                  'emergency_contact_name',
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Emergency contact name"
            />
          </div>

          <div>
            <label
              htmlFor="emergency_contact_phone"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Contact Phone
            </label>

            <input
              id="emergency_contact_phone"
              type="tel"
              value={form.emergency_contact_phone}
              onChange={(event) =>
                updateField(
                  'emergency_contact_phone',
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Emergency contact number"
            />
          </div>
        </div>
      </section>

      {errors.driving_school_id && (
        <p className="text-sm text-red-600">
          {errors.driving_school_id}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Register Student'}
        </button>
      </div>
    </form>
  )
}

export default StudentForm