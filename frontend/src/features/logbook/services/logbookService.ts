import { supabase } from '../../../lib/supabase'
import type {
  LogbookMedicalInfo,
  LogbookPermitInfo,
  LogbookSchoolInfo,
  LogbookSessionRecord,
  LogbookStudentProfile,
  LogbookTheoryExam,
  LogbookLicenceCategory,
  StudentLogbookData,
} from '../types/logbook'

export async function fetchStudentLogbookData(
  drivingSchoolId: string,
  studentId: string,
): Promise<StudentLogbookData> {
  // 1. Fetch driving school info
  const { data: schoolRow } = await supabase
    .from('driving_schools')
    .select('name, registration_number, phone, address')
    .eq('id', drivingSchoolId)
    .single()

  const school: LogbookSchoolInfo = schoolRow
    ? {
        schoolName: schoolRow.name,
        registrationNumber: schoolRow.registration_number ?? '',
        phone: schoolRow.phone ?? '',
        address: schoolRow.address ?? '',
      }
    : { schoolName: 'Driving Academy', registrationNumber: '', phone: '', address: '' }

  // 2. Fetch student profile
  const { data: studentRow } = await supabase
    .from('students')
    .select('full_name, admission_number, nic_passport, phone, email, registration_date, branches(name)')
    .eq('id', studentId)
    .single()

  const student: LogbookStudentProfile = studentRow
    ? {
        fullName: studentRow.full_name,
        admissionNumber: studentRow.admission_number ?? '',
        nicPassport: studentRow.nic_passport ?? '',
        phone: studentRow.phone ?? '',
        email: studentRow.email ?? '',
        registrationDate: studentRow.registration_date ?? '',
        branchName: (studentRow as Record<string, unknown>).branches
          ? ((studentRow as Record<string, unknown>).branches as Record<string, string>).name
          : '',
      }
    : { fullName: '', admissionNumber: '', nicPassport: '', phone: '', email: '', registrationDate: '', branchName: '' }

  // 3. Fetch permit
  const { data: permitRow } = await supabase
    .from('student_permits')
    .select('permit_number, issue_date, expiry_date, status')
    .eq('student_id', studentId)
    .eq('is_current', true)
    .single()

  const permit: LogbookPermitInfo | null = permitRow
    ? {
        permitNumber: permitRow.permit_number,
        issueDate: permitRow.issue_date,
        expiryDate: permitRow.expiry_date,
        status: permitRow.status,
      }
    : null

  // 4. Fetch medical
  const { data: medicalRow } = await supabase
    .from('student_medical_records')
    .select('certificate_number, issue_date, expiry_date, ntmi_branch, status')
    .eq('student_id', studentId)
    .order('issue_date', { ascending: false })
    .limit(1)
    .single()

  const medical: LogbookMedicalInfo | null = medicalRow
    ? {
        certificateNumber: medicalRow.certificate_number,
        issueDate: medicalRow.issue_date,
        expiryDate: medicalRow.expiry_date,
        ntmiBranch: medicalRow.ntmi_branch ?? '',
        status: medicalRow.status,
      }
    : null

  // 5. Fetch completed practical sessions
  const { data: sessionRows } = await supabase
    .from('practical_sessions')
    .select('session_date, start_time, end_time, attendance_status, student_rating, skills_covered, vehicles(registration_number), instructors(full_name), licence_categories(code, name)')
    .eq('student_id', studentId)
    .eq('status', 'completed')
    .eq('attendance_status', 'present')
    .order('session_date', { ascending: true })

  const sessions: LogbookSessionRecord[] = (sessionRows ?? []).map((s: Record<string, unknown>) => {
    const startParts = ((s.start_time as string) ?? '08:00').split(':').map(Number)
    const endParts = ((s.end_time as string) ?? '09:00').split(':').map(Number)
    const durationMinutes = (endParts[0] - startParts[0]) * 60 + (endParts[1] - startParts[1])

    return {
      sessionDate: s.session_date as string,
      startTime: s.start_time as string,
      endTime: s.end_time as string,
      durationMinutes: Math.max(durationMinutes, 0),
      vehicleRegistration: (s.vehicles as Record<string, string>)?.registration_number ?? '',
      instructorName: (s.instructors as Record<string, string>)?.full_name ?? '',
      skillsCovered: (s.skills_covered as string[]) ?? [],
      studentRating: s.student_rating as number | null,
      attendanceStatus: s.attendance_status as string,
    }
  })

  // Licence category from first session
  const firstSessionWithCat = (sessionRows ?? []).find(
    (s: Record<string, unknown>) => s.licence_categories,
  )
  const licenceCategory: LogbookLicenceCategory | null = firstSessionWithCat
    ? {
        code: (firstSessionWithCat.licence_categories as unknown as Record<string, string>).code,
        name: (firstSessionWithCat.licence_categories as unknown as Record<string, string>).name,
      }
    : null

  // 6. Fetch theory exams
  const { data: examRows } = await supabase
    .from('student_exam_trials')
    .select('exam_type, attempt_number, scheduled_date, status, score, location')
    .eq('student_id', studentId)
    .order('scheduled_date', { ascending: true })

  const theoryExams: LogbookTheoryExam[] = (examRows ?? []).map((e: Record<string, unknown>) => ({
    examType: e.exam_type as string,
    attemptNumber: e.attempt_number as number,
    scheduledDate: e.scheduled_date as string,
    status: e.status as string,
    score: e.score as number | null,
    location: e.location as string,
  }))

  // 7. Calculate totals
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0)
  const totalPracticalHours = Math.round((totalMinutes / 60) * 10) / 10

  // 8. AI Readiness Score (deterministic demo)
  const hasPermit = !!permit
  const hasMedical = medical?.status === 'passed'
  const passedTheory = theoryExams.some((e) => e.examType === 'theory' && e.status === 'passed')
  const hoursScore = Math.min((totalPracticalHours / 15) * 40, 40)
  const permitScore = hasPermit ? 15 : 0
  const medicalScore = hasMedical ? 15 : 0
  const theoryScore = passedTheory ? 15 : 0
  const ratingAvg =
    sessions.filter((s) => s.studentRating !== null).length > 0
      ? sessions.filter((s) => s.studentRating !== null).reduce((a, s) => a + (s.studentRating ?? 0), 0) /
        sessions.filter((s) => s.studentRating !== null).length
      : 3
  const ratingScore = Math.min((ratingAvg / 5) * 15, 15)
  const aiReadinessScore = Math.round(hoursScore + permitScore + medicalScore + theoryScore + ratingScore)

  const readinessTier =
    aiReadinessScore >= 85
      ? '🏆 Trial Ready'
      : aiReadinessScore >= 65
        ? '⚡ Nearly Ready'
        : aiReadinessScore >= 40
          ? '🚗 In Training'
          : '⚠️ Not Ready'

  return {
    school,
    student,
    permit,
    medical,
    licenceCategory,
    sessions,
    theoryExams,
    totalPracticalHours,
    totalCompletedSessions: sessions.length,
    aiReadinessScore,
    readinessTier,
  }
}
