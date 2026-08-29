import React, { useEffect, useMemo, useState } from 'react'
import type {
  CreatePracticalSessionInput,
  PracticalSessionWithRelations,
  SessionBranchSummary,
  SessionCategorySummary,
  SessionConflict,
  SessionInstructorSummary,
  SessionStudentSummary,
  SessionVehicleSummary,
  UpdatePracticalSessionInput,
} from '../types/session'
import { DMT_PRACTICAL_SKILLS } from '../types/session'
import {
  formatTime12Hour,
  validateSessionInput,
} from '../utils/sessionValidation'

interface SessionBookingModalProps {
  isOpen: boolean
  onClose: () => void
  initialSession?: PracticalSessionWithRelations | null
  initialDate?: string
  initialStartTime?: string
  drivingSchoolId: string
  branches: SessionBranchSummary[]
  students: SessionStudentSummary[]
  instructors: SessionInstructorSummary[]
  vehicles: SessionVehicleSummary[]
  categories: SessionCategorySummary[]
  onCheckConflicts: (candidate: {
    sessionDate: string
    startTime: string
    endTime: string
    instructorId: string
    vehicleId?: string | null
    studentId: string
    excludeSessionId?: string
  }) => SessionConflict[]
  onSave: (
    input: CreatePracticalSessionInput | UpdatePracticalSessionInput,
  ) => Promise<unknown>
}

