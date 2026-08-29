import React, { useState, type FormEvent } from 'react'
import type {
  CreateVehicleMaintenanceRecordInput,
  VehicleMaintenanceRecord,
  VehicleMaintenanceStatus,
} from '../types/vehicleMaintenance'
import {
  hasVehicleMaintenanceValidationErrors,
  optionalNumber,
  optionalText,
  validateVehicleMaintenance,
  type VehicleMaintenanceValidationErrors,
} from '../utils/vehicleValidation'

interface VehicleMaintenanceManagerProps {
  vehicleId: string
  drivingSchoolId: string
  currentOdometer?: number | null
  maintenanceRecords: VehicleMaintenanceRecord[]
  onAddMaintenance: (
    input: CreateVehicleMaintenanceRecordInput,
  ) => Promise<VehicleMaintenanceRecord>
}

interface MaintenanceFormState {
  maintenance_date: string
  maintenance_type: string
  description: string
  service_provider: string
  cost: string
  odometer_reading_km: string
  status: VehicleMaintenanceStatus
  next_recommended_service_date: string
  notes: string
}

function getInitialForm(
  currentOdometer?: number | null,
): MaintenanceFormState {
  const today = new Date().toISOString().split('T')[0]
  return {
    maintenance_date: today,
    maintenance_type: 'Regular Service',
    description: '',
    service_provider: '',
    cost: '',
    odometer_reading_km:
      currentOdometer !== undefined && currentOdometer !== null
        ? String(currentOdometer)
        : '',
    status: 'completed',
    next_recommended_service_date: '',
    notes: '',
  }
}

function getMaintenanceBadgeClass(status: VehicleMaintenanceStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'scheduled':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    case 'cancelled':
      return 'bg-slate-100 text-slate-600 border border-slate-200'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export const VehicleMaintenanceManager: React.FC<
  VehicleMaintenanceManagerProps
> = ({
  vehicleId,
  drivingSchoolId,
  currentOdometer,
  maintenanceRecords,
  onAddMaintenance,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<MaintenanceFormState>(() =>
    getInitialForm(currentOdometer),
  )
  const [errors, setErrors] =
    useState<VehicleMaintenanceValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function updateField<K extends keyof MaintenanceFormState>(
    field: K,
    value: MaintenanceFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof VehicleMaintenanceValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateVehicleMaintenance({
      maintenance_type: form.maintenance_type,
      description: form.description,
      maintenance_date: form.maintenance_date,
      cost: form.cost,
      odometer_reading_km: form.odometer_reading_km,
      next_recommended_service_date: form.next_recommended_service_date,
    })

    setErrors(validationErrors)
    setErrorMessage(null)

    if (hasVehicleMaintenanceValidationErrors(validationErrors)) {
      return
    }

    try {
      setIsSubmitting(true)
      await onAddMaintenance({
        vehicle_id: vehicleId,
        driving_school_id: drivingSchoolId,
        maintenance_date: form.maintenance_date,
        maintenance_type: form.maintenance_type.trim(),
        description: form.description.trim(),
        service_provider: optionalText(form.service_provider),
        cost: optionalNumber(form.cost),
        odometer_reading_km: optionalNumber(form.odometer_reading_km),
        status: form.status,
        next_recommended_service_date: optionalText(
          form.next_recommended_service_date,
        ),
        notes: optionalText(form.notes),
      })

      setForm(getInitialForm(currentOdometer))
      setIsAdding(false)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to save maintenance record.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Add CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Maintenance History & Service Log
          </h3>
          <p className="text-xs text-slate-500">
            Record regular maintenance, brake/tire checks, repairs, and service costs.
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
          >
            + Log Maintenance Record
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

      {/* Add Maintenance Record Form */}
      {isAdding && (
        <section className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              New Service / Maintenance Entry
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Maintenance Type *
                </label>
                <input
                  type="text"
                  value={form.maintenance_type}
                  onChange={(e) =>
                    updateField('maintenance_type', e.target.value)
                  }
                  placeholder="e.g. Engine Oil Change, Brake Overhaul"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
                {errors.maintenance_type && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.maintenance_type}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Service Date *
                </label>
                <input
                  type="date"
                  value={form.maintenance_date}
                  onChange={(e) =>
                    updateField('maintenance_date', e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      'status',
                      e.target.value as VehicleMaintenanceStatus,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="completed">Completed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Service Provider / Garage
                </label>
                <input
                  type="text"
                  value={form.service_provider}
                  onChange={(e) =>
                    updateField('service_provider', e.target.value)
                  }
                  placeholder="e.g. Auto Miraj, Toyota Lanka"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Cost (LKR)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.cost}
                  onChange={(e) => updateField('cost', e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-mono"
                />
                {errors.cost && (
                  <p className="mt-1 text-xs text-red-600">{errors.cost}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Odometer at Service (km)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.odometer_reading_km}
                  onChange={(e) =>
                    updateField('odometer_reading_km', e.target.value)
                  }
                  placeholder="e.g. 50200"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-mono"
                />
                {errors.odometer_reading_km && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.odometer_reading_km}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Next Service Date
                </label>
                <input
                  type="date"
                  value={form.next_recommended_service_date}
                  onChange={(e) =>
                    updateField(
                      'next_recommended_service_date',
                      e.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
                {errors.next_recommended_service_date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.next_recommended_service_date}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Work Description *
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    updateField('description', e.target.value)
                  }
                  placeholder="e.g. 50,000km routine maintenance: replaced oil filter, brake pads"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Additional invoice references, mechanic warranty notes..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 resize-y"
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
                {isSubmitting ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Maintenance Records List */}
      {maintenanceRecords.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No maintenance records logged
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Log routine services, oil changes, and inspections to maintain health records.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Service Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Type & Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Provider & Odometer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Cost (LKR)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {maintenanceRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-xs text-slate-900 font-medium">
                    {rec.maintenance_date}
                    {rec.next_recommended_service_date && (
                      <span className="block text-[10px] text-slate-500 mt-0.5">
                        Next: {rec.next_recommended_service_date}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="font-semibold text-slate-900 block">
                      {rec.maintenance_type}
                    </span>
                    <span className="text-slate-600 block mt-0.5">
                      {rec.description}
                    </span>
                    {rec.notes && (
                      <span className="text-[11px] text-slate-400 italic block mt-0.5">
                        Note: {rec.notes}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <span>{rec.service_provider ?? 'In-House'}</span>
                    {rec.odometer_reading_km !== null && (
                      <span className="block font-mono text-[11px] text-slate-500">
                        {rec.odometer_reading_km.toLocaleString()} km
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-medium text-slate-900">
                    {rec.cost !== null ? `Rs. ${rec.cost.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${getMaintenanceBadgeClass(
                        rec.status,
                      )}`}
                    >
                      {rec.status.replace('_', ' ')}
                    </span>
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
