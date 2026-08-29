import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { ExamTrialMilestones } from '../components/ExamTrialMilestones'
import { MedicalStatusCard } from '../components/MedicalStatusCard'
import { PermitTrackerCard } from '../components/PermitTrackerCard'
import { StudentJourneyPipeline } from '../components/StudentJourneyPipeline'
import { useStudentJourney } from '../hooks/useStudentJourney'
import { computeJourneyStages } from '../utils/journeyUtils'

export const StudentJourneyDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const { drivingSchoolId } = useAuth()
  const {
    journey,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    handleSavePermit,
    handleSaveMedical,
    handleSaveExamTrial,
  } = useStudentJourney(studentId || '')

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Loading student journey...
          </p>
        </div>
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">Student not found</p>
        <Link
          to="/journey"
          className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          ← Back to Journey Dashboard
        </Link>
      </div>
    )
  }

  const stageData = computeJourneyStages({
    permit: journey.permit,
    medical: journey.medical,
    theoryExams: journey.theoryExams,
    practicalTrials: journey.practicalTrials,
    completedLessonsCount: journey.completedLessonsCount,
  })

  return (
    <div className="space-y-6">
      {/* Back Navigation & Header */}
      <div>
        <Link
          to="/journey"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mb-2 cursor-pointer"
        >
          ← Back to Learner Journey Dashboard
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {journey.student.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Admission: <strong className="font-mono text-slate-700">{journey.student.admission_number}</strong> • Registered: {journey.student.registration_date} • {journey.student.branch_name}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/students"
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              View Student Profile
            </Link>
          </div>
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

      {/* 1. Visual 7-Stage Pipeline */}
      <StudentJourneyPipeline
        stages={stageData.stages}
        overallPercentage={stageData.completionPercentage}
        currentStageName={stageData.currentStageName}
      />

      {/* 2. Permits & Medical Records Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PermitTrackerCard
          studentId={journey.student.id}
          drivingSchoolId={drivingSchoolId}
          permit={journey.permit}
          onSavePermit={handleSavePermit}
        />

        <MedicalStatusCard
          studentId={journey.student.id}
          drivingSchoolId={drivingSchoolId}
          medical={journey.medical}
          onSaveMedical={handleSaveMedical}
        />
      </div>

      {/* 3. Theory & Practical Trial Milestones */}
      <ExamTrialMilestones
        studentId={journey.student.id}
        drivingSchoolId={drivingSchoolId}
        theoryExams={journey.theoryExams}
        practicalTrials={journey.practicalTrials}
        onSaveExamTrial={handleSaveExamTrial}
      />
    </div>
  )
}

export default StudentJourneyDetailPage
