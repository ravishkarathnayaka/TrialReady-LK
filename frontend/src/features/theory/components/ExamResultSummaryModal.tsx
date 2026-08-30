import React from 'react'
import type { MockExamAttempt } from '../types/theory'

interface ExamResultSummaryModalProps {
  result: MockExamAttempt
  onReview: () => void
  onRetake: () => void
  onExit: () => void
}

export const ExamResultSummaryModal: React.FC<
  ExamResultSummaryModalProps
> = ({ result, onReview, onRetake, onExit }) => {
  const minutes = Math.floor(result.time_spent_seconds / 60)
  const seconds = result.time_spent_seconds % 60
  const formattedDuration = `${minutes}m ${seconds}s`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6">
        {/* Pass / Fail Icon & Banner */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-inner ${
              result.passed
                ? 'bg-emerald-100 text-emerald-600 border-4 border-emerald-300'
                : 'bg-red-100 text-red-600 border-4 border-red-300'
            }`}
          >
            {result.passed ? '🏆' : '⚠️'}
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
            {result.passed ? 'Congratulations! Test Passed' : 'Test Not Passed'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {result.passed
              ? 'You have successfully achieved the DMT computerized theory pass mark!'
              : 'Review your mistakes and retake the test to achieve the 75% pass mark.'}
          </p>
        </div>

        {/* Score Grid */}
        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 text-center border border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Score
            </span>
            <p
              className={`text-xl font-black mt-0.5 ${
                result.passed ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {result.score_percentage}%
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Correct
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              {result.correct_answers_count} / {result.total_questions}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Time
            </span>
            <p className="text-xl font-black text-slate-700 mt-0.5 font-mono text-xs sm:text-base">
              {formattedDuration}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onReview}
            className="w-full rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            🔍 Review All Questions & Explanations
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRetake}
              className="rounded-2xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              🔄 Retake Test
            </button>

            <button
              type="button"
              onClick={onExit}
              className="rounded-2xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              ← Exit to Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamResultSummaryModal
