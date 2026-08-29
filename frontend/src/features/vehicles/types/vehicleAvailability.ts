import type { VehicleAvailabilityStatus } from './vehicle'

export interface VehicleAvailabilityPeriod {
  id: string
  vehicle_id: string
  driving_school_id: string
  maintenance_record_id: string | null
  availability_status: VehicleAvailabilityStatus
  starts_at: string
  ends_at: string | null
  reason: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateVehicleAvailabilityPeriodInput {
  vehicle_id: string
  driving_school_id: string
  maintenance_record_id?: string | null
  availability_status: VehicleAvailabilityStatus
  starts_at: string
  ends_at?: string | null
  reason?: string | null
  notes?: string | null
  is_active?: boolean
}

export type UpdateVehicleAvailabilityPeriodInput = Partial<
  Omit<
    CreateVehicleAvailabilityPeriodInput,
    'vehicle_id' | 'driving_school_id'
  >
>
