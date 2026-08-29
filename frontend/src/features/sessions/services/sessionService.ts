import { supabase } from '../../../lib/supabase'
import type {
  CreatePracticalSessionInput,
  PracticalSession,
  PracticalSessionWithRelations,
  RecordAttendanceInput,
  SessionBranchSummary,
  SessionCategorySummary,
  SessionInstructorSummary,
  SessionStudentSummary,
  SessionVehicleSummary,
  UpdatePracticalSessionInput,
} from '../types/session'

const SESSIONS_TABLE = 'practical_sessions'

const SESSION_SELECT_RELATIONS = `
  id,
  driving_school_id,
  branch_id,
  student_id,
  instructor_id,
  vehicle_id,
  licence_category_id,
  session_date,
  start_time,
  end_time,
  status,
  attendance_status,
  instructor_feedback,
  student_rating,
  cancellation_reason,
  skills_covered,
  created_at,
  updated_at,
  student:students(id, full_name, admission_number, phone),
  instructor:instructors(id, full_name, staff_number, phone),
  vehicle:vehicles(id, registration_number, make, model, transmission_type),
  licence_category:licence_categories(id, code, name),
  branch:branches(id, name, code)
`

export async function getPracticalSessions(
  drivingSchoolId: string,
  options?: {
    startDate?: string
    endDate?: string
    branchId?: string
    instructorId?: string
    studentId?: string
    vehicleId?: string
  },
): Promise<PracticalSessionWithRelations[]> {
  let query = supabase
    .from(SESSIONS_TABLE)
    .select(SESSION_SELECT_RELATIONS)
    .eq('driving_school_id', drivingSchoolId)
    .order('session_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (options?.startDate) {
    query = query.gte('session_date', options.startDate)
  }
  if (options?.endDate) {
    query = query.lte('session_date', options.endDate)
  }
  if (options?.branchId) {
    query = query.eq('branch_id', options.branchId)
  }
  if (options?.instructorId) {
    query = query.eq('instructor_id', options.instructorId)
  }
  if (options?.studentId) {
    query = query.eq('student_id', options.studentId)
  }
  if (options?.vehicleId) {
    query = query.eq('vehicle_id', options.vehicleId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Unable to fetch practical sessions: ${error.message}`)
  }

  return (data as unknown as PracticalSessionWithRelations[]) ?? []
}

export async function getPracticalSessionById(
  sessionId: string,
): Promise<PracticalSessionWithRelations> {
  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .select(SESSION_SELECT_RELATIONS)
    .eq('id', sessionId)
    .single()

  if (error) {
    throw new Error(`Unable to load session: ${error.message}`)
  }

  return data as unknown as PracticalSessionWithRelations
}

export async function createPracticalSession(
  input: CreatePracticalSessionInput,
): Promise<PracticalSessionWithRelations> {
  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .insert([
      {
        driving_school_id: input.driving_school_id,
        branch_id: input.branch_id,
        student_id: input.student_id,
        instructor_id: input.instructor_id,
        vehicle_id: input.vehicle_id || null,
        licence_category_id: input.licence_category_id,
        session_date: input.session_date,
        start_time: input.start_time,
        end_time: input.end_time,
        status: 'scheduled',
        attendance_status: 'unmarked',
        skills_covered: input.skills_covered || [],
      },
    ])
    .select(SESSION_SELECT_RELATIONS)
    .single()

  if (error) {
    throw new Error(`Failed to schedule practical session: ${error.message}`)
  }

  return data as unknown as PracticalSessionWithRelations
}

export async function updatePracticalSession(
  sessionId: string,
  input: UpdatePracticalSessionInput,
): Promise<PracticalSessionWithRelations> {
  const payload: Partial<PracticalSession> = {
    updated_at: new Date().toISOString(),
  }

  if (input.branch_id !== undefined) payload.branch_id = input.branch_id
  if (input.student_id !== undefined) payload.student_id = input.student_id
  if (input.instructor_id !== undefined)
    payload.instructor_id = input.instructor_id
  if (input.vehicle_id !== undefined) payload.vehicle_id = input.vehicle_id
  if (input.licence_category_id !== undefined)
    payload.licence_category_id = input.licence_category_id
  if (input.session_date !== undefined) payload.session_date = input.session_date
  if (input.start_time !== undefined) payload.start_time = input.start_time
  if (input.end_time !== undefined) payload.end_time = input.end_time
  if (input.status !== undefined) payload.status = input.status
  if (input.attendance_status !== undefined)
    payload.attendance_status = input.attendance_status
  if (input.instructor_feedback !== undefined)
    payload.instructor_feedback = input.instructor_feedback
  if (input.student_rating !== undefined)
    payload.student_rating = input.student_rating
  if (input.cancellation_reason !== undefined)
    payload.cancellation_reason = input.cancellation_reason
  if (input.skills_covered !== undefined)
    payload.skills_covered = input.skills_covered

  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .update(payload)
    .eq('id', sessionId)
    .select(SESSION_SELECT_RELATIONS)
    .single()

  if (error) {
    throw new Error(`Failed to update practical session: ${error.message}`)
  }

  return data as unknown as PracticalSessionWithRelations
}

export async function recordSessionAttendance(
  sessionId: string,
  input: RecordAttendanceInput,
): Promise<PracticalSessionWithRelations> {
  const status =
    input.attendance_status === 'present'
      ? 'completed'
      : input.attendance_status === 'absent'
        ? 'no_show'
        : 'completed'

  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .update({
      attendance_status: input.attendance_status,
      status,
      instructor_feedback: input.instructor_feedback ?? null,
      skills_covered: input.skills_covered ?? [],
      student_rating: input.student_rating ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select(SESSION_SELECT_RELATIONS)
    .single()

  if (error) {
    throw new Error(`Failed to record attendance: ${error.message}`)
  }

  return data as unknown as PracticalSessionWithRelations
}

export async function cancelPracticalSession(
  sessionId: string,
  cancellationReason: string,
): Promise<PracticalSessionWithRelations> {
  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .update({
      status: 'cancelled',
      cancellation_reason: cancellationReason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select(SESSION_SELECT_RELATIONS)
    .single()

  if (error) {
    throw new Error(`Failed to cancel practical session: ${error.message}`)
  }

  return data as unknown as PracticalSessionWithRelations
}

export async function deletePracticalSession(
  sessionId: string,
): Promise<void> {
  const { error } = await supabase
    .from(SESSIONS_TABLE)
    .delete()
    .eq('id', sessionId)

  if (error) {
    throw new Error(`Failed to delete practical session: ${error.message}`)
  }
}

// Master Data Helpers for Select Dropdowns
export async function getStudentsForSessions(
  drivingSchoolId: string,
): Promise<SessionStudentSummary[]> {
  const { data, error } = await supabase
    .from('students')
    .select('id, full_name, admission_number, phone')
    .eq('driving_school_id', drivingSchoolId)
    .order('full_name', { ascending: true })

  if (error) throw new Error(`Failed to fetch students: ${error.message}`)
  return (data as SessionStudentSummary[]) ?? []
}

export async function getInstructorsForSessions(
  drivingSchoolId: string,
): Promise<SessionInstructorSummary[]> {
  const { data, error } = await supabase
    .from('instructors')
    .select('id, full_name, staff_number, phone')
    .eq('driving_school_id', drivingSchoolId)
    .eq('status', 'active')
    .order('full_name', { ascending: true })

  if (error) throw new Error(`Failed to fetch instructors: ${error.message}`)
  return (data as SessionInstructorSummary[]) ?? []
}

export async function getVehiclesForSessions(
  drivingSchoolId: string,
): Promise<SessionVehicleSummary[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('id, registration_number, make, model, transmission_type')
    .eq('driving_school_id', drivingSchoolId)
    .eq('operational_status', 'active')
    .order('registration_number', { ascending: true })

  if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`)
  return (data as SessionVehicleSummary[]) ?? []
}

export async function getCategoriesForSessions(
  drivingSchoolId: string,
): Promise<SessionCategorySummary[]> {
  const { data, error } = await supabase
    .from('licence_categories')
    .select('id, code, name')
    .eq('driving_school_id', drivingSchoolId)
    .order('code', { ascending: true })

  if (error) throw new Error(`Failed to fetch licence categories: ${error.message}`)
  return (data as SessionCategorySummary[]) ?? []
}

export async function getBranchesForSessions(
  drivingSchoolId: string,
): Promise<SessionBranchSummary[]> {
  const { data, error } = await supabase
    .from('branches')
    .select('id, name, code')
    .eq('driving_school_id', drivingSchoolId)
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (error) throw new Error(`Failed to fetch branches: ${error.message}`)
  return (data as SessionBranchSummary[]) ?? []
}
