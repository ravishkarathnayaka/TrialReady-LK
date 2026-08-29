import type { Session, User } from '@supabase/supabase-js'

export type AppRole = 'administrator' | 'instructor' | 'student'

export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'disabled'

export interface DrivingSchoolSummary {
  id: string
  name: string
  registration_number: string | null
}

export interface UserProfile {
  id: string
  driving_school_id: string
  branch_id: string | null
  role: AppRole
  full_name: string
  phone: string | null
  status: AccountStatus
  created_at: string
  updated_at: string
  driving_school?: DrivingSchoolSummary | null
}

export interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  role: AppRole | null
  drivingSchoolId: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
