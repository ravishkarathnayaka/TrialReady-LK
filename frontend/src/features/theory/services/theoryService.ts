import { supabase } from '../../../lib/supabase'
import { SRI_LANKA_DMT_QUESTION_BANK } from '../data/sriLankaQuestionBank'
import type {
  MockExamAttempt,
  SaveMockAttemptInput,
  TheoryQuestion,
} from '../types/theory'

export async function getTheoryQuestions(
  category?: string,
): Promise<TheoryQuestion[]> {
  try {
    let query = supabase.from('theory_questions').select('*').eq('is_active', true)
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error || !data || data.length === 0) {
      // Fallback to preloaded authentic Sri Lanka question bank
      return category && category !== 'all'
        ? SRI_LANKA_DMT_QUESTION_BANK.filter((q) => q.category === category)
        : SRI_LANKA_DMT_QUESTION_BANK
    }

    return (data as TheoryQuestion[]) ?? SRI_LANKA_DMT_QUESTION_BANK
  } catch {
    return SRI_LANKA_DMT_QUESTION_BANK
  }
}

export async function recordMockExamAttempt(
  input: SaveMockAttemptInput,
): Promise<MockExamAttempt> {
  const { data, error } = await supabase
    .from('student_mock_exam_attempts')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        student_id: input.student_id,
        total_questions: input.total_questions,
        correct_answers_count: input.correct_answers_count,
        score_percentage: input.score_percentage,
        passed: input.passed,
        time_spent_seconds: input.time_spent_seconds,
        answers: input.answers,
        attempted_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to record mock exam attempt: ${error.message}`)
  }

  // If passed with >= 75% score, record into student_exam_trials as theory milestone
  if (input.passed) {
    try {
      await supabase.from('student_exam_trials').insert([
        {
          driving_school_id: input.driving_school_id,
          student_id: input.student_id,
          exam_type: 'theory',
          attempt_number: 1,
          scheduled_date: new Date().toISOString().split('T')[0],
          status: 'passed',
          score: Math.round(input.score_percentage),
          location: 'TrialReady DMT Practice Simulator',
          examiner_notes: `Cleared computerized practice mock test (${input.correct_answers_count}/${input.total_questions} correct).`,
        },
      ])
    } catch (e) {
      console.warn('Could not auto-sync exam trial milestone:', e)
    }
  }

  return data as MockExamAttempt
}

export async function getStudentMockAttempts(
  studentId: string,
): Promise<MockExamAttempt[]> {
  const { data, error } = await supabase
    .from('student_mock_exam_attempts')
    .select('*')
    .eq('student_id', studentId)
    .order('attempted_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to load mock attempts: ${error.message}`)
  }

  return (data as MockExamAttempt[]) ?? []
}
