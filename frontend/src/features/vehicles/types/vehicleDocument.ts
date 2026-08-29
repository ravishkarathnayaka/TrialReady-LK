export type VehicleDocumentType =
  | 'insurance'
  | 'revenue_licence'
  | 'other'

export interface VehicleDocument {
  id: string
  vehicle_id: string
  driving_school_id: string
  document_type: VehicleDocumentType
  document_name: string | null
  reference_number: string | null
  issue_date: string | null
  expiry_date: string | null
  file_path: string | null
  notes: string | null
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface CreateVehicleDocumentInput {
  vehicle_id: string
  driving_school_id: string
  document_type: VehicleDocumentType
  document_name?: string | null
  reference_number?: string | null
  issue_date?: string | null
  expiry_date?: string | null
  file_path?: string | null
  notes?: string | null
  is_current?: boolean
}

export type UpdateVehicleDocumentInput = Partial<
  Omit<CreateVehicleDocumentInput, 'vehicle_id' | 'driving_school_id'>
>
