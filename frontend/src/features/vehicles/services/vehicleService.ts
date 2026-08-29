import { supabase } from '../../../lib/supabase'
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleAvailabilityStatus,
  VehicleBranchSummary,
  VehicleLicenceCategorySummary,
  VehicleOperationalStatus,
  VehicleWithRelations,
} from '../types/vehicle'

const VEHICLES_TABLE = 'vehicles'
const BRANCHES_TABLE = 'branches'
const LICENCE_CATEGORIES_TABLE = 'licence_categories'

const VEHICLE_SELECT_RELATIONS = `
  *,
  branch:branches(id, name),
  licence_category:licence_categories(id, code, name)
`

export async function getVehicles(
  drivingSchoolId?: string,
): Promise<VehicleWithRelations[]> {
  let query = supabase
    .from(VEHICLES_TABLE)
    .select(VEHICLE_SELECT_RELATIONS)
    .order('registration_number', { ascending: true })

  if (drivingSchoolId) {
    query = query.eq('driving_school_id', drivingSchoolId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Unable to load vehicles: ${error.message}`)
  }

  return (data ?? []) as unknown as VehicleWithRelations[]
}

export async function getVehicleById(
  id: string,
): Promise<VehicleWithRelations> {
  const { data, error } = await supabase
    .from(VEHICLES_TABLE)
    .select(VEHICLE_SELECT_RELATIONS)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Unable to load vehicle: ${error.message}`)
  }

  return data as unknown as VehicleWithRelations
}

export async function createVehicle(
  input: CreateVehicleInput,
): Promise<VehicleWithRelations> {
  const { data: created, error: createError } = await supabase
    .from(VEHICLES_TABLE)
    .insert(input)
    .select('id')
    .single()

  if (createError) {
    throw new Error(`Unable to create vehicle: ${createError.message}`)
  }

  return getVehicleById(created.id)
}

export async function updateVehicle(
  id: string,
  input: UpdateVehicleInput,
): Promise<VehicleWithRelations> {
  const { error: updateError } = await supabase
    .from(VEHICLES_TABLE)
    .update(input)
    .eq('id', id)

  if (updateError) {
    throw new Error(`Unable to update vehicle: ${updateError.message}`)
  }

  return getVehicleById(id)
}

export async function setVehicleOperationalStatus(
  id: string,
  status: VehicleOperationalStatus,
  deactivationReason?: string | null,
): Promise<VehicleWithRelations> {
  const updatePayload: UpdateVehicleInput = {
    operational_status: status,
    deactivation_reason:
      status === 'active' ? null : deactivationReason ?? null,
    deactivated_at: status === 'active' ? null : new Date().toISOString(),
  }

  // If set to inactive, suspended, or out_of_service, also update availability if available
  if (status !== 'active') {
    updatePayload.availability_status = 'unavailable'
  }

  return updateVehicle(id, updatePayload)
}

export async function setVehicleAvailabilityStatus(
  id: string,
  status: VehicleAvailabilityStatus,
): Promise<VehicleWithRelations> {
  return updateVehicle(id, { availability_status: status })
}

export async function getBranchesForSchool(
  drivingSchoolId: string,
): Promise<VehicleBranchSummary[]> {
  const { data, error } = await supabase
    .from(BRANCHES_TABLE)
    .select('id, name')
    .eq('driving_school_id', drivingSchoolId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Unable to load branches: ${error.message}`)
  }

  return (data ?? []) as VehicleBranchSummary[]
}

export async function getLicenceCategoriesForSchool(
  drivingSchoolId: string,
): Promise<VehicleLicenceCategorySummary[]> {
  const { data, error } = await supabase
    .from(LICENCE_CATEGORIES_TABLE)
    .select('id, code, name')
    .eq('driving_school_id', drivingSchoolId)
    .eq('is_active', true)
    .order('code', { ascending: true })

  if (error) {
    throw new Error(`Unable to load licence categories: ${error.message}`)
  }

  return (data ?? []) as VehicleLicenceCategorySummary[]
}
