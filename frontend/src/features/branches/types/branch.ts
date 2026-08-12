export interface Branch {
  id: string
  driving_school_id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateBranchInput {
  driving_school_id: string
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  is_active: boolean
}

export type UpdateBranchInput = Partial<
  Omit<CreateBranchInput, 'driving_school_id'>
>