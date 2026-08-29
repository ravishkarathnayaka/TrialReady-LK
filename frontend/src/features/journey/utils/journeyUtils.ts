import type {
  JourneyStageInfo,
  PermitValidityState,
  StudentExamTrial,
  StudentMedicalRecord,
  StudentPermit,
} from '../types/journey'

export function getDaysDifference(targetDateStr: string): number {
  const target = new Date(targetDateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  const diffTime = target.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function calculateDefaultPermitExpiry(issueDateStr: string): string {
  if (!issueDateStr) return ''
  const d = new Date(issueDateStr)
  d.setMonth(d.getMonth() + 6)
  return d.toISOString().split('T')[0]
}

export function calculatePermitValidity(expiryDateStr?: string | null): {
  state: PermitValidityState
  daysLeft: number
  label: string
  badgeClass: string
} {
  if (!expiryDateStr) {
    return {
      state: 'missing',
      daysLeft: 0,
      label: 'No Permit Recorded',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  }

  const daysLeft = getDaysDifference(expiryDateStr)

  if (daysLeft < 0) {
    return {
      state: 'expired',
      daysLeft,
      label: `Expired ${Math.abs(daysLeft)} days ago`,
      badgeClass: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
    }
  }

  if (daysLeft <= 30) {
    return {
      state: 'expiring_soon',
      daysLeft,
      label: `Expiring in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`,
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    }
  }

  return {
    state: 'valid',
    daysLeft,
    label: `Active (${daysLeft} days left)`,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  }
}

export function computeJourneyStages(data: {
  permit: StudentPermit | null
  medical: StudentMedicalRecord | null
  theoryExams: StudentExamTrial[]
  practicalTrials: StudentExamTrial[]
  completedLessonsCount: number
}): {
  stages: JourneyStageInfo[]
  currentStageNumber: number
  currentStageName: string
  completionPercentage: number
} {
  const { permit, medical, theoryExams, practicalTrials, completedLessonsCount } =
    data

  // Stage 1: Registration
  const stage1: JourneyStageInfo = {
    stageNumber: 1,
    key: 'registration',
    title: 'Registration & Enrolment',
    status: 'completed',
    description: 'Student registration and licence categories confirmed.',
    badgeText: '✓ Complete',
  }

  // Stage 2: NTMI Medical
  let stage2Status: JourneyStageInfo['status'] = 'pending'
  let stage2Badge = 'Pending'
  if (medical?.status === 'passed') {
    stage2Status = 'completed'
    stage2Badge = '✓ Fitness Cleared'
  } else if (medical?.status === 'appointment_booked') {
    stage2Status = 'in_progress'
    stage2Badge = 'Appointment Booked'
  } else if (
    medical?.status === 'failed' ||
    medical?.status === 'temporary_unfit'
  ) {
    stage2Status = 'blocked'
    stage2Badge = 'Unfit / Retest Required'
  }
  const stage2: JourneyStageInfo = {
    stageNumber: 2,
    key: 'medical',
    title: 'NTMI Medical Clearance',
    status: stage2Status,
    description:
      medical?.certificate_number
        ? `Cert: ${medical.certificate_number} (${medical.ntmi_branch ?? 'NTMI'})`
        : 'National Transport Medical Institute examination.',
    badgeText: stage2Badge,
  }

  // Stage 3: Learner's Permit
  let stage3Status: JourneyStageInfo['status'] = 'pending'
  let stage3Badge = 'Not Applied'
  if (permit) {
    const validity = calculatePermitValidity(permit.expiry_date)
    if (validity.state === 'expired') {
      stage3Status = 'blocked'
      stage3Badge = '✕ Expired'
    } else {
      stage3Status = 'completed'
      stage3Badge = `✓ ${permit.permit_number}`
    }
  } else if (stage2Status === 'completed') {
    stage3Status = 'in_progress'
    stage3Badge = 'Ready to Apply'
  }
  const stage3: JourneyStageInfo = {
    stageNumber: 3,
    key: 'permit',
    title: "Learner's Permit (DMT)",
    status: stage3Status,
    description: permit
      ? `Permit #${permit.permit_number} (Exp: ${permit.expiry_date})`
      : "Official Department of Motor Traffic learner's permit.",
    badgeText: stage3Badge,
  }

  // Stage 4: Theory Exam
  const passedTheory = theoryExams.find((e) => e.status === 'passed')
  const scheduledTheory = theoryExams.find((e) => e.status === 'scheduled')
  let stage4Status: JourneyStageInfo['status'] = 'pending'
  let stage4Badge = 'Pending'
  if (passedTheory) {
    stage4Status = 'completed'
    stage4Badge = `✓ Passed (${passedTheory.score ?? 100}%)`
  } else if (scheduledTheory) {
    stage4Status = 'in_progress'
    stage4Badge = `Exam on ${scheduledTheory.scheduled_date}`
  } else if (stage3Status === 'completed') {
    stage4Status = 'in_progress'
    stage4Badge = 'Eligible for Exam'
  }
  const stage4: JourneyStageInfo = {
    stageNumber: 4,
    key: 'theory',
    title: 'DMT Theory Exam',
    status: stage4Status,
    description: passedTheory
      ? `Passed computerized test on ${passedTheory.scheduled_date}.`
      : 'Computerized traffic road rules and signs exam.',
    badgeText: stage4Badge,
  }

  // Stage 5: Practical Lessons
  let stage5Status: JourneyStageInfo['status'] = 'pending'
  let stage5Badge = `${completedLessonsCount} / 10 Lessons`
  if (completedLessonsCount >= 10) {
    stage5Status = 'completed'
    stage5Badge = `✓ Complete (${completedLessonsCount} Lessons)`
  } else if (completedLessonsCount > 0) {
    stage5Status = 'in_progress'
    stage5Badge = `${completedLessonsCount} Lessons Logged`
  } else if (stage4Status === 'completed') {
    stage5Status = 'in_progress'
    stage5Badge = 'Training Ready'
  }
  const stage5: JourneyStageInfo = {
    stageNumber: 5,
    key: 'lessons',
    title: 'Practical Driving Lessons',
    status: stage5Status,
    description: `${completedLessonsCount} practical driving sessions completed.`,
    badgeText: stage5Badge,
  }

  // Stage 6: Practical Trial Exam
  const passedTrial = practicalTrials.find((t) => t.status === 'passed')
  const scheduledTrial = practicalTrials.find((t) => t.status === 'scheduled')
  let stage6Status: JourneyStageInfo['status'] = 'pending'
  let stage6Badge = 'Not Eligible'
  if (passedTrial) {
    stage6Status = 'completed'
    stage6Badge = '✓ Trial Passed'
  } else if (scheduledTrial) {
    stage6Status = 'in_progress'
    stage6Badge = `Trial on ${scheduledTrial.scheduled_date}`
  } else if (stage5Status === 'completed') {
    stage6Status = 'in_progress'
    stage6Badge = 'Ready for Trial'
  }
  const stage6: JourneyStageInfo = {
    stageNumber: 6,
    key: 'trial',
    title: 'DMT Practical Trial',
    status: stage6Status,
    description: passedTrial
      ? `Practical trial passed on ${passedTrial.scheduled_date}!`
      : 'Final driving test conducted at DMT test grounds.',
    badgeText: stage6Badge,
  }

  // Stage 7: Driving Licence
  let stage7Status: JourneyStageInfo['status'] = 'pending'
  let stage7Badge = 'Pending Trial'
  if (passedTrial) {
    stage7Status = 'completed'
    stage7Badge = '🏆 Licence Granted'
  }
  const stage7: JourneyStageInfo = {
    stageNumber: 7,
    key: 'licence',
    title: 'Driving Licence Issued',
    status: stage7Status,
    description: passedTrial
      ? 'Official driving licence card granted by DMT Sri Lanka.'
      : 'Completion of all requirements and issuance of driving licence.',
    badgeText: stage7Badge,
  }

  const stages = [stage1, stage2, stage3, stage4, stage5, stage6, stage7]
  const completedCount = stages.filter((s) => s.status === 'completed').length
  const completionPercentage = Math.round((completedCount / stages.length) * 100)

  let currentStageNumber = 1
  let currentStageName = stage1.title
  for (const s of stages) {
    if (s.status !== 'completed') {
      currentStageNumber = s.stageNumber
      currentStageName = s.title
      break
    }
  }
  if (completedCount === stages.length) {
    currentStageNumber = 7
    currentStageName = 'Driving Licence Granted'
  }

  return {
    stages,
    currentStageNumber,
    currentStageName,
    completionPercentage,
  }
}
