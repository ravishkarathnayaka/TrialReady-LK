export interface Instructor {
  id: string
  driving_school_id: string
  branch_id: string | null
  employee_code: string | null
  full_name: string
  nic: string | null
  phone: string | null
  email: string | null
  driving_licence_number: string | null
  driving_licence_expiry_date: string | null
  joined_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateInstructorInput {
  driving_school_id: string
  branch_id?: string | null
  employee_code?: string | null
  full_name: string
  nic?: string | null
  phone?: string | null
  email?: string | null
  driving_licence_number?: string | null
  driving_licence_expiry_date?: string | null
  joined_date?: string | null
  is_active: boolean
}

export type UpdateInstructorInput = Partial<
  Omit<CreateInstructorInput, 'driving_school_id'>
>