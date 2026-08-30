import React from 'react'
import { Link } from 'react-router-dom'
import { ReadinessOverviewTable } from '../components/ReadinessOverviewTable'
import { useSchoolReadinessOverview } from '../hooks/useSchoolReadinessOverview'

interface SchoolReadinessDashboardPageProps {
  drivingSchoolId: string
}

export const SchoolReadinessDashboardPage: React.FC<
  SchoolReadinessDashboardPageProps
> = ({ drivingSchoolId }) => {
  const {
    filteredProfiles,
    filters,
    metrics,
    isLoading,
    errorMessage,
    setFilter,
    resetFilters,
  } = useSchoolReadinessOverview(drivingSchoolId)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            DMT Trial Readiness & Candidates
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            AI-driven readiness evaluations analyzing practical hours, maneuvers mastered, and DMT pre-requisites.
          </p>
        </div>

        <Link
          to="/journey"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          🎓 Learner Journey Overview
        </Link>
      </div>

      {/* KPI Candidate Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            Total Candidates
          </span>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {metrics.totalCandidates}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">
            Active Learners
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            Trial Ready
          </span>
          <p className="mt-1.5 text-2xl font-black text-emerald-600">
            {metrics.trialReadyCount}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">
            ≥ 85% Pass Probability
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            Nearly Ready
          </span>
          <p className="mt-1.5 text-2xl font-black text-blue-600">
            {metrics.nearlyReadyCount}
          </p>
          <span className="text-[10px] text-blue-600 font-medium">
            1–2 Mock Tests Needed
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            Needs Practice
          </span>
          <p className="mt-1.5 text-2xl font-black text-amber-600">
            {metrics.needsPracticeCount}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">
            In Training
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">
            School Avg Score
          </span>
          <p className="mt-1.5 text-2xl font-black text-indigo-600">
            {metrics.avgScore}%
          </p>
          <span className="text-[10px] text-indigo-600 font-medium">
            Overall Readiness
          </span>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Main Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-xs font-medium text-slate-500">
              Evaluating trial candidates...
            </p>
          </div>
        </div>
      ) : (
        <ReadinessOverviewTable
          profiles={filteredProfiles}
          filters={filters}
          onFilterChange={setFilter}
          onResetFilters={resetFilters}
        />
      )}
    </div>
  )
}

export default SchoolReadinessDashboardPage
