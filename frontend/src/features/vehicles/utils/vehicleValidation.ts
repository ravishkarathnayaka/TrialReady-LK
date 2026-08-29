import type {
  VehicleAvailabilityStatus,
  VehicleFuelType,
  VehicleOperationalStatus,
  VehicleTransmissionType,
} from '../types/vehicle'
import type { VehicleDocumentType } from '../types/vehicleDocument'

export interface VehicleValidationInput {
  registration_number: string
  display_name?: string
  manufacturer: string
  model: string
  licence_category_id: string
  transmission_type: VehicleTransmissionType | ''
  fuel_type?: VehicleFuelType | ''
  year_of_manufacture?: string | number
  current_odometer_km?: string | number
  branch_id?: string
  operational_status?: VehicleOperationalStatus
  availability_status?: VehicleAvailabilityStatus
  next_service_date?: string
}

export type VehicleValidationErrors = Partial<
  Record<keyof VehicleValidationInput, string>
>

export function validateVehicle(
  input: VehicleValidationInput,
): VehicleValidationErrors {
  const errors: VehicleValidationErrors = {}

  if (!input.registration_number.trim()) {
    errors.registration_number = 'Registration number is required.'
  }

  if (!input.manufacturer.trim()) {
    errors.manufacturer = 'Manufacturer is required.'
  }

  if (!input.model.trim()) {
    errors.model = 'Model is required.'
  }

  if (!input.licence_category_id) {
    errors.licence_category_id = 'Licence category is required.'
  }

  if (!input.transmission_type) {
    errors.transmission_type = 'Transmission type is required.'
  }

  if (
    input.year_of_manufacture !== undefined &&
    input.year_of_manufacture !== '' &&
    input.year_of_manufacture !== null
  ) {
    const year = Number(input.year_of_manufacture)
    if (isNaN(year) || !Number.isInteger(year) || year < 1900 || year > 2100) {
      errors.year_of_manufacture = 'Enter a valid year between 1900 and 2100.'
    }
  }

  if (
    input.current_odometer_km !== undefined &&
    input.current_odometer_km !== '' &&
    input.current_odometer_km !== null
  ) {
    const odo = Number(input.current_odometer_km)
    if (isNaN(odo) || odo < 0) {
      errors.current_odometer_km = 'Odometer reading cannot be negative.'
    }
  }

  return errors
}

export function hasVehicleValidationErrors(
  errors: VehicleValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

// ------------------------------------------------------------
// Document Validation
// ------------------------------------------------------------

export interface VehicleDocumentValidationInput {
  document_type: VehicleDocumentType | ''
  document_name?: string
  reference_number?: string
  issue_date?: string
  expiry_date?: string
}

export type VehicleDocumentValidationErrors = Partial<
  Record<keyof VehicleDocumentValidationInput, string>
>

export function validateVehicleDocument(
  input: VehicleDocumentValidationInput,
): VehicleDocumentValidationErrors {
  const errors: VehicleDocumentValidationErrors = {}

  if (!input.document_type) {
    errors.document_type = 'Document type is required.'
  }

  if (input.document_type === 'other' && !input.document_name?.trim()) {
    errors.document_name = 'Document name is required for other document types.'
  }

  if (input.issue_date && input.expiry_date) {
    if (new Date(input.expiry_date) < new Date(input.issue_date)) {
      errors.expiry_date = 'Expiry date cannot be earlier than issue date.'
    }
  }

  return errors
}

export function hasVehicleDocumentValidationErrors(
  errors: VehicleDocumentValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

// ------------------------------------------------------------
// Maintenance Validation
// ------------------------------------------------------------

export interface VehicleMaintenanceValidationInput {
  maintenance_type: string
  description: string
  maintenance_date?: string
  cost?: string | number
  odometer_reading_km?: string | number
  next_recommended_service_date?: string
  unavailable_from?: string
  unavailable_until?: string
}

export type VehicleMaintenanceValidationErrors = Partial<
  Record<keyof VehicleMaintenanceValidationInput, string>
>

export function validateVehicleMaintenance(
  input: VehicleMaintenanceValidationInput,
): VehicleMaintenanceValidationErrors {
  const errors: VehicleMaintenanceValidationErrors = {}

  if (!input.maintenance_type.trim()) {
    errors.maintenance_type = 'Maintenance type is required.'
  }

  if (!input.description.trim()) {
    errors.description = 'Description is required.'
  }

  if (
    input.cost !== undefined &&
    input.cost !== '' &&
    input.cost !== null
  ) {
    const costNum = Number(input.cost)
    if (isNaN(costNum) || costNum < 0) {
      errors.cost = 'Cost cannot be negative.'
    }
  }

  if (
    input.odometer_reading_km !== undefined &&
    input.odometer_reading_km !== '' &&
    input.odometer_reading_km !== null
  ) {
    const odoNum = Number(input.odometer_reading_km)
    if (isNaN(odoNum) || odoNum < 0) {
      errors.odometer_reading_km = 'Odometer reading cannot be negative.'
    }
  }

  if (input.maintenance_date && input.next_recommended_service_date) {
    if (
      new Date(input.next_recommended_service_date) <
      new Date(input.maintenance_date)
    ) {
      errors.next_recommended_service_date =
        'Next service date cannot be earlier than maintenance date.'
    }
  }

  if (input.unavailable_from && input.unavailable_until) {
    if (new Date(input.unavailable_until) <= new Date(input.unavailable_from)) {
      errors.unavailable_until =
        'Unavailable until must be after unavailable from.'
    }
  }

  return errors
}

export function hasVehicleMaintenanceValidationErrors(
  errors: VehicleMaintenanceValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

// ------------------------------------------------------------
// Availability Period Validation
// ------------------------------------------------------------

export interface VehicleAvailabilityValidationInput {
  availability_status: VehicleAvailabilityStatus | ''
  starts_at: string
  ends_at?: string
  reason?: string
}

export type VehicleAvailabilityValidationErrors = Partial<
  Record<keyof VehicleAvailabilityValidationInput, string>
>

export function validateVehicleAvailability(
  input: VehicleAvailabilityValidationInput,
): VehicleAvailabilityValidationErrors {
  const errors: VehicleAvailabilityValidationErrors = {}

  if (!input.availability_status) {
    errors.availability_status = 'Availability status is required.'
  }

  if (!input.starts_at) {
    errors.starts_at = 'Start date/time is required.'
  }

  if (input.starts_at && input.ends_at) {
    if (new Date(input.ends_at) <= new Date(input.starts_at)) {
      errors.ends_at = 'End time must be after start time.'
    }
  }

  if (
    input.availability_status &&
    input.availability_status !== 'available' &&
    !input.reason?.trim()
  ) {
    errors.reason = 'Reason is required when status is not available.'
  }

  return errors
}

export function hasVehicleAvailabilityValidationErrors(
  errors: VehicleAvailabilityValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

// ------------------------------------------------------------
// Helper Sanitizers
// ------------------------------------------------------------

export function optionalText(value?: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export function optionalNumber(
  value?: string | number | null,
): number | null {
  if (value === undefined || value === null || value === '') return null
  const parsed = Number(value)
  return isNaN(parsed) ? null : parsed
}
