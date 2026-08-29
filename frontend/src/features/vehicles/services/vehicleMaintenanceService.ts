import { supabase } from '../../../lib/supabase'
import type {
  CreateVehicleMaintenanceRecordInput,
  UpdateVehicleMaintenanceRecordInput,
  VehicleMaintenanceRecord,
} from '../types/vehicleMaintenance'

const VEHICLE_MAINTENANCE_TABLE = 'vehicle_maintenance_records'

export async function getVehicleMaintenanceRecords(
  vehicleId: string,
): Promise<VehicleMaintenanceRecord[]> {
  const { data, error } = await supabase
    .from(VEHICLE_MAINTENANCE_TABLE)
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('maintenance_date', { ascending: false })

  if (error) {
    throw new Error(
      `Unable to load vehicle maintenance records: ${error.message}`,
    )
  }

  return (data ?? []) as VehicleMaintenanceRecord[]
}

export async function createVehicleMaintenanceRecord(
  input: CreateVehicleMaintenanceRecordInput,
): Promise<VehicleMaintenanceRecord> {
  const { data, error } = await supabase
    .from(VEHICLE_MAINTENANCE_TABLE)
    .insert(input)
    .select('*')
    .single()

  if (error) {
    throw new Error(
      `Unable to create vehicle maintenance record: ${error.message}`,
    )
  }

  return data as VehicleMaintenanceRecord
}

export async function updateVehicleMaintenanceRecord(
  id: string,
  input: UpdateVehicleMaintenanceRecordInput,
): Promise<VehicleMaintenanceRecord> {
  const { data, error } = await supabase
    .from(VEHICLE_MAINTENANCE_TABLE)
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(
      `Unable to update vehicle maintenance record: ${error.message}`,
    )
  }

  return data as VehicleMaintenanceRecord
}

export async function deleteVehicleMaintenanceRecord(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from(VEHICLE_MAINTENANCE_TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(
      `Unable to delete vehicle maintenance record: ${error.message}`,
    )
  }
}
