import { useCallback, useEffect, useState } from 'react'
import { getTheoryQuestions, recordMockExamAttempt } from '../services/theoryService'
import type {
  MockExamAttempt,
  StudentAnswer,
  TheoryQuestion,
} from '../types/theory'

const EXAM_DURATION_SECONDS = 30 * 60 // 30 minutes

export function useMockExamSimulator(
  drivingSchoolId: string,
  studentId: string,
) {
  const [questions, setQuestions] = useState<TheoryQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({})
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(
    EXAM_DURATION_SECONDS,
  )
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [examResult, setExamResult] = useState<MockExamAttempt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Initialize exam
  const startExam = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const allQ = await getTheoryQuestions()

      // Shuffle questions
      const shuffled = [...allQ].sort(() => 0.5 - Math.random())

      setQuestions(shuffled)
      setCurrentIndex(0)
      setSelectedAnswers({})
      setTimeRemainingSeconds(EXAM_DURATION_SECONDS)
      setIsSubmitted(false)
      setExamResult(null)
      setIsTimerActive(true)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to initialize exam.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    startExam()
  }, [startExam])

  // Timer Tick
  useEffect(() => {
    if (!isTimerActive || isSubmitted) return

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // Time expired -> auto-submit
          submitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerActive, isSubmitted])

  const selectOption = useCallback(
    (questionId: string, optionIndex: number) => {
      if (isSubmitted) return
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
    },
    [isSubmitted],
  )

  const nextQuestion = useCallback(() => {
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
  }, [questions.length])

  const prevQuestion = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const submitExam = useCallback(async () => {
    if (isSubmitted) return
    setIsTimerActive(false)
    setIsSubmitted(true)

    let correctCount = 0
    const answers: StudentAnswer[] = []

    for (const q of questions) {
      const selected = selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : null
      const isCorrect = selected === q.correct_option_index
      if (isCorrect) correctCount++

      answers.push({
        question_id: q.id,
        selected_index: selected,
        is_correct: isCorrect,
      })
    }

    const totalQ = questions.length
    const scorePercentage = totalQ > 0 ? Number(((correctCount / totalQ) * 100).toFixed(1)) : 0
    const passed = scorePercentage >= 75 // 75% pass mark in Sri Lanka DMT
    const timeSpent = EXAM_DURATION_SECONDS - timeRemainingSeconds

    const resultPayload: MockExamAttempt = {
      driving_school_id: drivingSchoolId,
      student_id: studentId,
      total_questions: totalQ,
      correct_answers_count: correctCount,
      score_percentage: scorePercentage,
      passed,
      time_spent_seconds: timeSpent,
      answers,
      attempted_at: new Date().toISOString(),
    }

    setExamResult(resultPayload)

    // Save to database
    try {
      await recordMockExamAttempt({
        driving_school_id: drivingSchoolId,
        student_id: studentId,
        total_questions: totalQ,
        correct_answers_count: correctCount,
        score_percentage: scorePercentage,
        passed,
        time_spent_seconds: timeSpent,
        answers,
      })
    } catch (e) {
      console.error('Failed to persist mock exam attempt:', e)
    }
  }, [
    isSubmitted,
    questions,
    selectedAnswers,
    timeRemainingSeconds,
    drivingSchoolId,
    studentId,
  ])

  return {
    questions,
    currentQuestion: questions[currentIndex] || null,
    currentIndex,
    selectedAnswers,
    timeRemainingSeconds,
    isTimerActive,
    isSubmitted,
    examResult,
    isLoading,
    errorMessage,
    selectOption,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitExam,
    restartExam: startExam,
  }
}
