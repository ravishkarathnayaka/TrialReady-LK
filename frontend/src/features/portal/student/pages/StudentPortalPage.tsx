import React from 'react'
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
    </div>
  )
}

export default StudentPortalPage
