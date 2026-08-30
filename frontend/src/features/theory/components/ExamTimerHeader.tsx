import React from 'react'

interface ExamTimerHeaderProps {
  timeRemainingSeconds: number
  totalQuestions: number
  answeredCount: number
  isSubmitted: boolean
  onSubmitExam: () => void
}

export const ExamTimerHeader: React.FC<ExamTimerHeaderProps> = ({
  timeRemainingSeconds,
  totalQuestions,
  answeredCount,
  isSubmitted,
  onSubmitExam,
}) => {
  const minutes = Math.floor(timeRemainingSeconds / 60)
  const seconds = timeRemainingSeconds % 60
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const isLowTime = timeRemainingSeconds <= 5 * 60 && !isSubmitted
  const progressPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Progress */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              DMT Computerized Mock Exam
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
              40 Questions Standard
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Answered <strong className="text-slate-900">{answeredCount}</strong> of {totalQuestions} questions ({progressPercent}%)
          </p>
        </div>

        {/* Timer & Submit */}
        <div className="flex items-center gap-3">
          {!isSubmitted && (
            <div
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-black ${
                isLowTime
                  ? 'border-red-300 bg-red-50 text-red-700 animate-pulse'
                  : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
            >
              <span>⏱️</span>
              <span>{formattedTime}</span>
            </div>
          )}

          {!isSubmitted && (
            <button
              type="button"
              onClick={onSubmitExam}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Finish & Submit Test
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

export default ExamTimerHeader
