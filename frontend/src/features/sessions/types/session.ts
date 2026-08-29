export type PracticalSessionStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type SessionAttendanceStatus =
  | 'unmarked'
  | 'present'
  | 'absent'
  | 'late'

export const DMT_PRACTICAL_SKILLS = [
  'Clutch Control & Gears',
  'Hill Start / Gradient',
  'Parallel Parking',
  '3-Point Turn',
  'Reverse S-Bend',
  'Lane Discipline & Roundabouts',
  'Highway & City Traffic',
  'Night Driving',
  'Emergency Braking',
  'Road Signs & Signals',
] as const

export type DMTPracticalSkill = (typeof DMT_PRACTICAL_SKILLS)[number]

export interface SessionStudentSummary {
  id: string
  full_name: string
  admission_number: string
  phone: string | null
}

export interface SessionInstructorSummary {
  id: string
  full_name: string
  staff_number: string | null
  phone: string | null
}

export interface SessionVehicleSummary {
  id: string
  registration_number: string
  make: string
  model: string
  transmission_type: string
}

export interface SessionCategorySummary {
  id: string
  code: string
  name: string
}

export interface SessionBranchSummary {
  id: string
  name: string
  code: string | null
}

export interface PracticalSession {
  id: string
  driving_school_id: string
  branch_id: string
  student_id: string
  instructor_id: string
  vehicle_id: string | null
  licence_category_id: string
  session_date: string
  start_time: string
  end_time: string
  status: PracticalSessionStatus
  attendance_status: SessionAttendanceStatus
  instructor_feedback: string | null
  student_rating: number | null
  cancellation_reason: string | null
  skills_covered: string[]
  created_at: string
  updated_at: string
}

export interface PracticalSessionWithRelations extends PracticalSession {
  student: SessionStudentSummary
  instructor: SessionInstructorSummary
  vehicle: SessionVehicleSummary | null
  licence_category: SessionCategorySummary
  branch: SessionBranchSummary
}

export interface CreatePracticalSessionInput {
  driving_school_id: string
  branch_id: string
  student_id: string
  instructor_id: string
  vehicle_id?: string | null
  licence_category_id: string
  session_date: string
  start_time: string
  end_time: string
  skills_covered?: string[]
}

export interface UpdatePracticalSessionInput {
  branch_id?: string
  student_id?: string
  instructor_id?: string
  vehicle_id?: string | null
  licence_category_id?: string
  session_date?: string
  start_time?: string
  end_time?: string
  status?: PracticalSessionStatus
  attendance_status?: SessionAttendanceStatus
  instructor_feedback?: string | null
  student_rating?: number | null
  cancellation_reason?: string | null
  skills_covered?: string[]
}

export interface RecordAttendanceInput {
  attendance_status: SessionAttendanceStatus
  instructor_feedback?: string | null
  skills_covered?: string[]
  student_rating?: number | null
}

export interface SessionConflict {
  type: 'instructor' | 'vehicle' | 'student'
  entityName: string
  startTime: string
  endTime: string
  sessionId: string
}
