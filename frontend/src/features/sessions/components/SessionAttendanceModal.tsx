import React, { useState } from 'react'
import type {
  PracticalSessionWithRelations,
  RecordAttendanceInput,
  SessionAttendanceStatus,
} from '../types/session'
import { DMT_PRACTICAL_SKILLS } from '../types/session'
import { formatTime12Hour } from '../utils/sessionValidation'

interface SessionAttendanceModalProps {
  isOpen: boolean
  session: PracticalSessionWithRelations | null
  onClose: () => void
  onSaveAttendance: (
    sessionId: string,
    input: RecordAttendanceInput,
  ) => Promise<unknown>
}

export const SessionAttendanceModal: React.FC<SessionAttendanceModalProps> = ({
  isOpen,
  session,
  onClose,
  onSaveAttendance,
}) => {
  const [attendanceStatus, setAttendanceStatus] =
    useState<SessionAttendanceStatus>(session?.attendance_status || 'present')
  const [skillsCovered, setSkillsCovered] = useState<string[]>(
    session?.skills_covered || [],
  )
  const [instructorFeedback, setInstructorFeedback] = useState<string>(
    session?.instructor_feedback || '',
  )
  const [studentRating, setStudentRating] = useState<number | null>(
    session?.student_rating || 4,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !session) return null

  const handleToggleSkill = (skill: string) => {
    setSkillsCovered((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setIsSubmitting(true)
      await onSaveAttendance(session.id, {
        attendance_status: attendanceStatus,
        instructor_feedback: instructorFeedback.trim() || null,
        skills_covered: skillsCovered,
        student_rating: studentRating,
      })
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to record attendance.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Record Attendance & Evaluation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {session.student?.full_name} • {session.session_date} (
              {formatTime12Hour(session.start_time)} –{' '}
              {formatTime12Hour(session.end_time)})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Attendance Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Attendance Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAttendanceStatus('present')}
                className={`rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  attendanceStatus === 'present'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                ✓ Present
              </button>

              <button
                type="button"
                onClick={() => setAttendanceStatus('late')}
                className={`rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  attendanceStatus === 'late'
                    ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                ⏱ Late
              </button>

              <button
                type="button"
                onClick={() => setAttendanceStatus('absent')}
                className={`rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  attendanceStatus === 'absent'
                    ? 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                ✕ Absent / No-Show
              </button>
            </div>
          </div>

          {attendanceStatus !== 'absent' && (
            <>
              {/* Practical Skills Covered Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Skills Covered & Mastered
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 rounded-xl border border-slate-200 bg-slate-50">
                  {DMT_PRACTICAL_SKILLS.map((skill) => {
                    const isChecked = skillsCovered.includes(skill)
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Student Performance Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructor Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setStudentRating(star)}
                      className={`h-8 w-8 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                        (studentRating || 0) >= star
                          ? 'bg-amber-400 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 ml-2">
                    {studentRating === 5
                      ? 'Excellent (Trial Ready)'
                      : studentRating === 4
                        ? 'Good Progress'
                        : studentRating === 3
                          ? 'Satisfactory'
                          : studentRating === 2
                            ? 'Needs Practice'
                            : 'Requires Remedial'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Instructor Feedback */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructor Notes & Feedback
            </label>
            <textarea
              rows={3}
              value={instructorFeedback}
              onChange={(e) => setInstructorFeedback(e.target.value)}
              placeholder="e.g. Practiced hill starts on Kandy road slope. Clutch control is solid, work on mirror checks."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Evaluation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SessionAttendanceModal
