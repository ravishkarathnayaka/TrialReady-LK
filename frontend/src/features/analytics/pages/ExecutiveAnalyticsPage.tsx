import React, { useState } from 'react'
import { DmtAuditExportModal } from '../components/DmtAuditExportModal'
import { FleetCostUtilizationCard } from '../components/FleetCostUtilizationCard'
import { InstructorPerformanceTable } from '../components/InstructorPerformanceTable'
import { TrialPassRateChartCard } from '../components/TrialPassRateChartCard'
import { useExecutiveAnalytics } from '../hooks/useExecutiveAnalytics'

interface ExecutiveAnalyticsPageProps {
  drivingSchoolId: string
}

export const ExecutiveAnalyticsPage: React.FC<ExecutiveAnalyticsPageProps> = ({
  drivingSchoolId,
}) => {
  const {
    timeRange,
    setTimeRange,
    summary,
    isLoading,
    errorMessage,
    handleExportDmtAudit,
    handleExportFinancialLedger,
    handleExportInstructorPerformance,
  } = useExecutiveAnalytics(drivingSchoolId)

  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  if (isLoading || !summary) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Calculating executive analytics & audit metrics...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Executive Analytics & Audit Reports
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              DMT Sri Lanka Standard
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Driving academy performance intelligence, instructor benchmarks, fleet utilization, and official regulatory audit exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>📥</span> Export Audit Reports (CSV)
          </button>
        </div>
      </div>

      {/* Time Range Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">
            Period:
          </span>
          <button
            type="button"
            onClick={() => setTimeRange('30_days')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
              timeRange === '30_days'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('90_days')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
              timeRange === '90_days'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Last 90 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('year_to_date')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
              timeRange === 'year_to_date'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Year to Date
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('all_time')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer ${
              timeRange === 'all_time'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* 1. Trial Pass Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            DMT Trial Pass Rate
          </span>
          <p className="text-2xl font-black text-emerald-700 sm:text-3xl">
            {summary.trialAnalytics.overallPassRate}%
          </p>
          <span className="text-[11px] font-bold text-emerald-600">
            {summary.trialAnalytics.passedTrials} passed of {summary.trialAnalytics.totalTrials} trials
          </span>
        </div>

        {/* 2. Active Enrolled Learners */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Active Enrolled Learners
          </span>
          <p className="text-2xl font-black text-slate-900 sm:text-3xl">
            {summary.activeStudentsCount}
          </p>
          <span className="text-[11px] text-slate-400">
            {summary.totalSessionsConducted} practical sessions conducted
          </span>
        </div>

        {/* 3. Revenue Collected */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Revenue Collected
          </span>
          <p className="text-2xl font-black text-slate-900 sm:text-3xl">
            Rs. {summary.revenue.totalRevenueCollected.toLocaleString('en-LK')}
          </p>
          <span className="text-[11px] font-bold text-indigo-600">
            {summary.revenue.collectionEfficiencyPercentage}% Collection Efficiency
          </span>
        </div>

        {/* 4. Fleet Utilization */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Training Fleet Vehicles
          </span>
          <p className="text-2xl font-black text-slate-900 sm:text-3xl">
            {summary.fleet.length} Vehicles
          </p>
          <span className="text-[11px] font-bold text-blue-600">
            {summary.instructors.length} Certified Instructors
          </span>
        </div>
      </div>

      {/* 1. Trial Pass Rate Chart & Failure Root Cause */}
      <TrialPassRateChartCard analytics={summary.trialAnalytics} />

      {/* 2. Instructor Performance Benchmark Table */}
      <InstructorPerformanceTable instructors={summary.instructors} />

      {/* 3. Vehicle Fleet Utilization & Operating Expenses */}
      <FleetCostUtilizationCard fleet={summary.fleet} />

      {/* DMT Audit Export Modal */}
      <DmtAuditExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportDmtAudit={handleExportDmtAudit}
        onExportFinancialLedger={handleExportFinancialLedger}
        onExportInstructorPerformance={handleExportInstructorPerformance}
      />
    </div>
  )
}

export default ExecutiveAnalyticsPage
