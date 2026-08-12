import { useState, type FormEvent } from 'react'
import type {
  Branch,
  CreateBranchInput,
  UpdateBranchInput,
} from '../types/branch'
import {
  hasBranchValidationErrors,
  optionalText,
  validateBranch,
  type BranchValidationErrors,
} from '../utils/branchValidation'

interface BranchFormProps {
  drivingSchoolId: string
  initialBranch?: Branch
  onSubmit: (
    input: CreateBranchInput | UpdateBranchInput,
  ) => Promise<void>
  onCancel: () => void
}

interface BranchFormState {
  name: string
  address: string
  phone: string
  email: string
  is_active: boolean
}

function createInitialState(
  branch?: Branch,
): BranchFormState {
  return {
    name: branch?.name ?? '',
    address: branch?.address ?? '',
    phone: branch?.phone ?? '',
    email: branch?.email ?? '',
    is_active: branch?.is_active ?? true,
  }
}

function BranchForm({
  drivingSchoolId,
  initialBranch,
  onSubmit,
  onCancel,
}: BranchFormProps) {
  const [form, setForm] = useState<BranchFormState>(() =>
    createInitialState(initialBranch),
  )
  const [errors, setErrors] =
    useState<BranchValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(
    null,
  )

  const isEditing = Boolean(initialBranch)

  function updateField<K extends keyof BranchFormState>(
    field: K,
    value: BranchFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    if (
      field === 'name' ||
      field === 'address' ||
      field === 'phone' ||
      field === 'email'
    ) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }))
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const validationErrors = validateBranch({
      name: form.name,
      address: form.address,
      phone: form.phone,
      email: form.email,
    })

    setErrors(validationErrors)
    setSubmitError(null)

    if (hasBranchValidationErrors(validationErrors)) {
      return
    }

    const commonInput = {
      name: form.name.trim(),
      address: optionalText(form.address),
      phone: optionalText(form.phone),
      email: optionalText(form.email),
      is_active: form.is_active,
    }

    const input: CreateBranchInput | UpdateBranchInput =
      initialBranch
        ? commonInput
        : {
            driving_school_id: drivingSchoolId,
            ...commonInput,
          }

    try {
      setIsSubmitting(true)
      await onSubmit(input)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to save branch.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {isEditing ? 'Edit Branch' : 'Add Branch'}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isEditing
            ? 'Update the branch information below.'
            : 'Enter the information for the new driving school branch.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="branch-name"
              className="mb-2 block text-sm font-medium text-slate-900"
            >
              Branch Name *
            </label>

            <input
              id="branch-name"
              type="text"
              value={form.name}
              onChange={(event) =>
                updateField('name', event.target.value)
              }
              placeholder="Enter branch name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="branch-phone"
              className="mb-2 block text-sm font-medium text-slate-900"
            >
              Phone
            </label>

            <input
              id="branch-phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField('phone', event.target.value)
              }
              placeholder="Enter branch phone number"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="branch-email"
              className="mb-2 block text-sm font-medium text-slate-900"
            >
              Email
            </label>

            <input
              id="branch-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField('email', event.target.value)
              }
              placeholder="branch@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="branch-address"
              className="mb-2 block text-sm font-medium text-slate-900"
            >
              Address
            </label>

            <textarea
              id="branch-address"
              value={form.address}
              onChange={(event) =>
                updateField('address', event.target.value)
              }
              placeholder="Enter branch address"
              rows={3}
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  updateField(
                    'is_active',
                    event.target.checked,
                  )
                }
                className="h-4 w-4"
              />

              Active branch
            </label>
          </div>
        </div>

        {submitError && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submitError}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Add Branch'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default BranchForm