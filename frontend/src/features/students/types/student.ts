export interface Student {
  id: string
  driving_school_id: string
  branch_id: string | null
  primary_instructor_id: string | null
  student_code: string | null
  full_name: string
  nic: string | null
  date_of_birth: string | null
  phone: string | null
  email: string | null
  address: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  registration_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateStudentInput {
  driving_school_id: string
  branch_id?: string | null
  primary_instructor_id?: string | null
  student_code?: string | null
  full_name: string
  nic?: string | null
  date_of_birth?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  registration_date: string
  is_active: boolean
}

export type UpdateStudentInput = Partial<
  Omit<CreateStudentInput, 'driving_school_id'>
>