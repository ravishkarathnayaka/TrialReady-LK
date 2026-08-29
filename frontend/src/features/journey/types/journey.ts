export type StudentMedicalStatus =
  | 'not_scheduled'
  | 'appointment_booked'
  | 'passed'
  | 'temporary_unfit'
  | 'failed'

export type StudentPermitStatus =
  | 'not_applied'
  | 'applied'
  | 'active'
  | 'expiring_soon'
  | 'expired'
  | 'renewed'

export type StudentExamStatus =
  | 'scheduled'
  | 'passed'
  | 'failed'
  | 'absent'
  | 'cancelled'

export type ExamType = 'theory' | 'practical_trial'

export type PermitValidityState =
  | 'valid'
  | 'expiring_soon'
  | 'expired'
  | 'missing'

export interface StudentPermit {
  id: string
  driving_school_id: string
  student_id: string
  permit_number: string
  issue_date: string
  expiry_date: string
  status: StudentPermitStatus
  dmt_reference: string | null
  notes: string | null
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface StudentMedicalRecord {
  id: string
  driving_school_id: string
  student_id: string
  status: StudentMedicalStatus
  appointment_date: string | null
  certificate_number: string | null
  issued_date: string | null
  expiry_date: string | null
  ntmi_branch: string | null
  blood_group: string | null
  restrictions: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface StudentExamTrial {
  id: string
  driving_school_id: string
  student_id: string
  exam_type: ExamType
  attempt_number: number
  scheduled_date: string
  status: StudentExamStatus
  score: number | null
  location: string | null
  examiner_notes: string | null
  created_at: string
  updated_at: string
}

export interface JourneyStageInfo {
  stageNumber: number
  key:
    | 'registration'
    | 'medical'
    | 'permit'
    | 'theory'
    | 'lessons'
    | 'trial'
    | 'licence'
  title: string
  status: 'completed' | 'in_progress' | 'pending' | 'blocked'
  description: string
  badgeText: string
}

export interface StudentJourneyOverview {
  student: {
    id: string
    full_name: string
    admission_number: string
    phone: string | null
    email: string | null
    registration_date: string
    branch_name?: string
  }
  permit: StudentPermit | null
  medical: StudentMedicalRecord | null
  theoryExams: StudentExamTrial[]
  practicalTrials: StudentExamTrial[]
  completedLessonsCount: number
  overallStage: number
  stageName: string
  percentage: number
}

export interface SavePermitInput {
  driving_school_id: string
  student_id: string
  permit_number: string
  issue_date: string
  expiry_date: string
  dmt_reference?: string | null
  notes?: string | null
}

export interface SaveMedicalInput {
  driving_school_id: string
  student_id: string
  status: StudentMedicalStatus
  appointment_date?: string | null
  certificate_number?: string | null
  issued_date?: string | null
  expiry_date?: string | null
  ntmi_branch?: string | null
  blood_group?: string | null
  restrictions?: string | null
  notes?: string | null
}

export interface SaveExamTrialInput {
  driving_school_id: string
  student_id: string
  exam_type: ExamType
  attempt_number: number
  scheduled_date: string
  status: StudentExamStatus
  score?: number | null
  location?: string | null
  examiner_notes?: string | null
}
