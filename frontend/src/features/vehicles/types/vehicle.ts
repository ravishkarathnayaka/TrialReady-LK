export type VehicleOperationalStatus =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'out_of_service'

export type VehicleAvailabilityStatus =
  | 'available'
  | 'unavailable'
  | 'in_maintenance'

export type VehicleTransmissionType =
  | 'manual'
  | 'automatic'
  | 'semi_automatic'
  | 'other'

export type VehicleFuelType =
  | 'petrol'
  | 'diesel'
  | 'hybrid'
  | 'electric'
  | 'other'

export interface Vehicle {
  id: string
  driving_school_id: string
  branch_id: string | null
  licence_category_id: string
  registration_number: string
  display_name: string | null
  manufacturer: string
  model: string
  year_of_manufacture: number | null
  transmission_type: VehicleTransmissionType
  fuel_type: VehicleFuelType | null
  photo_path: string | null
  date_added: string
  training_use_enabled: boolean
  operational_status: VehicleOperationalStatus
  availability_status: VehicleAvailabilityStatus
  current_odometer_km: number | null
  next_service_date: string | null
  internal_notes: string | null
  deactivation_reason: string | null
  deactivated_at: string | null
  created_at: string
  updated_at: string
}

export interface VehicleBranchSummary {
  id: string
  name: string
}

export interface VehicleLicenceCategorySummary {
  id: string
  code: string
  name: string
}

export interface VehicleWithRelations extends Vehicle {
  branch?: VehicleBranchSummary | null
  licence_category?: VehicleLicenceCategorySummary | null
}

export interface CreateVehicleInput {
  driving_school_id: string
  branch_id?: string | null
  licence_category_id: string
  registration_number: string
  display_name?: string | null
  manufacturer: string
  model: string
  year_of_manufacture?: number | null
  transmission_type: VehicleTransmissionType
  fuel_type?: VehicleFuelType | null
  photo_path?: string | null
  date_added?: string
  training_use_enabled?: boolean
  operational_status?: VehicleOperationalStatus
  availability_status?: VehicleAvailabilityStatus
  current_odometer_km?: number | null
  next_service_date?: string | null
  internal_notes?: string | null
}

export type UpdateVehicleInput = Partial<
  Omit<CreateVehicleInput, 'driving_school_id'>
> & {
  deactivation_reason?: string | null
  deactivated_at?: string | null
}
