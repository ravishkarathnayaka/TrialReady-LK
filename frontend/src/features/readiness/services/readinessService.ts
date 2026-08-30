import { supabase } from '../../../lib/supabase'
import type { PracticalSessionWithRelations } from '../../sessions/types/session'
import type { StudentExamTrial, StudentMedicalRecord, StudentPermit } from '../../journey/types/journey'
import {
  evaluateStudentTrialReadiness,
} from '../utils/readinessEngine'
import type {
  ReadinessEvaluation,
  SaveReadinessEvaluationInput,
  StudentReadinessProfile,
} from '../types/readiness'

export async function saveReadinessEvaluation(
  input: SaveReadinessEvaluationInput,
): Promise<ReadinessEvaluation> {
  const { data, error } = await supabase
    .from('student_readiness_evaluations')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        student_id: input.student_id,
        readiness_score: input.readiness_score,
        readiness_tier: input.readiness_tier,
        recommendation_summary: input.recommendation_summary,
        skills_mastered_count: input.skills_mastered_count,
        skills_missing: input.skills_missing,
        practical_hours_completed: input.practical_hours_completed,
        permit_status: input.permit_status,
        medical_status: input.medical_status,
        theory_exam_status: input.theory_exam_status,
        risk_warnings: input.risk_warnings,
        action_items: input.action_items,
        evaluator_type: input.evaluator_type ?? 'rule_engine',
        evaluated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save readiness evaluation: ${error.message}`)
  }

  return data as ReadinessEvaluation
}

export async function getStudentReadinessProfile(
  studentId: string,
): Promise<StudentReadinessProfile> {
  const [studentRes, permitRes, medicalRes, examsRes, sessionsRes, paymentsRes, enrolRes] =
    await Promise.all([
      supabase
        .from('students')
        .select('id, full_name, admission_number, phone, email, driving_school_id, branches(name)')
        .eq('id', studentId)
        .single(),
      supabase
        .from('student_permits')
        .select('*')
        .eq('student_id', studentId)
        .order('issue_date', { ascending: false })
        .maybeSingle(),
      supabase
        .from('student_medical_records')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .maybeSingle(),
      supabase
        .from('student_exam_trials')
        .select('*')
        .eq('student_id', studentId)
        .eq('exam_type', 'theory')
        .order('scheduled_date', { ascending: false }),
      supabase
        .from('practical_sessions')
        .select('*, vehicles(registration_number), instructors(full_name)')
        .eq('student_id', studentId)
        .eq('status', 'completed'),
      supabase
        .from('student_payments')
        .select('amount')
        .eq('student_id', studentId),
      supabase
        .from('student_package_enrolments')
        .select('agreed_total_fee, discount_amount')
        .eq('student_id', studentId)
        .eq('status', 'active')
        .maybeSingle(),
    ])

  if (studentRes.error || !studentRes.data) {
    throw new Error(`Student not found: ${studentRes.error?.message}`)
  }

  const student = studentRes.data
  const permit = (permitRes.data as StudentPermit) ?? null
  const medical = (medicalRes.data as StudentMedicalRecord) ?? null
  const theoryExams = (examsRes.data as StudentExamTrial[]) ?? []
  const completedSessions = (sessionsRes.data as PracticalSessionWithRelations[]) ?? []

  // Financial balance
  const agreedFee = enrolRes.data
    ? Number(enrolRes.data.agreed_total_fee) - Number(enrolRes.data.discount_amount)
    : 0
  const totalPaid = (paymentsRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0)
  const balance = Math.max(0, agreedFee - totalPaid)

  const { evaluation, factors, averageRating } = evaluateStudentTrialReadiness({
    studentId: student.id,
    drivingSchoolId: student.driving_school_id,
    permit,
    medical,
    theoryExams,
    completedSessions,
    financialBalance: balance,
  })

  return {
    student: {
      id: student.id,
      full_name: student.full_name,
      admission_number: student.admission_number ?? '—',
      phone: student.phone ?? null,
      email: student.email ?? null,
      branch_name: (student.branches as any)?.name ?? 'Main Branch',
    },
    evaluation,
    factors,
    totalSessionsCount: completedSessions.length,
    averageInstructorRating: averageRating,
  }
}

export async function getSchoolReadinessOverview(
  drivingSchoolId: string,
): Promise<StudentReadinessProfile[]> {
  const { data: students, error } = await supabase
    .from('students')
    .select('id')
    .eq('driving_school_id', drivingSchoolId)
    .eq('is_active', true)

  if (error || !students) {
    throw new Error(`Failed to load students: ${error?.message}`)
  }

  const profiles = await Promise.all(
    students.map((s) => getStudentReadinessProfile(s.id)),
  )

  // Sort descending by readiness score
  return profiles.sort(
    (a, b) => b.evaluation.readiness_score - a.evaluation.readiness_score,
  )
}
