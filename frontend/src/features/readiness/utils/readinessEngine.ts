import type { PracticalSessionWithRelations } from '../../sessions/types/session'
import type { StudentExamTrial, StudentMedicalRecord, StudentPermit } from '../../journey/types/journey'
import { calculatePermitValidity } from '../../journey/utils/journeyUtils'
import type {
  ReadinessEvaluation,
  ReadinessFactor,
  ReadinessTier,
} from '../types/readiness'

export const CORE_DMT_PRACTICAL_SKILLS = [
  'Clutch Control & Gears',
  'Hill Start / Gradient',
  'Parallel Parking',
  '3-Point Turn',
  'Reverse S-Bend',
  'Lane Discipline & Roundabouts',
  'Emergency Braking',
] as const

export function getReadinessTierInfo(tier: ReadinessTier): {
  label: string
  badgeClass: string
  description: string
  color: string
} {
  switch (tier) {
    case 'trial_ready':
      return {
        label: '🏆 Trial Ready',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black',
        description: 'Candidate meets all DMT requirements and demonstrates high practical proficiency.',
        color: '#059669',
      }
    case 'nearly_ready':
      return {
        label: '⚡ Nearly Ready',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
        description: 'Candidate is close to trial readiness. 1–2 targeted mock sessions recommended.',
        color: '#2563eb',
      }
    case 'needs_practice':
      return {
        label: '🚗 Needs Practice',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
        description: 'Student is actively training. Additional practical driving hours required.',
        color: '#d97706',
      }
    case 'not_ready':
      return {
        label: '⚠️ Not Ready',
        badgeClass: 'bg-red-100 text-red-800 border-red-300 font-semibold',
        description: 'Prerequisites missing (e.g. medical, permit, or theory test).',
        color: '#dc2626',
      }
  }
}

