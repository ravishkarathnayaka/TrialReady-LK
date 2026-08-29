import { supabase } from '../../../lib/supabase'
import type {
  SaveExamTrialInput,
  SaveMedicalInput,
  SavePermitInput,
  StudentExamTrial,
  StudentJourneyOverview,
  StudentMedicalRecord,
  StudentPermit,
} from '../types/journey'
import { computeJourneyStages } from '../utils/journeyUtils'

// ==========================================
// Permits
// ==========================================

export async function getCurrentPermit(
  studentId: string,
): Promise<StudentPermit | null> {
  const { data, error } = await supabase
    .from('student_permits')
    .select('*')
    .eq('student_id', studentId)
    .eq('is_current', true)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch student permit: ${error.message}`)
  }

  return (data as StudentPermit) ?? null
}

export async function saveStudentPermit(
  input: SavePermitInput,
): Promise<StudentPermit> {
  // If a current permit already exists, mark older ones is_current = false
  await supabase
    .from('student_permits')
    .update({ is_current: false })
    .eq('student_id', input.student_id)

  const { data, error } = await supabase
    .from('student_permits')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        student_id: input.student_id,
        permit_number: input.permit_number,
        issue_date: input.issue_date,
        expiry_date: input.expiry_date,
        dmt_reference: input.dmt_reference ?? null,
        notes: input.notes ?? null,
        status: 'active',
        is_current: true,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save learner permit: ${error.message}`)
  }

  return data as StudentPermit
}

// ==========================================
// Medical Records
// ==========================================

export async function getStudentMedical(
  studentId: string,
): Promise<StudentMedicalRecord | null> {
  const { data, error } = await supabase
    .from('student_medical_records')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch medical record: ${error.message}`)
  }

  return (data as StudentMedicalRecord) ?? null
}

export async function saveStudentMedical(
  input: SaveMedicalInput,
): Promise<StudentMedicalRecord> {
  // Check if medical record already exists
  const existing = await getStudentMedical(input.student_id)

  if (existing) {
    const { data, error } = await supabase
      .from('student_medical_records')
      .update({
        status: input.status,
        appointment_date: input.appointment_date ?? null,
        certificate_number: input.certificate_number ?? null,
        issued_date: input.issued_date ?? null,
        expiry_date: input.expiry_date ?? null,
        ntmi_branch: input.ntmi_branch ?? null,
        blood_group: input.blood_group ?? null,
        restrictions: input.restrictions ?? null,
        notes: input.notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update medical: ${error.message}`)
    return data as StudentMedicalRecord
  }

  const { data, error } = await supabase
    .from('student_medical_records')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        student_id: input.student_id,
        status: input.status,
        appointment_date: input.appointment_date ?? null,
        certificate_number: input.certificate_number ?? null,
        issued_date: input.issued_date ?? null,
        expiry_date: input.expiry_date ?? null,
        ntmi_branch: input.ntmi_branch ?? null,
        blood_group: input.blood_group ?? null,
        restrictions: input.restrictions ?? null,
        notes: input.notes ?? null,
      },
    ])
    .select()
    .single()

  if (error) throw new Error(`Failed to save medical: ${error.message}`)
  return data as StudentMedicalRecord
}

// ==========================================
// Exams & Practical Trials
// ==========================================

export async function getStudentExamTrials(
  studentId: string,
): Promise<StudentExamTrial[]> {
  const { data, error } = await supabase
    .from('student_exam_trials')
    .select('*')
    .eq('student_id', studentId)
    .order('scheduled_date', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch exam trials: ${error.message}`)
  }

  return (data as StudentExamTrial[]) ?? []
}

export async function saveStudentExamTrial(
  input: SaveExamTrialInput,
): Promise<StudentExamTrial> {
  const { data, error } = await supabase
    .from('student_exam_trials')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        student_id: input.student_id,
        exam_type: input.exam_type,
        attempt_number: input.attempt_number,
        scheduled_date: input.scheduled_date,
        status: input.status,
        score: input.score ?? null,
        location: input.location ?? null,
        examiner_notes: input.examiner_notes ?? null,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to schedule exam/trial: ${error.message}`)
  }

  return data as StudentExamTrial
}

