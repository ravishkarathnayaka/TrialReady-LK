export type VehicleMaintenanceStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface VehicleMaintenanceRecord {
  id: string
  vehicle_id: string
  driving_school_id: string
  maintenance_date: string
  maintenance_type: string
  description: string
  service_provider: string | null
  cost: number | null
  odometer_reading_km: number | null
  status: VehicleMaintenanceStatus
  next_recommended_service_date: string | null
  unavailable_from: string | null
  unavailable_until: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateVehicleMaintenanceRecordInput {
  vehicle_id: string
  driving_school_id: string
  maintenance_date?: string
  maintenance_type: string
  description: string
  service_provider?: string | null
  cost?: number | null
  odometer_reading_km?: number | null
  status?: VehicleMaintenanceStatus
  next_recommended_service_date?: string | null
  unavailable_from?: string | null
  unavailable_until?: string | null
  notes?: string | null
}

export type UpdateVehicleMaintenanceRecordInput = Partial<
  Omit<
    CreateVehicleMaintenanceRecordInput,
    'vehicle_id' | 'driving_school_id'
  >
>
