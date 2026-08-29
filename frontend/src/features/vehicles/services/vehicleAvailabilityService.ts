import { supabase } from '../../../lib/supabase'
import type {
  CreateVehicleAvailabilityPeriodInput,
  UpdateVehicleAvailabilityPeriodInput,
  VehicleAvailabilityPeriod,
} from '../types/vehicleAvailability'

const VEHICLE_AVAILABILITY_TABLE = 'vehicle_availability_periods'

export async function getVehicleAvailabilityPeriods(
  vehicleId: string,
): Promise<VehicleAvailabilityPeriod[]> {
  const { data, error } = await supabase
    .from(VEHICLE_AVAILABILITY_TABLE)
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('starts_at', { ascending: false })

  if (error) {
    throw new Error(
      `Unable to load vehicle availability records: ${error.message}`,
    )
  }

  return (data ?? []) as VehicleAvailabilityPeriod[]
}

export async function createVehicleAvailabilityPeriod(
  input: CreateVehicleAvailabilityPeriodInput,
): Promise<VehicleAvailabilityPeriod> {
  const { data, error } = await supabase
    .from(VEHICLE_AVAILABILITY_TABLE)
    .insert(input)
    .select('*')
    .single()

  if (error) {
    throw new Error(
      `Unable to create availability period: ${error.message}`,
    )
  }

  return data as VehicleAvailabilityPeriod
}

export async function updateVehicleAvailabilityPeriod(
  id: string,
  input: UpdateVehicleAvailabilityPeriodInput,
): Promise<VehicleAvailabilityPeriod> {
  const { data, error } = await supabase
    .from(VEHICLE_AVAILABILITY_TABLE)
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(
      `Unable to update availability period: ${error.message}`,
    )
  }

  return data as VehicleAvailabilityPeriod
}

export async function deactivateAvailabilityPeriod(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from(VEHICLE_AVAILABILITY_TABLE)
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    throw new Error(
      `Unable to deactivate availability period: ${error.message}`,
    )
  }
}