export async function updateStudentExamTrial(
  id: string,
  updates: Partial<SaveExamTrialInput>,
): Promise<StudentExamTrial> {
  const { data, error } = await supabase
    .from('student_exam_trials')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update exam/trial: ${error.message}`)
  }

  return data as StudentExamTrial
}

// ==========================================
// Comprehensive Student Journey Overview
// ==========================================

export async function getStudentJourneyOverview(
  studentId: string,
): Promise<StudentJourneyOverview> {
  const [studentRes, permit, medical, exams, lessonsRes] = await Promise.all([
    supabase
      .from('students')
      .select(
        'id, full_name, admission_number, phone, email, registration_date, branches(name)',
      )
      .eq('id', studentId)
      .single(),
    getCurrentPermit(studentId),
    getStudentMedical(studentId),
    getStudentExamTrials(studentId),
    supabase
      .from('practical_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('status', 'completed'),
  ])

  if (studentRes.error || !studentRes.data) {
    throw new Error(
      `Student not found: ${studentRes.error?.message ?? 'No data'}`,
    )
  }

  const studentData = studentRes.data
  const completedLessonsCount = lessonsRes.count ?? 0

  const theoryExams = exams.filter((e) => e.exam_type === 'theory')
  const practicalTrials = exams.filter((e) => e.exam_type === 'practical_trial')

  const stageAnalysis = computeJourneyStages({
    permit,
    medical,
    theoryExams,
    practicalTrials,
    completedLessonsCount,
  })

  return {
    student: {
      id: studentData.id,
      full_name: studentData.full_name,
      admission_number: studentData.admission_number ?? '—',
      phone: studentData.phone ?? null,
      email: studentData.email ?? null,
      registration_date: studentData.registration_date ?? '',
      branch_name: (studentData.branches as any)?.name ?? 'Main Branch',
    },
    permit,
    medical,
    theoryExams,
    practicalTrials,
    completedLessonsCount,
    overallStage: stageAnalysis.currentStageNumber,
    stageName: stageAnalysis.currentStageName,
    percentage: stageAnalysis.completionPercentage,
  }
}

export async function getAllStudentJourneys(
  drivingSchoolId: string,
): Promise<StudentJourneyOverview[]> {
  const { data: students, error: studError } = await supabase
    .from('students')
    .select(
      'id, full_name, admission_number, phone, email, registration_date, branches(name)',
    )
    .eq('driving_school_id', drivingSchoolId)
    .eq('is_active', true)
    .order('full_name', { ascending: true })

  if (studError || !students) {
    throw new Error(`Failed to load students: ${studError?.message}`)
  }

  // Batch query permits, medicals, exams, and lessons
  const studentIds = students.map((s) => s.id)
  if (studentIds.length === 0) return []

  const [permitsRes, medicalsRes, examsRes] = await Promise.all([
    supabase
      .from('student_permits')
      .select('*')
      .eq('driving_school_id', drivingSchoolId)
      .eq('is_current', true),
    supabase
      .from('student_medical_records')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_exam_trials')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
  ])

  const permitsMap = new Map<string, StudentPermit>()
  for (const p of (permitsRes.data as StudentPermit[]) ?? []) {
    permitsMap.set(p.student_id, p)
  }

  const medicalsMap = new Map<string, StudentMedicalRecord>()
  for (const m of (medicalsRes.data as StudentMedicalRecord[]) ?? []) {
    medicalsMap.set(m.student_id, m)
  }

  const examsMap = new Map<string, StudentExamTrial[]>()
  for (const e of (examsRes.data as StudentExamTrial[]) ?? []) {
    const list = examsMap.get(e.student_id) || []
    list.push(e)
    examsMap.set(e.student_id, list)
  }

  return students.map((s) => {
    const permit = permitsMap.get(s.id) || null
    const medical = medicalsMap.get(s.id) || null
    const studentExams = examsMap.get(s.id) || []

    const theoryExams = studentExams.filter((e) => e.exam_type === 'theory')
    const practicalTrials = studentExams.filter(
      (e) => e.exam_type === 'practical_trial',
    )

    const stageAnalysis = computeJourneyStages({
      permit,
      medical,
      theoryExams,
      practicalTrials,
      completedLessonsCount: 0,
    })

    return {
      student: {
        id: s.id,
        full_name: s.full_name,
        admission_number: s.admission_number ?? '—',
        phone: s.phone ?? null,
        email: s.email ?? null,
        registration_date: s.registration_date ?? '',
        branch_name: (s.branches as any)?.name ?? 'Main Branch',
      },
      permit,
      medical,
      theoryExams,
      practicalTrials,
      completedLessonsCount: 0,
      overallStage: stageAnalysis.currentStageNumber,
      stageName: stageAnalysis.currentStageName,
      percentage: stageAnalysis.completionPercentage,
    }
  })
}
