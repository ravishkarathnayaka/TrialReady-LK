import React, { useState, type FormEvent } from 'react'
import type {
  CreateVehicleDocumentInput,
  VehicleDocument,
  VehicleDocumentType,
} from '../types/vehicleDocument'
import {
  hasVehicleDocumentValidationErrors,
  optionalText,
  validateVehicleDocument,
  type VehicleDocumentValidationErrors,
} from '../utils/vehicleValidation'

interface VehicleDocumentManagerProps {
  vehicleId: string
  drivingSchoolId: string
  documents: VehicleDocument[]
  onAddDocument: (input: CreateVehicleDocumentInput) => Promise<VehicleDocument>
  onDeleteDocument: (documentId: string) => Promise<void>
}

interface DocumentFormState {
  document_type: VehicleDocumentType | ''
  document_name: string
  reference_number: string
  issue_date: string
  expiry_date: string
  notes: string
}

const INITIAL_FORM: DocumentFormState = {
  document_type: 'revenue_licence',
  document_name: '',
  reference_number: '',
  issue_date: '',
  expiry_date: '',
  notes: '',
}

function getExpiryStatus(expiryDate?: string | null): {
  label: string
  badgeClass: string
} {
  if (!expiryDate) {
    return { label: 'No Expiry', badgeClass: 'bg-slate-100 text-slate-600' }
  }

  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays < 0) {
    return {
      label: `Expired (${Math.abs(diffDays)} days ago)`,
      badgeClass: 'bg-red-100 text-red-800 border border-red-200',
    }
  }

  if (diffDays <= 30) {
    return {
      label: `Expires in ${diffDays} days`,
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
    }
  }

  return {
    label: `Valid until ${expiryDate}`,
    badgeClass: 'bg-green-100 text-green-800 border border-green-200',
  }
}

export const VehicleDocumentManager: React.FC<VehicleDocumentManagerProps> = ({
  vehicleId,
  drivingSchoolId,
  documents,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<DocumentFormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<VehicleDocumentValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function updateField<K extends keyof DocumentFormState>(
    field: K,
    value: DocumentFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof VehicleDocumentValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateVehicleDocument({
      document_type: form.document_type,
      document_name: form.document_name,
      issue_date: form.issue_date,
      expiry_date: form.expiry_date,
    })

    setErrors(validationErrors)
    setErrorMessage(null)

    if (hasVehicleDocumentValidationErrors(validationErrors)) {
      return
    }

    try {
      setIsSubmitting(true)
      await onAddDocument({
        vehicle_id: vehicleId,
        driving_school_id: drivingSchoolId,
        document_type: form.document_type as VehicleDocumentType,
        document_name:
          form.document_type === 'other'
            ? form.document_name.trim()
            : form.document_type === 'revenue_licence'
              ? 'Revenue Licence'
              : 'Insurance Certificate',
        reference_number: optionalText(form.reference_number),
        issue_date: optionalText(form.issue_date),
        expiry_date: optionalText(form.expiry_date),
        notes: optionalText(form.notes),
        is_current: true,
      })

      setForm(INITIAL_FORM)
      setIsAdding(false)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to add document.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(docId: string) {
    try {
      setDeletingId(docId)
      setErrorMessage(null)
      await onDeleteDocument(docId)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to delete document.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Vehicle Documents
          </h3>
          <p className="text-xs text-slate-500">
            Track revenue licence, insurance policies, and compliance records.
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
          >
            + Add Document
          </button>
        )}
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Add Document Form */}
      {isAdding && (
        <section className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              New Document Record
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAdd} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Document Type *
                </label>
                <select
                  value={form.document_type}
                  onChange={(e) =>
                    updateField(
                      'document_type',
                      e.target.value as VehicleDocumentType,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="revenue_licence">Revenue Licence</option>
                  <option value="insurance">Insurance Certificate</option>
                  <option value="other">Other Compliance Document</option>
                </select>
                {errors.document_type && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.document_type}
                  </p>
                )}
              </div>

              {form.document_type === 'other' && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    value={form.document_name}
                    onChange={(e) =>
                      updateField('document_name', e.target.value)
                    }
                    placeholder="e.g. Fitness Certificate, Emission Report"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                  {errors.document_name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.document_name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Reference / Policy Number
                </label>
                <input
                  type="text"
                  value={form.reference_number}
                  onChange={(e) =>
                    updateField('reference_number', e.target.value)
                  }
                  placeholder="e.g. POL-9982341"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={form.issue_date}
                  onChange={(e) => updateField('issue_date', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={form.expiry_date}
                  onChange={(e) => updateField('expiry_date', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
                {errors.expiry_date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.expiry_date}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Notes
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="e.g. Annual comprehensive insurance via Sri Lanka Insurance"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : 'Save Document'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Document List */}
      {documents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No compliance documents recorded
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Add revenue licence and insurance records to monitor expiry alerts.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {documents.map((doc) => {
            const expiry = getExpiryStatus(doc.expiry_date)
            const isDeleting = deletingId === doc.id

            return (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 capitalize text-sm">
                      {doc.document_name ?? doc.document_type.replace('_', ' ')}
                    </span>
                    {doc.reference_number && (
                      <p className="font-mono text-xs text-slate-500">
                        Ref: {doc.reference_number}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${expiry.badgeClass}`}
                  >
                    {expiry.label}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Issue Date
                    </span>
                    <span>{doc.issue_date ?? 'Not recorded'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Expiry Date
                    </span>
                    <span>{doc.expiry_date ?? 'No expiry'}</span>
                  </div>
                </div>

                {doc.notes && (
                  <p className="mt-2 text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                    {doc.notes}
                  </p>
                )}

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    disabled={isDeleting}
                    className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    {isDeleting ? 'Removing...' : 'Delete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
