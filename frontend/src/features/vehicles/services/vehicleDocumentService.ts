import { supabase } from '../../../lib/supabase'
import type {
  CreateVehicleDocumentInput,
  UpdateVehicleDocumentInput,
  VehicleDocument,
} from '../types/vehicleDocument'

const VEHICLE_DOCUMENTS_TABLE = 'vehicle_documents'

export async function getVehicleDocuments(
  vehicleId: string,
): Promise<VehicleDocument[]> {
  const { data, error } = await supabase
    .from(VEHICLE_DOCUMENTS_TABLE)
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('is_current', { ascending: false })
    .order('expiry_date', { ascending: true })

  if (error) {
    throw new Error(`Unable to load vehicle documents: ${error.message}`)
  }

  return (data ?? []) as VehicleDocument[]
}

export async function createVehicleDocument(
  input: CreateVehicleDocumentInput,
): Promise<VehicleDocument> {
  const { data, error } = await supabase
    .from(VEHICLE_DOCUMENTS_TABLE)
    .insert(input)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to create vehicle document: ${error.message}`)
  }

  return data as VehicleDocument
}

export async function updateVehicleDocument(
  id: string,
  input: UpdateVehicleDocumentInput,
): Promise<VehicleDocument> {
  const { data, error } = await supabase
    .from(VEHICLE_DOCUMENTS_TABLE)
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to update vehicle document: ${error.message}`)
  }

  return data as VehicleDocument
}

export async function deleteVehicleDocument(id: string): Promise<void> {
  const { error } = await supabase
    .from(VEHICLE_DOCUMENTS_TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Unable to delete vehicle document: ${error.message}`)
  }
}