export function evaluateStudentTrialReadiness(data: {
  studentId: string
  drivingSchoolId: string
  permit: StudentPermit | null
  medical: StudentMedicalRecord | null
  theoryExams: StudentExamTrial[]
  completedSessions: PracticalSessionWithRelations[]
  financialBalance?: number
}): {
  evaluation: ReadinessEvaluation
  factors: ReadinessFactor[]
  averageRating: number | null
} {
  const {
    studentId,
    drivingSchoolId,
    permit,
    medical,
    theoryExams,
    completedSessions,
    financialBalance = 0,
  } = data

  const factors: ReadinessFactor[] = []
  const riskWarnings: string[] = []
  const actionItems: string[] = []

  // -------------------------------------------------------------
  // Factor 1: NTMI Medical Clearance (15 Points)
  // -------------------------------------------------------------
  let medicalScore = 0
  let medicalStatus: ReadinessFactor['status'] = 'pending'
  let medicalDetail = 'No NTMI medical record found.'

  if (medical?.status === 'passed') {
    const medVal = calculatePermitValidity(medical.expiry_date)
    if (medVal.state === 'expired') {
      medicalScore = 0
      medicalStatus = 'failed'
      medicalDetail = 'NTMI medical certificate has expired!'
      riskWarnings.push('NTMI Medical Certificate is expired — re-examination required.')
      actionItems.push('Schedule NTMI medical renewal appointment.')
    } else {
      medicalScore = 15
      medicalStatus = 'passed'
      medicalDetail = `Cleared: #${medical.certificate_number || 'Valid'} (${medical.ntmi_branch || 'NTMI'})`
    }
  } else if (medical?.status === 'appointment_booked') {
    medicalScore = 5
    medicalStatus = 'warning'
    medicalDetail = `Appointment booked on ${medical.appointment_date}`
    actionItems.push(`Complete NTMI medical appointment on ${medical.appointment_date}.`)
  } else {
    medicalScore = 0
    medicalStatus = 'failed'
    riskWarnings.push('Missing NTMI Medical Clearance.')
    actionItems.push('Book medical appointment at NTMI center (e.g. Werahera/Kandy).')
  }

  factors.push({
    key: 'medical',
    title: 'NTMI Medical Fitness',
    score: medicalScore,
    maxScore: 15,
    status: medicalStatus,
    detail: medicalDetail,
  })

  // -------------------------------------------------------------
  // Factor 2: DMT Learner\'s Permit (15 Points)
  // -------------------------------------------------------------
  let permitScore = 0
  let permitFactorStatus: ReadinessFactor['status'] = 'pending'
  let permitDetail = "No learner's permit recorded."

  if (permit) {
    const permitVal = calculatePermitValidity(permit.expiry_date)
    if (permitVal.state === 'expired') {
      permitScore = 0
      permitFactorStatus = 'failed'
      permitDetail = `Expired ${Math.abs(permitVal.daysLeft)} days ago! Trial blocked.`
      riskWarnings.push("Learner's permit has expired! Practical trial cannot be booked.")
      actionItems.push("Renew 6-month DMT Learner's Permit immediately.")
    } else if (permitVal.state === 'expiring_soon') {
      permitScore = 10
      permitFactorStatus = 'warning'
      permitDetail = `Active (${permitVal.daysLeft} days left before expiry)`
      riskWarnings.push(`Permit expiring soon (${permitVal.daysLeft} days). Schedule trial before expiry.`)
      actionItems.push('Fast-track trial booking or apply for permit extension.')
    } else {
      permitScore = 15
      permitFactorStatus = 'passed'
      permitDetail = `Valid: #${permit.permit_number} (${permitVal.daysLeft} days remaining)`
    }
  } else {
    permitScore = 0
    permitFactorStatus = 'failed'
    riskWarnings.push("No DMT Learner's Permit recorded.")
    actionItems.push("Apply for Department of Motor Traffic learner's permit.")
  }

  factors.push({
    key: 'permit',
    title: "DMT Learner's Permit",
    score: permitScore,
    maxScore: 15,
    status: permitFactorStatus,
    detail: permitDetail,
  })

  // -------------------------------------------------------------
  // Factor 3: DMT Theory Exam (15 Points)
  // -------------------------------------------------------------
  let theoryScore = 0
  let theoryFactorStatus: ReadinessFactor['status'] = 'pending'
  let theoryDetail = 'DMT computerized theory exam pending.'

  const passedTheory = theoryExams.find((e) => e.status === 'passed')
  const scheduledTheory = theoryExams.find((e) => e.status === 'scheduled')

  if (passedTheory) {
    theoryScore = 15
    theoryFactorStatus = 'passed'
    theoryDetail = `Passed computerized test${passedTheory.score ? ` (${passedTheory.score}%)` : ''}`
  } else if (scheduledTheory) {
    theoryScore = 5
    theoryFactorStatus = 'warning'
    theoryDetail = `Theory exam scheduled for ${scheduledTheory.scheduled_date}`
    actionItems.push(`Attend DMT Theory Exam on ${scheduledTheory.scheduled_date}.`)
  } else {
    theoryScore = 0
    theoryFactorStatus = 'failed'
    riskWarnings.push('DMT Theory Examination not yet passed.')
    actionItems.push('Complete theory class mock tests and register for computerized exam.')
  }

  factors.push({
    key: 'theory',
    title: 'DMT Theory Exam',
    score: theoryScore,
    maxScore: 15,
    status: theoryFactorStatus,
    detail: theoryDetail,
  })

  // -------------------------------------------------------------
  // Factor 4: Practical Lessons & Hours (25 Points)
  // -------------------------------------------------------------
  const completedCount = completedSessions.length
  let practicalScore = 0
  let practicalFactorStatus: ReadinessFactor['status'] = 'pending'
  const estimatedHours = completedCount * 1.25 // avg ~1.25 hr per session

  if (completedCount >= 12 || estimatedHours >= 15) {
    practicalScore = 25
    practicalFactorStatus = 'passed'
  } else if (completedCount >= 8) {
    practicalScore = 18
    practicalFactorStatus = 'warning'
    actionItems.push(`Complete ${12 - completedCount} more practical driving sessions.`)
  } else if (completedCount >= 4) {
    practicalScore = 10
    practicalFactorStatus = 'warning'
    actionItems.push(`Complete ${12 - completedCount} more practical driving sessions.`)
  } else {
    practicalScore = Math.min(6, completedCount * 1.5)
    practicalFactorStatus = 'failed'
    riskWarnings.push(`Low practical training (${completedCount} sessions completed, minimum 12 recommended).`)
    actionItems.push('Schedule regular weekly practical driving lessons.')
  }

  factors.push({
    key: 'practical_hours',
    title: 'Practical Driving Sessions',
    score: Math.round(practicalScore),
    maxScore: 25,
    status: practicalFactorStatus,
    detail: `${completedCount} sessions logged (~${estimatedHours.toFixed(1)} practical hours)`,
  })

  // -------------------------------------------------------------
  // Factor 5: DMT Practical Skills Mastery (20 Points)
  // -------------------------------------------------------------
  const masteredSkillsSet = new Set<string>()
  for (const sess of completedSessions) {
    for (const skill of sess.skills_covered || []) {
      masteredSkillsSet.add(skill)
    }
  }

  const missingSkills = CORE_DMT_PRACTICAL_SKILLS.filter(
    (s) => !masteredSkillsSet.has(s),
  )
  const masteredCoreCount = CORE_DMT_PRACTICAL_SKILLS.length - missingSkills.length
  const skillsScore = Math.min(
    20,
    Math.round((masteredCoreCount / CORE_DMT_PRACTICAL_SKILLS.length) * 20),
  )

  const skillsFactorStatus: ReadinessFactor['status'] =
    masteredCoreCount >= 6
      ? 'passed'
      : masteredCoreCount >= 4
        ? 'warning'
        : 'failed'

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 3).join(', ')
    riskWarnings.push(`Key DMT skills not yet mastered: ${topMissing}`)
    actionItems.push(`Focus next lesson on: ${topMissing}.`)
  }

  factors.push({
    key: 'skills_mastery',
    title: 'DMT Practical Skills',
    score: skillsScore,
    maxScore: 20,
    status: skillsFactorStatus,
    detail: `${masteredCoreCount} / ${CORE_DMT_PRACTICAL_SKILLS.length} core trial skills covered`,
  })

  // -------------------------------------------------------------
  // Factor 6: Instructor Performance Ratings (10 Points)
  // -------------------------------------------------------------
  const ratings = completedSessions
    .map((s) => s.student_rating)
    .filter((r): r is number => r !== null && r !== undefined && r > 0)

  let avgRating: number | null = null
  let ratingScore = 5
  let ratingStatus: ReadinessFactor['status'] = 'pending'
  let ratingDetail = 'No instructor evaluations logged.'

  if (ratings.length > 0) {
    const sum = ratings.reduce((a, b) => a + b, 0)
    avgRating = Number((sum / ratings.length).toFixed(1))

    if (avgRating >= 4.2) {
      ratingScore = 10
      ratingStatus = 'passed'
      ratingDetail = `Average rating: ${avgRating} / 5.0 (Consistent Performance)`
    } else if (avgRating >= 3.2) {
      ratingScore = 7
      ratingStatus = 'warning'
      ratingDetail = `Average rating: ${avgRating} / 5.0 (Satisfactory Progress)`
    } else {
      ratingScore = 3
      ratingStatus = 'failed'
      ratingDetail = `Average rating: ${avgRating} / 5.0 (Needs Additional Practice)`
      actionItems.push('Review driving errors noted by instructor in lesson feedback.')
    }
  }

  factors.push({
    key: 'instructor_rating',
    title: 'Instructor Evaluation',
    score: ratingScore,
    maxScore: 10,
    status: ratingStatus,
    detail: ratingDetail,
  })

  // -------------------------------------------------------------
  // Financial Check
  // -------------------------------------------------------------
  if (financialBalance > 0) {
    riskWarnings.push(`Outstanding course fee balance: LKR ${financialBalance.toLocaleString('en-LK')}.`)
    actionItems.push('Settle remaining course fee balance before trial date.')
  }

  // -------------------------------------------------------------
  // Total Score & Tier Calculation
  // -------------------------------------------------------------
  let totalScore = factors.reduce((sum, f) => sum + f.score, 0)
  totalScore = Math.max(0, Math.min(100, totalScore))

  let readinessTier: ReadinessTier = 'not_ready'
  let recommendationSummary = ''

  if (totalScore >= 85) {
    readinessTier = 'trial_ready'
    recommendationSummary =
      'Candidate has satisfied all DMT prerequisites, completed thorough practical road hours, and mastered all core maneuvers. Recommended to register for the official DMT Practical Trial Exam.'
  } else if (totalScore >= 70) {
    readinessTier = 'nearly_ready'
    recommendationSummary =
      'Candidate is close to trial proficiency. Recommend 1 to 2 targeted mock test sessions to practice remaining maneuvers before official trial registration.'
  } else if (totalScore >= 50) {
    readinessTier = 'needs_practice'
    recommendationSummary =
      'Student is making steady training progress. Recommend continuing regular practical driving lessons and ensuring theory exam clearance.'
  } else {
    readinessTier = 'not_ready'
    recommendationSummary =
      'Candidate is not yet ready for trial registration due to missing medical/permit clearances, incomplete theory exams, or insufficient practical training.'
  }

  const evaluation: ReadinessEvaluation = {
    driving_school_id: drivingSchoolId,
    student_id: studentId,
    readiness_score: totalScore,
    readiness_tier: readinessTier,
    recommendation_summary: recommendationSummary,
    skills_mastered_count: masteredCoreCount,
    skills_missing: missingSkills,
    practical_hours_completed: Number(estimatedHours.toFixed(1)),
    permit_status: permit?.status || 'not_applied',
    medical_status: medical?.status || 'not_scheduled',
    theory_exam_status: passedTheory ? 'passed' : scheduledTheory ? 'scheduled' : 'pending',
    risk_warnings: riskWarnings,
    action_items: actionItems,
    evaluator_type: 'rule_engine',
    evaluated_at: new Date().toISOString(),
  }

  return {
    evaluation,
    factors,
    averageRating: avgRating,
  }
}