export const SessionBookingModal: React.FC<SessionBookingModalProps> = ({
  isOpen,
  onClose,
  initialSession,
  initialDate,
  initialStartTime,
  drivingSchoolId,
  branches,
  students,
  instructors,
  vehicles,
  categories,
  onCheckConflicts,
  onSave,
}) => {
  const [branchId, setBranchId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [instructorId, setInstructorId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sessionDate, setSessionDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:30')
  const [skillsCovered, setSkillsCovered] = useState<string[]>([])

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Initialize form state
  useEffect(() => {
    if (initialSession) {
      setBranchId(initialSession.branch_id)
      setStudentId(initialSession.student_id)
      setInstructorId(initialSession.instructor_id)
      setVehicleId(initialSession.vehicle_id || '')
      setCategoryId(initialSession.licence_category_id)
      setSessionDate(initialSession.session_date)
      setStartTime(initialSession.start_time.slice(0, 5))
      setEndTime(initialSession.end_time.slice(0, 5))
      setSkillsCovered(initialSession.skills_covered || [])
    } else {
      setBranchId(branches[0]?.id || '')
      setStudentId('')
      setInstructorId(instructors[0]?.id || '')
      setVehicleId(vehicles[0]?.id || '')
      setCategoryId(categories[0]?.id || '')
      setSessionDate(
        initialDate || new Date().toISOString().split('T')[0],
      )
      setStartTime(initialStartTime || '09:00')
      setEndTime('10:30')
      setSkillsCovered([])
    }
    setFormErrors({})
    setSubmitError(null)
  }, [
    initialSession,
    initialDate,
    initialStartTime,
    branches,
    instructors,
    vehicles,
    categories,
    isOpen,
  ])

  // Real-time Conflict Avoidance Detection
  const conflicts = useMemo(() => {
    if (
      !sessionDate ||
      !startTime ||
      !endTime ||
      !instructorId ||
      !studentId
    ) {
      return []
    }

    return onCheckConflicts({
      sessionDate,
      startTime,
      endTime,
      instructorId,
      vehicleId: vehicleId || null,
      studentId,
      excludeSessionId: initialSession?.id,
    })
  }, [
    sessionDate,
    startTime,
    endTime,
    instructorId,
    vehicleId,
    studentId,
    initialSession,
    onCheckConflicts,
  ])

  if (!isOpen) return null

  const handleToggleSkill = (skill: string) => {
    setSkillsCovered((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  const handleQuickDuration = (mins: number) => {
    const [h, m] = startTime.split(':').map((v) => parseInt(v, 10))
    const total = h * 60 + m + mins
    const newH = Math.floor(total / 60)
    const newM = total % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    setEndTime(`${pad(newH)}:${pad(newM)}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const candidateInput = {
      driving_school_id: drivingSchoolId,
      branch_id: branchId,
      student_id: studentId,
      instructor_id: instructorId,
      vehicle_id: vehicleId || null,
      licence_category_id: categoryId,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      skills_covered: skillsCovered,
    }

    const errors = validateSessionInput(candidateInput)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (conflicts.length > 0) {
      setSubmitError(
        'Cannot schedule: A schedule conflict exists for the selected instructor, vehicle, or student.',
      )
      return
    }

    try {
      setIsSubmitting(true)
      await onSave(candidateInput)
      onClose()
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to save session.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialSession
                ? 'Edit Practical Driving Session'
                : 'Schedule Practical Driving Lesson'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Allocate student, instructor, vehicle, and time slot with automatic
              conflict checking.
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
              <span className="font-bold text-red-600">✕</span>
              <span>{submitError}</span>
            </div>
          )}

          {/* Schedule Conflict Warning Banner */}
          {conflicts.length > 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 space-y-1.5 animate-pulse">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <span>⚠️</span>
                <span>Schedule Conflict Detected</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900">
                {conflicts.map((c, idx) => (
                  <li key={idx}>
                    <strong className="capitalize">{c.type}:</strong>{' '}
                    {c.entityName} is already booked from{' '}
                    {formatTime12Hour(c.startTime)} to{' '}
                    {formatTime12Hour(c.endTime)}.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Student */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student <span className="text-red-500">*</span>
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="">Select Student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} ({s.admission_number})
                  </option>
                ))}
              </select>
              {formErrors.student_id && (
                <p className="mt-1 text-[11px] text-red-600">
                  {formErrors.student_id}
                </p>
              )}
            </div>

            {/* Licence Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Licence Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} – {c.name}
                  </option>
                ))}
              </select>
              {formErrors.licence_category_id && (
                <p className="mt-1 text-[11px] text-red-600">
                  {formErrors.licence_category_id}
                </p>
              )}
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instructor <span className="text-red-500">*</span>
              </label>
              <select
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="">Select Instructor...</option>
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.full_name} {i.staff_number ? `(${i.staff_number})` : ''}
                  </option>
                ))}
              </select>
              {formErrors.instructor_id && (
                <p className="mt-1 text-[11px] text-red-600">
                  {formErrors.instructor_id}
                </p>
              )}
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle (Optional)
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="">No Vehicle / Ground Training</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registration_number} ({v.make} {v.model})
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch Location <span className="text-red-500">*</span>
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {formErrors.branch_id && (
                <p className="mt-1 text-[11px] text-red-600">
                  {formErrors.branch_id}
                </p>
              )}
            </div>

            {/* Session Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Session Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
              {formErrors.session_date && (
                <p className="mt-1 text-[11px] text-red-600">
                  {formErrors.session_date}
                </p>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
              {formErrors.start_time && (
                <p className="mt-1 text-[11px] text-red-600">
                  {formErrors.start_time}
                </p>
              )}
            </div>

            {/* End Time with Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  End Time <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickDuration(60)}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    +1h
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDuration(90)}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    +1.5h
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDuration(120)}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    +2h
                  </button>
                </div>
              </div>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
              {formErrors.end_time && (
                <p className="mt-1 text-[11px] text-red-600">
                  {formErrors.end_time}
                </p>
              )}
            </div>
          </div>

          {/* DMT Skills Planned */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Planned DMT Training Skills
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DMT_PRACTICAL_SKILLS.map((skill) => {
                const isSelected = skillsCovered.includes(skill)
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => handleToggleSkill(skill)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Modal Actions */}
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
              disabled={isSubmitting || conflicts.length > 0}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting
                ? 'Saving...'
                : initialSession
                  ? 'Update Lesson'
                  : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SessionBookingModal
