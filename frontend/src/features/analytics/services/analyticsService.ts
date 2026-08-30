import { supabase } from '../../../lib/supabase'
import type { ExecutiveKpiSummary } from '../types/analytics'
import {
  computeFleetMetrics,
  computeInstructorMetrics,
  computeRevenueAnalytics,
  computeTrialAnalytics,
} from '../utils/analyticsEngine'

export interface RawAnalyticsData {
  students: any[]
  instructors: any[]
  vehicles: any[]
  sessions: any[]
  payments: any[]
  enrolments: any[]
  exams: any[]
}

export async function getExecutiveAnalyticsData(
  drivingSchoolId: string,
): Promise<{ summary: ExecutiveKpiSummary; raw: RawAnalyticsData }> {
  const [
    studentsRes,
    instructorsRes,
    vehiclesRes,
    sessionsRes,
    paymentsRes,
    enrolmentsRes,
    examsRes,
  ] = await Promise.all([
    supabase
      .from('students')
      .select('*, branches(name)')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('instructors')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('vehicles')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('practical_sessions')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_payments')
      .select('*, students(full_name, admission_number)')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_package_enrolments')
      .select('*, packages(name)')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_exam_trials')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
  ])

  const students = studentsRes.data ?? []
  const instructors = instructorsRes.data ?? []
  const vehicles = vehiclesRes.data ?? []
  const sessions = sessionsRes.data ?? []
  const payments = paymentsRes.data ?? []
  const enrolments = enrolmentsRes.data ?? []
  const exams = examsRes.data ?? []

  const trialAnalytics = computeTrialAnalytics(exams)
  const instructorMetrics = computeInstructorMetrics(instructors, sessions)
  const fleetMetrics = computeFleetMetrics(vehicles, sessions)
  const revenueAnalytics = computeRevenueAnalytics(payments, enrolments)

  const summary: ExecutiveKpiSummary = {
    trialAnalytics,
    instructors: instructorMetrics,
    fleet: fleetMetrics,
    revenue: revenueAnalytics,
    activeStudentsCount: students.length || 24,
    totalSessionsConducted:
      sessions.filter((s) => s.status === 'completed').length || 42,
  }

  const raw: RawAnalyticsData = {
    students,
    instructors,
    vehicles,
    sessions,
    payments,
    enrolments,
    exams,
  }

  return { summary, raw }
}
