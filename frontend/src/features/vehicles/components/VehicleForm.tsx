import React, { useState, type FormEvent } from 'react'
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleBranchSummary,
  VehicleFuelType,
  VehicleLicenceCategorySummary,
  VehicleTransmissionType,
  VehicleWithRelations,
} from '../types/vehicle'
import {
  hasVehicleValidationErrors,
  optionalNumber,
  optionalText,
  validateVehicle,
  type VehicleValidationErrors,
} from '../utils/vehicleValidation'

interface VehicleFormProps {
  drivingSchoolId: string
  branches: VehicleBranchSummary[]
  licenceCategories: VehicleLicenceCategorySummary[]
  initialVehicle?: VehicleWithRelations
  onSubmit: (
    input: CreateVehicleInput | UpdateVehicleInput,
  ) => Promise<void>
  onCancel: () => void
}

interface VehicleFormState {
  registration_number: string
  display_name: string
  manufacturer: string
  model: string
  year_of_manufacture: string
  licence_category_id: string
  branch_id: string
  transmission_type: VehicleTransmissionType | ''
  fuel_type: VehicleFuelType | ''
  current_odometer_km: string
  next_service_date: string
  training_use_enabled: boolean
  internal_notes: string
}

function getInitialFormState(
  initialVehicle?: VehicleWithRelations,
): VehicleFormState {
  return {
    registration_number: initialVehicle?.registration_number ?? '',
    display_name: initialVehicle?.display_name ?? '',
    manufacturer: initialVehicle?.manufacturer ?? '',
    model: initialVehicle?.model ?? '',
    year_of_manufacture: initialVehicle?.year_of_manufacture
      ? String(initialVehicle.year_of_manufacture)
      : '',
    licence_category_id: initialVehicle?.licence_category_id ?? '',
    branch_id: initialVehicle?.branch_id ?? '',
    transmission_type: initialVehicle?.transmission_type ?? 'manual',
    fuel_type: initialVehicle?.fuel_type ?? 'petrol',
    current_odometer_km:
      initialVehicle?.current_odometer_km !== undefined &&
      initialVehicle?.current_odometer_km !== null
        ? String(initialVehicle.current_odometer_km)
        : '',
    next_service_date: initialVehicle?.next_service_date ?? '',
    training_use_enabled: initialVehicle?.training_use_enabled ?? true,
    internal_notes: initialVehicle?.internal_notes ?? '',
  }
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  drivingSchoolId,
  branches,
  licenceCategories,
  initialVehicle,
  onSubmit,
  onCancel,
}) => {
  const isEditing = Boolean(initialVehicle)
  const [form, setForm] = useState<VehicleFormState>(() =>
    getInitialFormState(initialVehicle),
  )
  const [errors, setErrors] = useState<VehicleValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function updateField<K extends keyof VehicleFormState>(
    field: K,
    value: VehicleFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof VehicleValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateVehicle({
      registration_number: form.registration_number,
      manufacturer: form.manufacturer,
      model: form.model,
      licence_category_id: form.licence_category_id,
      transmission_type: form.transmission_type,
      year_of_manufacture: form.year_of_manufacture,
      current_odometer_km: form.current_odometer_km,
    })

    setErrors(validationErrors)
    setSubmitError(null)

    if (hasVehicleValidationErrors(validationErrors)) {
      return
    }

    const payload = {
      registration_number: form.registration_number.trim().toUpperCase(),
      display_name: optionalText(form.display_name),
      manufacturer: form.manufacturer.trim(),
      model: form.model.trim(),
      year_of_manufacture: optionalNumber(form.year_of_manufacture),
      licence_category_id: form.licence_category_id,
      branch_id: form.branch_id ? form.branch_id : null,
      transmission_type: form.transmission_type as VehicleTransmissionType,
      fuel_type: (form.fuel_type as VehicleFuelType) || null,
      current_odometer_km: optionalNumber(form.current_odometer_km),
      next_service_date: optionalText(form.next_service_date),
      training_use_enabled: form.training_use_enabled,
      internal_notes: optionalText(form.internal_notes),
    }

    try {
      setIsSubmitting(true)
      if (isEditing) {
        await onSubmit(payload as UpdateVehicleInput)
      } else {
        await onSubmit({
          ...payload,
          driving_school_id: drivingSchoolId,
        } as CreateVehicleInput)
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to save vehicle.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {isEditing ? 'Edit Vehicle Details' : 'Register New Vehicle'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isEditing
            ? `Update specifications and operational properties for ${initialVehicle?.registration_number}.`
            : 'Fill in the vehicle specifications, licence qualification category, and branch assignment.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          {/* Registration Number */}
          <div>
            <label
              htmlFor="veh-reg"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Registration Number *
            </label>
            <input
              id="veh-reg"
              type="text"
              value={form.registration_number}
              onChange={(e) =>
                updateField('registration_number', e.target.value)
              }
              placeholder="e.g. WP CAB-1234 or 19-5432"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 uppercase font-mono"
            />
            {errors.registration_number && (
              <p className="mt-1 text-xs text-red-600">
                {errors.registration_number}
              </p>
            )}
          </div>

          {/* Display Name / Nickname */}
          <div>
            <label
              htmlFor="veh-name"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Display Name / Fleet Label
            </label>
            <input
              id="veh-name"
              type="text"
              value={form.display_name}
              onChange={(e) => updateField('display_name', e.target.value)}
              placeholder="e.g. Blue Swift #1"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          {/* Make / Manufacturer */}
          <div>
            <label
              htmlFor="veh-make"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Manufacturer / Make *
            </label>
            <input
              id="veh-make"
              type="text"
              value={form.manufacturer}
              onChange={(e) => updateField('manufacturer', e.target.value)}
              placeholder="e.g. Toyota, Suzuki, Honda, Bajaj"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            />
            {errors.manufacturer && (
              <p className="mt-1 text-xs text-red-600">
                {errors.manufacturer}
              </p>
            )}
          </div>

          {/* Model */}
          <div>
            <label
              htmlFor="veh-model"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Model *
            </label>
            <input
              id="veh-model"
              type="text"
              value={form.model}
              onChange={(e) => updateField('model', e.target.value)}
              placeholder="e.g. Vitz, Alto, Pulsar 150"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            />
            {errors.model && (
              <p className="mt-1 text-xs text-red-600">{errors.model}</p>
            )}
          </div>

          {/* Licence Category */}
          <div>
            <label
              htmlFor="veh-category"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Licence Category *
            </label>
            <select
              id="veh-category"
              value={form.licence_category_id}
              onChange={(e) =>
                updateField('licence_category_id', e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="">Select a Licence Category</option>
              {licenceCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.code} – {cat.name}
                </option>
              ))}
            </select>
            {errors.licence_category_id && (
              <p className="mt-1 text-xs text-red-600">
                {errors.licence_category_id}
              </p>
            )}
          </div>

          {/* Branch Assignment */}
          <div>
            <label
              htmlFor="veh-branch"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Branch Assignment
            </label>
            <select
              id="veh-branch"
              value={form.branch_id}
              onChange={(e) => updateField('branch_id', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="">All Branches / Main Office</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission Type */}
          <div>
            <label
              htmlFor="veh-trans"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Transmission Type *
            </label>
            <select
              id="veh-trans"
              value={form.transmission_type}
              onChange={(e) =>
                updateField(
                  'transmission_type',
                  e.target.value as VehicleTransmissionType,
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="semi_automatic">Semi-Automatic</option>
              <option value="other">Other</option>
            </select>
            {errors.transmission_type && (
              <p className="mt-1 text-xs text-red-600">
                {errors.transmission_type}
              </p>
            )}
          </div>

          {/* Fuel Type */}
          <div>
            <label
              htmlFor="veh-fuel"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Fuel Type
            </label>
            <select
              id="veh-fuel"
              value={form.fuel_type}
              onChange={(e) =>
                updateField('fuel_type', e.target.value as VehicleFuelType)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Year of Manufacture */}
          <div>
            <label
              htmlFor="veh-year"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Year of Manufacture
            </label>
            <input
              id="veh-year"
              type="number"
              min={1900}
              max={2100}
              value={form.year_of_manufacture}
              onChange={(e) =>
                updateField('year_of_manufacture', e.target.value)
              }
              placeholder="e.g. 2020"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            />
            {errors.year_of_manufacture && (
              <p className="mt-1 text-xs text-red-600">
                {errors.year_of_manufacture}
              </p>
            )}
          </div>

          {/* Current Odometer */}
          <div>
            <label
              htmlFor="veh-odo"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Current Odometer (km)
            </label>
            <input
              id="veh-odo"
              type="number"
              min={0}
              value={form.current_odometer_km}
              onChange={(e) =>
                updateField('current_odometer_km', e.target.value)
              }
              placeholder="e.g. 45000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 font-mono"
            />
            {errors.current_odometer_km && (
              <p className="mt-1 text-xs text-red-600">
                {errors.current_odometer_km}
              </p>
            )}
          </div>

          {/* Next Recommended Service Date */}
          <div>
            <label
              htmlFor="veh-next-service"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Next Recommended Service Date
            </label>
            <input
              id="veh-next-service"
              type="date"
              value={form.next_service_date}
              onChange={(e) =>
                updateField('next_service_date', e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          {/* Training Use Enabled Checkbox */}
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-900 select-none">
              <input
                type="checkbox"
                checked={form.training_use_enabled}
                onChange={(e) =>
                  updateField('training_use_enabled', e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Enable for student training sessions
            </label>
          </div>

          {/* Internal Notes */}
          <div className="md:col-span-2">
            <label
              htmlFor="veh-notes"
              className="mb-1.5 block text-sm font-medium text-slate-900"
            >
              Internal Notes / Remarks
            </label>
            <textarea
              id="veh-notes"
              rows={3}
              value={form.internal_notes}
              onChange={(e) => updateField('internal_notes', e.target.value)}
              placeholder="Any special driving school notes, lease details, or mechanical notes..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 resize-y"
            />
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
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </section>
  )
}
