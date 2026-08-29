import React, { useState } from 'react'
import { SessionAttendanceModal } from '../components/SessionAttendanceModal'
import { SessionBookingModal } from '../components/SessionBookingModal'
import { SessionCalendarView } from '../components/SessionCalendarView'
import { SessionListView } from '../components/SessionListView'
import { usePracticalSessions } from '../hooks/usePracticalSessions'
import type {
  CreatePracticalSessionInput,
  PracticalSessionWithRelations,
  UpdatePracticalSessionInput,
} from '../types/session'

interface PracticalSessionManagementPageProps {
  drivingSchoolId: string
}

export const PracticalSessionManagementPage: React.FC<
  PracticalSessionManagementPageProps
> = ({ drivingSchoolId }) => {
  const {
    sessions,
    filteredSessions,
    students,
    instructors,
    vehicles,
    categories,
    branches,
    filters,
    viewMode,
    calendarAnchorDate,
    metrics,
    isLoading,
    errorMessage,
    successMessage,
    setViewMode,
    setCalendarAnchorDate,
    setFilter,
    resetFilters,
    setErrorMessage,
    setSuccessMessage,
    checkConflicts,
    handleCreateSession,
    handleUpdateSession,
    handleRecordAttendance,
    handleCancelSession,
    handleDeleteSession,
  } = usePracticalSessions(drivingSchoolId)

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedSessionForEdit, setSelectedSessionForEdit] =
    useState<PracticalSessionWithRelations | null>(null)
  const [bookingInitialDate, setBookingInitialDate] = useState<string>('')
  const [bookingInitialStartTime, setBookingInitialStartTime] =
    useState<string>('09:00')

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false)
  const [selectedSessionForAttendance, setSelectedSessionForAttendance] =
    useState<PracticalSessionWithRelations | null>(null)

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [sessionToCancel, setSessionToCancel] =
    useState<PracticalSessionWithRelations | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')

  const handleOpenNewBooking = (date?: string, startTime?: string) => {
    setSelectedSessionForEdit(null)
    setBookingInitialDate(date || '')
    setBookingInitialStartTime(startTime || '09:00')
    setIsBookingOpen(true)
  }

  const handleOpenEdit = (session: PracticalSessionWithRelations) => {
    setSelectedSessionForEdit(session)
    setIsBookingOpen(true)
  }

  const handleOpenAttendance = (session: PracticalSessionWithRelations) => {
    setSelectedSessionForAttendance(session)
    setIsAttendanceOpen(true)
  }

  const handleOpenCancel = (session: PracticalSessionWithRelations) => {
    setSessionToCancel(session)
    setCancellationReason('')
    setIsCancelModalOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!sessionToCancel) return
    try {
      await handleCancelSession(
        sessionToCancel.id,
        cancellationReason || 'Cancelled by administration',
      )
      setIsCancelModalOpen(false)
      setSessionToCancel(null)
    } catch {
      // Error handled in hook
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Practical Driving Sessions
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Schedule lessons, manage instructor & vehicle assignments, and
            prevent overlapping conflicts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 Calendar
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📋 List View
            </button>
          </div>

          {/* Schedule Lesson Action */}
          <button
            type="button"
            onClick={() => handleOpenNewBooking()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            + Schedule Lesson
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            Today's Lessons
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {metrics.todayTotal}
          </p>
          <p className="mt-0.5 text-[11px] text-blue-600 font-medium">
            Active Schedule
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            Upcoming Scheduled
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {metrics.scheduled}
          </p>
          <p className="mt-0.5 text-[11px] text-amber-600 font-medium">
            Pending Execution
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            Completed Lessons
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {metrics.completed}
          </p>
          <p className="mt-0.5 text-[11px] text-emerald-600 font-medium">
            Evaluated & Logged
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            Cancelled / No Show
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {metrics.cancelled}
          </p>
          <p className="mt-0.5 text-[11px] text-red-600 font-medium">
            Slot Available
          </p>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="font-bold text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="font-bold text-emerald-500 hover:text-emerald-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main View Area */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-xs font-medium text-slate-500">
              Loading practical sessions...
            </p>
          </div>
        </div>
      ) : viewMode === 'calendar' ? (
        <SessionCalendarView
          sessions={sessions}
          anchorDate={calendarAnchorDate}
          onChangeAnchorDate={setCalendarAnchorDate}
          onSelectSession={handleOpenEdit}
          onOpenAttendance={handleOpenAttendance}
          onOpenBooking={handleOpenNewBooking}
        />
      ) : (
        <SessionListView
          sessions={filteredSessions}
          branches={branches}
          instructors={instructors}
          categories={categories}
          filters={filters}
          onFilterChange={setFilter}
          onResetFilters={resetFilters}
          onSelectSession={handleOpenEdit}
          onOpenAttendance={handleOpenAttendance}
          onCancelSession={handleOpenCancel}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {/* Booking & Edit Modal */}
      <SessionBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialSession={selectedSessionForEdit}
        initialDate={bookingInitialDate}
        initialStartTime={bookingInitialStartTime}
        drivingSchoolId={drivingSchoolId}
        branches={branches}
        students={students}
        instructors={instructors}
        vehicles={vehicles}
        categories={categories}
        onCheckConflicts={checkConflicts}
        onSave={async (input) => {
          if (selectedSessionForEdit) {
            await handleUpdateSession(
              selectedSessionForEdit.id,
              input as UpdatePracticalSessionInput,
            )
          } else {
            await handleCreateSession(input as CreatePracticalSessionInput)
          }
        }}
      />

      {/* Attendance & Evaluation Modal */}
      <SessionAttendanceModal
        isOpen={isAttendanceOpen}
        session={selectedSessionForAttendance}
        onClose={() => setIsAttendanceOpen(false)}
        onSaveAttendance={handleRecordAttendance}
      />

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && sessionToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Cancel Practical Session
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Are you sure you want to cancel the lesson for{' '}
              <span className="font-semibold text-slate-900">
                {sessionToCancel.student?.full_name}
              </span>{' '}
              on {sessionToCancel.session_date}?
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cancellation Reason
              </label>
              <textarea
                rows={2}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g. Student requested reschedule due to weather"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Keep Lesson
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition-all cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PracticalSessionManagementPage
