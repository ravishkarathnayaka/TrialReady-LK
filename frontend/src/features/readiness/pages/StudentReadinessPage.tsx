import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { AiTrialPredictorCard } from '../../ai/components/AiTrialPredictorCard'
import { DmtLogbookModal } from '../../logbook/components/DmtLogbookModal'
import { useStudentLogbook } from '../../logbook/hooks/useStudentLogbook'
import { ReadinessFactorChecklist } from '../components/ReadinessFactorChecklist'
import { ReadinessRecommendationCard } from '../components/ReadinessRecommendationCard'
import { ReadinessScoreGauge } from '../components/ReadinessScoreGauge'
import { useStudentReadiness } from '../hooks/useStudentReadiness'

export const StudentReadinessPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const { drivingSchoolId } = useAuth()
  const {
    profile,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    handleSaveEvaluation,
  } = useStudentReadiness(studentId || '')

  const { logbookData } = useStudentLogbook(drivingSchoolId, studentId || '')
  const [showLogbook, setShowLogbook] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const onSave = async () => {
    try {
      setIsSaving(true)
      await handleSaveEvaluation()
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Running AI trial readiness evaluation...
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">Student not found</p>
        <Link
          to="/readiness"
          className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          ← Back to Candidates Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          to="/readiness"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mb-2 cursor-pointer"
        >
          ← Back to Trial Candidates Dashboard
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {profile.student.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Admission: <strong className="font-mono text-slate-700">{profile.student.admission_number}</strong> • {profile.student.branch_name}
            </p>
          </div>

          <div className="flex gap-2">
            {logbookData && (
              <button
                type="button"
                onClick={() => setShowLogbook(true)}
                className="rounded-xl border border-blue-300 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                📄 Print DMT Logbook
              </button>
            )}
            <Link
              to={`/students/${profile.student.id}/journey`}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              🎓 View Journey
            </Link>
            <Link
              to={`/students/${profile.student.id}/payments`}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              💳 View Payments
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

      {/* Top 2-Column Grid: Gauge & Criteria Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReadinessScoreGauge
            score={profile.evaluation.readiness_score}
            tier={profile.evaluation.readiness_tier}
          />
        </div>

        <div className="lg:col-span-2">
          <ReadinessFactorChecklist factors={profile.factors} />
        </div>
      </div>

      {/* Advanced AI Trial Outcome Predictor & Risk Forecaster */}
      <AiTrialPredictorCard
        practicalHours={profile.evaluation.practical_hours_completed}
        skillsCovered={profile.evaluation.skills_missing.length === 0 ? ['Hill Start', 'Reverse S-Bend', 'Parallel Parking', '3-Point Turn', 'Traffic'] : ['Clutch Control', 'Road Signs']}
        averageRating={profile.evaluation.readiness_score >= 80 ? 4.8 : profile.evaluation.readiness_score >= 60 ? 3.8 : 2.5}
        permitDaysRemaining={profile.evaluation.permit_status === 'active' ? 75 : -5}
        hasMedicalCleared={profile.evaluation.medical_status === 'passed'}
        hasTheoryPassed={profile.evaluation.theory_exam_status === 'passed'}
      />

      {/* AI Recommendation & Action Roadmap */}
      <ReadinessRecommendationCard
        evaluation={profile.evaluation}
        onSave={onSave}
        isSaving={isSaving}
      />

      {/* DMT Logbook Modal */}
      {logbookData && (
        <DmtLogbookModal
          isOpen={showLogbook}
          onClose={() => setShowLogbook(false)}
          data={logbookData}
        />
      )}
    </div>
  )
}

export default StudentReadinessPage
