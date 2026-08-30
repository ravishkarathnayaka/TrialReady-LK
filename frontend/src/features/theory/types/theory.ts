export type TheoryQuestionCategory =
  | 'road_signs_regulatory'
  | 'road_signs_warning'
  | 'road_signs_informative'
  | 'priority_and_junctions'
  | 'general_road_safety'
  | 'vehicle_mechanics_controls'

export interface TheoryQuestion {
  id: string
  category: TheoryQuestionCategory
  question_text: string
  image_url?: string | null
  options: string[]
  correct_option_index: number
  explanation: string
}

export interface StudentAnswer {
  question_id: string
  selected_index: number | null
  is_correct: boolean
}

export interface MockExamAttempt {
  id?: string
  driving_school_id: string
  student_id: string
  total_questions: number
  correct_answers_count: number
  score_percentage: number
  passed: boolean
  time_spent_seconds: number
  answers: StudentAnswer[]
  attempted_at: string
}

export interface MockExamState {
  questions: TheoryQuestion[]
  currentIndex: number
  selectedAnswers: Record<string, number>
  isSubmitted: boolean
  timeRemainingSeconds: number
  isTimerActive: boolean
}

export interface SaveMockAttemptInput {
  driving_school_id: string
  student_id: string
  total_questions: number
  correct_answers_count: number
  score_percentage: number
  passed: boolean
  time_spent_seconds: number
  answers: StudentAnswer[]
}
