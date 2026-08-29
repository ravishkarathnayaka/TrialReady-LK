import React, { useEffect, useState } from 'react'
import type {
  ExamType,
  SaveExamTrialInput,
  StudentExamStatus,
} from '../types/journey'

interface ExamTrialModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  drivingSchoolId: string
  defaultExamType?: ExamType
  existingAttemptCount?: number
  onSave: (input: SaveExamTrialInput) => Promise<void>
}

const DMT_LOCATIONS = [
  'Werahera DMT Testing Grounds (Main)',
  'Kandy RMV / Trial Ground',
  'Kurunegala DMT Ground',
  'Gampaha Trial Ground',
  'Galle / Karapitiya RMV',
  'Anuradhapura Trial Ground',
  'Ratnapura RMV',
  'Badulla Trial Ground',
]

export const ExamTrialModal: React.FC<ExamTrialModalProps> = ({
  isOpen,
  onClose,
  studentId,
  drivingSchoolId,
  defaultExamType = 'theory',
  existingAttemptCount = 0,
  onSave,
}) => {
  const [examType, setExamType] = useState<ExamType>(defaultExamType)
  const [attemptNumber, setAttemptNumber] = useState(existingAttemptCount + 1)
  const [scheduledDate, setScheduledDate] = useState('')
  const [status, setStatus] = useState<StudentExamStatus>('scheduled')
  const [score, setScore] = useState<string>('')
  const [location, setLocation] = useState(DMT_LOCATIONS[0])
  const [examinerNotes, setExaminerNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setExamType(defaultExamType)
    setAttemptNumber(existingAttemptCount + 1)
    setScheduledDate(new Date().toISOString().split('T')[0])
    setStatus('scheduled')
    setScore('')
    setLocation(DMT_LOCATIONS[0])
    setExaminerNotes('')
    setError(null)
  }, [defaultExamType, existingAttemptCount, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!scheduledDate) {
      setError('Scheduled date is required.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSave({
        driving_school_id: drivingSchoolId,
        student_id: studentId,
        exam_type: examType,
        attempt_number: attemptNumber,
        scheduled_date: scheduledDate,
        status,
        score: score ? parseInt(score, 10) : null,
        location,
        examiner_notes: examinerNotes.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to schedule exam/trial.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Schedule {examType === 'theory' ? 'Theory Exam' : 'Practical Trial'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Department of Motor Traffic (DMT) Examination
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Exam Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="theory">📖 DMT Theory Exam</option>
                <option value="practical_trial">🎯 Practical Trial Exam</option>
              </select>
            </div>

            {/* Attempt Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attempt #
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={attemptNumber}
                onChange={(e) =>
                  setAttemptNumber(parseInt(e.target.value, 10) || 1)
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Scheduled Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exam Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Result / Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentExamStatus)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="scheduled">Scheduled (Pending)</option>
                <option value="passed">✓ Passed</option>
                <option value="failed">✕ Failed</option>
                <option value="absent">Absent / No Show</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Score (if passed/failed) */}
          {(status === 'passed' || status === 'failed') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exam Score (%) (Optional)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 85"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              DMT Exam / Trial Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              {DMT_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Examiner / Feedback Notes
            </label>
            <textarea
              rows={2}
              value={examinerNotes}
              onChange={(e) => setExaminerNotes(e.target.value)}
              placeholder="e.g. Cleared 3-point turn & S-bend flawlessly on first attempt."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Exam / Trial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExamTrialModal
