import React, { useState, type FormEvent } from 'react'
import type {
  VehicleAvailabilityStatus,
} from '../types/vehicle'
import type {
  CreateVehicleAvailabilityPeriodInput,
  VehicleAvailabilityPeriod,
} from '../types/vehicleAvailability'
import {
  hasVehicleAvailabilityValidationErrors,
  optionalText,
  validateVehicleAvailability,
  type VehicleAvailabilityValidationErrors,
} from '../utils/vehicleValidation'

interface VehicleAvailabilityManagerProps {
  vehicleId: string
  drivingSchoolId: string
  currentAvailability: VehicleAvailabilityStatus
  availabilityPeriods: VehicleAvailabilityPeriod[]
  onChangeAvailabilityStatus: (
    status: VehicleAvailabilityStatus,
  ) => Promise<unknown>
  onAddAvailabilityPeriod: (
    input: CreateVehicleAvailabilityPeriodInput,
  ) => Promise<VehicleAvailabilityPeriod>
}

interface PeriodFormState {
  availability_status: VehicleAvailabilityStatus | ''
  starts_at: string
  ends_at: string
  reason: string
  notes: string
}

function getInitialPeriodForm(): PeriodFormState {
  const now = new Date()
  const startsAt = now.toISOString().slice(0, 16)
  return {
    availability_status: 'unavailable',
    starts_at: startsAt,
    ends_at: '',
    reason: '',
    notes: '',
  }
}

export const VehicleAvailabilityManager: React.FC<
  VehicleAvailabilityManagerProps
> = ({
  vehicleId,
  drivingSchoolId,
  currentAvailability,
  availabilityPeriods,
  onChangeAvailabilityStatus,
  onAddAvailabilityPeriod,
}) => {
  const [isLoggingPeriod, setIsLoggingPeriod] = useState(false)
  const [form, setForm] = useState<PeriodFormState>(getInitialPeriodForm)
  const [errors, setErrors] =
    useState<VehicleAvailabilityValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function updateField<K extends keyof PeriodFormState>(
    field: K,
    value: PeriodFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof VehicleAvailabilityValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleQuickStatusChange(status: VehicleAvailabilityStatus) {
    if (status === currentAvailability) return

    try {
      setIsUpdatingStatus(true)
      setErrorMessage(null)
      await onChangeAvailabilityStatus(status)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to update availability status.',
      )
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  async function handleAddPeriod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateVehicleAvailability({
      availability_status: form.availability_status,
      starts_at: form.starts_at,
      ends_at: form.ends_at,
      reason: form.reason,
    })

    setErrors(validationErrors)
    setErrorMessage(null)

    if (hasVehicleAvailabilityValidationErrors(validationErrors)) {
      return
    }

    try {
      setIsSubmitting(true)
      await onAddAvailabilityPeriod({
        vehicle_id: vehicleId,
        driving_school_id: drivingSchoolId,
        availability_status:
          form.availability_status as VehicleAvailabilityStatus,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: form.ends_at
          ? new Date(form.ends_at).toISOString()
          : null,
        reason: optionalText(form.reason),
        notes: optionalText(form.notes),
        is_active: true,
      })

      setForm(getInitialPeriodForm())
      setIsLoggingPeriod(false)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to record availability period.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Availability Status Switcher */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Current Availability Status
        </h4>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(['available', 'unavailable', 'in_maintenance'] as const).map(
            (status) => {
              const isSelected = currentAvailability === status
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleQuickStatusChange(status)}
                  disabled={isUpdatingStatus}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition-all ${
                    isSelected
                      ? status === 'available'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                        : status === 'in_maintenance'
                          ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                          : 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/30'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  } disabled:opacity-60`}
                >
                  {status.replace('_', ' ')}
                  {isSelected && ' (Current)'}
                </button>
              )
            },
          )}
        </div>
      </section>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Header & Log Downtime CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Availability & Downtime Schedule
          </h3>
          <p className="text-xs text-slate-500">
            Schedule future downtime or log periods when this vehicle is unavailable for sessions.
          </p>
        </div>

        {!isLoggingPeriod && (
          <button
            type="button"
            onClick={() => setIsLoggingPeriod(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
          >
            + Log Downtime / Availability Period
          </button>
        )}
      </div>

      {/* Log Availability Period Form */}
      {isLoggingPeriod && (
        <section className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              Schedule / Record Downtime Period
            </h4>
            <button
              type="button"
              onClick={() => setIsLoggingPeriod(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddPeriod} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Status During Period *
                </label>
                <select
                  value={form.availability_status}
                  onChange={(e) =>
                    updateField(
                      'availability_status',
                      e.target.value as VehicleAvailabilityStatus,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="unavailable">Unavailable</option>
                  <option value="in_maintenance">In Maintenance</option>
                  <option value="available">Available (Restore)</option>
                </select>
                {errors.availability_status && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.availability_status}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Reason / Purpose *
                </label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) => updateField('reason', e.target.value)}
                  placeholder="e.g. Scheduled clutch replacement, Accident repair"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
                {errors.reason && (
                  <p className="mt-1 text-xs text-red-600">{errors.reason}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Starts At *
                </label>
                <input
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) => updateField('starts_at', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
                {errors.starts_at && (
                  <p className="mt-1 text-xs text-red-600">{errors.starts_at}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Expected Ends At
                </label>
                <input
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(e) => updateField('ends_at', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
                {errors.ends_at && (
                  <p className="mt-1 text-xs text-red-600">{errors.ends_at}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Additional Notes
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="e.g. Instructor notified to reschedule Friday morning session"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLoggingPeriod(false)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : 'Save Availability Period'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* History Periods List */}
      {availabilityPeriods.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No downtime or availability periods recorded
          </p>
          <p className="mt-1 text-xs text-slate-500">
            All periods when this vehicle is taken off-schedule will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Reason & Notes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Period Timeframe
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {availabilityPeriods.map((period) => (
                <tr key={period.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                        period.availability_status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : period.availability_status === 'in_maintenance'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {period.availability_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="font-semibold text-slate-900 block">
                      {period.reason ?? 'General Downtime'}
                    </span>
                    {period.notes && (
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {period.notes}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">
                        From:
                      </span>
                      {new Date(period.starts_at).toLocaleString()}
                    </div>
                    {period.ends_at && (
                      <div className="mt-1">
                        <span className="text-slate-400 text-[10px] uppercase block">
                          Until:
                        </span>
                        {new Date(period.ends_at).toLocaleString()}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
