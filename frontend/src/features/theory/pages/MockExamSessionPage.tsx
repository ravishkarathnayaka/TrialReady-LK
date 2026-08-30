import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { ExamResultSummaryModal } from '../components/ExamResultSummaryModal'
import { ExamTimerHeader } from '../components/ExamTimerHeader'
import { TheoryQuestionCard } from '../components/TheoryQuestionCard'
import { useMockExamSimulator } from '../hooks/useMockExamSimulator'

export const MockExamSessionPage: React.FC = () => {
  const navigate = useNavigate()
  const { drivingSchoolId, user } = useAuth()
  const studentId = user?.id || 'demo-student'

  const {
    questions,
    currentQuestion,
    currentIndex,
    selectedAnswers,
    timeRemainingSeconds,
    isSubmitted,
    examResult,
    isLoading,
    errorMessage,
    selectOption,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitExam,
    restartExam,
  } = useMockExamSimulator(drivingSchoolId, studentId)

  const [showResultModal, setShowResultModal] = useState(true)
  const [isReviewMode, setIsReviewMode] = useState(false)

  const handleReviewAnswers = () => {
    setIsReviewMode(true)
    setShowResultModal(false)
    goToQuestion(0)
  }

  const handleRetakeExam = () => {
    setIsReviewMode(false)
    setShowResultModal(true)
    restartExam()
  }

  const handleExit = () => {
    navigate('/theory')
  }

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Preparing computerized theory test simulator...
          </p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">
          No questions available.
        </p>
        <button
          type="button"
          onClick={handleExit}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
        >
          ← Back to Theory Hub
        </button>
      </div>
    )
  }

  const answeredCount = Object.keys(selectedAnswers).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Timer & Header */}
      <ExamTimerHeader
        timeRemainingSeconds={timeRemainingSeconds}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        isSubmitted={isSubmitted}
        onSubmitExam={submitExam}
      />

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Review Mode Banner */}
      {isReviewMode && (
        <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900">
          <span className="font-bold">
            🔍 Review Mode: Showing correct answers and Highway Code explanations
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRetakeExam}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              🔄 Retake Test
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* Question Card */}
      <TheoryQuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedOptionIndex={selectedAnswers[currentQuestion.id]}
        isReviewMode={isReviewMode}
        onSelectOption={(idx) => selectOption(currentQuestion.id, idx)}
      />

      {/* Question Navigation Controls & Palette */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        {/* Next / Previous */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-40 cursor-pointer"
          >
            ← Previous Question
          </button>

          <span className="text-xs font-mono font-bold text-slate-500">
            {currentIndex + 1} of {questions.length}
          </span>

          <button
            type="button"
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all disabled:opacity-40 cursor-pointer"
          >
            Next Question →
          </button>
        </div>

        {/* Numbered Question Palette */}
        <div className="border-t border-slate-100 pt-4">
          <span className="text-[11px] font-bold text-slate-500 block mb-2">
            Question Navigator:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined
              const isCurrent = idx === currentIndex

              let btnColor = 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              if (isCurrent) {
                btnColor = 'ring-2 ring-blue-600 bg-blue-600 text-white font-bold'
              } else if (isReviewMode) {
                const isCorrect = selectedAnswers[q.id] === q.correct_option_index
                btnColor = isCorrect
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'bg-red-100 text-red-800 font-bold'
              } else if (isAnswered) {
                btnColor = 'bg-blue-100 text-blue-900 font-bold'
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goToQuestion(idx)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs transition-all cursor-pointer ${btnColor}`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {isSubmitted && examResult && showResultModal && (
        <ExamResultSummaryModal
          result={examResult}
          onReview={handleReviewAnswers}
          onRetake={handleRetakeExam}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

export default MockExamSessionPage
