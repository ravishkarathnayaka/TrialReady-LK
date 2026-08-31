import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiSessionFeedbackModal } from '../../../ai/components/AiSessionFeedbackModal'
import { SessionAttendanceModal } from '../../../sessions/components/SessionAttendanceModal'
import type {
  PracticalSessionWithRelations,
  RecordAttendanceInput,
} from '../../../sessions/types/session'
import { InstructorStatsCards } from '../components/InstructorStatsCards'
import { InstructorStudentsRoster } from '../components/InstructorStudentsRoster'
import { InstructorTodayAgenda } from '../components/InstructorTodayAgenda'
import { useInstructorPortal } from '../hooks/useInstructorPortal'

interface InstructorPortalPageProps {
  drivingSchoolId: string
}

export const InstructorPortalPage: React.FC<InstructorPortalPageProps> = ({
  drivingSchoolId,
}) => {
  const {
    todaySessions,
    students,
    stats,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    handleUpdateAttendance,
  } = useInstructorPortal(drivingSchoolId)

  const [selectedSessionForAttendance, setSelectedSessionForAttendance] =
    useState<PracticalSessionWithRelations | null>(null)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)

  const [selectedSessionForAi, setSelectedSessionForAi] =
    useState<PracticalSessionWithRelations | null>(null)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)

  const handleOpenAttendance = (session: PracticalSessionWithRelations) => {
    setSelectedSessionForAttendance(session)
    setIsAttendanceModalOpen(true)
  }

  const handleOpenAiFeedback = (session: PracticalSessionWithRelations) => {
    setSelectedSessionForAi(session)
    setIsAiModalOpen(true)
  }

  const handleSaveAttendanceDirect = async (input: RecordAttendanceInput) => {
    if (!selectedSessionForAttendance) return
    await handleUpdateAttendance(selectedSessionForAttendance.id, input)
  }

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Loading instructor workspace...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Instructor Workspace
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              ● Active On-Duty
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage your daily practical driving lessons, record attendance, and evaluate DMT skill mastery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/sessions"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            📅 Full Calendar
          </Link>
          <Link
            to="/readiness"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            🎯 Trial Candidates Hub
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <InstructorStatsCards stats={stats} />

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="font-bold text-red-500 hover:text-red-700 cursor-pointer"
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
            className="font-bold text-emerald-500 hover:text-emerald-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Today's Lesson Agenda */}
      <InstructorTodayAgenda
        sessions={todaySessions}
        onOpenAttendance={handleOpenAttendance}
        onOpenAiFeedback={handleOpenAiFeedback}
      />

      {/* 2. Assigned Students Roster */}
      <InstructorStudentsRoster students={students} />

      {/* Attendance Modal */}
      <SessionAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        session={selectedSessionForAttendance}
        onSaveAttendance={async (_id, input) => {
          await handleSaveAttendanceDirect(input)
        }}
      />

      {/* AI Session Feedback Synthesizer Modal */}
      {selectedSessionForAi && (
        <AiSessionFeedbackModal
          isOpen={isAiModalOpen}
          onClose={() => {
            setIsAiModalOpen(false)
            setSelectedSessionForAi(null)
          }}
          studentName={selectedSessionForAi.student?.full_name || 'Student'}
          sessionDate={selectedSessionForAi.session_date}
          durationMinutes={90}
          skillsCovered={selectedSessionForAi.skills_covered || ['Basic Vehicle Control']}
          studentRating={selectedSessionForAi.student_rating || 4}
          vehicleReg={selectedSessionForAi.vehicle?.registration_number || 'WP CAB-4921'}
          instructorName="Principal Instructor"
        />
      )}
    </div>
  )
}

export default InstructorPortalPage
