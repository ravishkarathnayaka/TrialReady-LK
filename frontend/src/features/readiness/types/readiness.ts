export type ReadinessTier =
  | 'trial_ready'
  | 'nearly_ready'
  | 'needs_practice'
  | 'not_ready'

export type ReadinessFactorKey =
  | 'medical'
  | 'permit'
  | 'theory'
  | 'practical_hours'
  | 'skills_mastery'
  | 'instructor_rating'

export interface ReadinessFactor {
  key: ReadinessFactorKey
  title: string
  score: number
  maxScore: number
  status: 'passed' | 'warning' | 'failed' | 'pending'
  detail: string
}

export interface ReadinessEvaluation {
  id?: string
  driving_school_id: string
  student_id: string
  readiness_score: number
  readiness_tier: ReadinessTier
  recommendation_summary: string
  skills_mastered_count: number
  skills_missing: string[]
  practical_hours_completed: number
  permit_status: string
  medical_status: string
  theory_exam_status: string
  risk_warnings: string[]
  action_items: string[]
  evaluator_type: 'rule_engine' | 'ai_assistant'
  evaluated_at: string
}

export interface StudentReadinessProfile {
  student: {
    id: string
    full_name: string
    admission_number: string
    phone: string | null
    email: string | null
    branch_name?: string
  }
  evaluation: ReadinessEvaluation
  factors: ReadinessFactor[]
  totalSessionsCount: number
  averageInstructorRating: number | null
}

export interface SaveReadinessEvaluationInput {
  driving_school_id: string
  student_id: string
  readiness_score: number
  readiness_tier: ReadinessTier
  recommendation_summary: string
  skills_mastered_count: number
  skills_missing: string[]
  practical_hours_completed: number
  permit_status: string
  medical_status: string
  theory_exam_status: string
  risk_warnings: string[]
  action_items: string[]
  evaluator_type?: 'rule_engine' | 'ai_assistant'
}
