import React, { useState } from 'react'
import { DmtLogbookModal } from '../../../logbook/components/DmtLogbookModal'
import { DmtTrialSlipModal } from '../../../logbook/components/DmtTrialSlipModal'
import { useStudentLogbook } from '../../../logbook/hooks/useStudentLogbook'
import { StudentFinancialOverviewCard } from '../components/StudentFinancialOverviewCard'
import { StudentJourneyHeroCard } from '../components/StudentJourneyHeroCard'
import { StudentPersonalReadinessCard } from '../components/StudentPersonalReadinessCard'
import { StudentUpcomingLessons } from '../components/StudentUpcomingLessons'
import { useStudentPortal } from '../hooks/useStudentPortal'

interface StudentPortalPageProps {
  drivingSchoolId: string
  studentId?: string
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({
  drivingSchoolId,
  studentId,
}) => {
  const {
    journey,
    ledger,
    readiness,
    upcomingSessions,
    completedSessionsCount,
    isLoading,
    errorMessage,
  } = useStudentPortal(drivingSchoolId, studentId)

  const { logbookData, getTrialSlipData } = useStudentLogbook(drivingSchoolId, studentId || '')
  const [showLogbook, setShowLogbook] = useState(false)
  const [showTrialSlip, setShowTrialSlip] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Loading your learner dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">
          No active student profile found.
        </p>
        <p className="text-xs text-slate-500">
          Please verify your enrollment with the driving academy.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* 1. Hero Journey & Permit Status Card */}
      <StudentJourneyHeroCard
        student={journey.student}
        permit={journey.permit}
        medical={journey.medical}
        theoryExams={journey.theoryExams}
      />

      {/* 2. Upcoming Lessons & Financial Overview Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StudentUpcomingLessons
          upcomingSessions={upcomingSessions}
          completedSessionsCount={completedSessionsCount}
        />

        <StudentFinancialOverviewCard ledger={ledger} />
      </div>

      {/* 3. Personal AI Trial Readiness */}
      <StudentPersonalReadinessCard readinessProfile={readiness} />

      {/* 4. DMT Document Quick Actions */}
      {logbookData && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">📋 My Official DMT Documents</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowLogbook(true)}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              📄 View / Print DMT Logbook
            </button>
            <button
              type="button"
              onClick={() => setShowTrialSlip(true)}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              🎫 Print Trial Admission Slip
            </button>
          </div>
        </div>
      )}

      {/* DMT Logbook & Trial Slip Modals */}
      {logbookData && (
        <>
          <DmtLogbookModal
            isOpen={showLogbook}
            onClose={() => setShowLogbook(false)}
            data={logbookData}
          />
          {(() => {
            const slipData = getTrialSlipData()
            return slipData ? (
              <DmtTrialSlipModal
                isOpen={showTrialSlip}
                onClose={() => setShowTrialSlip(false)}
                data={slipData}
              />
            ) : null
          })()}
        </>
      )}
    </div>
  )
}

export default StudentPortalPage
