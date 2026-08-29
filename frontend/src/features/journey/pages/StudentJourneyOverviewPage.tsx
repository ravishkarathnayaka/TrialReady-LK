import React from 'react'
import { Link } from 'react-router-dom'
import { useJourneyOverview } from '../hooks/useJourneyOverview'
import { calculatePermitValidity } from '../utils/journeyUtils'

interface StudentJourneyOverviewPageProps {
  drivingSchoolId: string
}

export const StudentJourneyOverviewPage: React.FC<
  StudentJourneyOverviewPageProps
> = ({ drivingSchoolId }) => {
  const {
    filteredJourneys,
    filters,
    metrics,
    isLoading,
    errorMessage,
    setFilter,
    resetFilters,
  } = useJourneyOverview(drivingSchoolId)

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.stage !== 'all' ||
    filters.permitStatus !== 'all' ||
    filters.medicalStatus !== 'all'

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Learner Journey & Compliance
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Track student milestones from NTMI medical clearance and DMT learner's permits to final practical trial tests.
          </p>
        </div>

        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          👨‍🎓 Manage Students
        </Link>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Learners</span>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {metrics.totalStudents}
          </p>
          <span className="text-[10px] text-blue-600 font-medium">In Pipeline</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Permits</span>
          <p className="mt-1.5 text-2xl font-black text-emerald-600">
            {metrics.activePermits}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Valid DMT Permits</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Expiring Soon</span>
          <p className="mt-1.5 text-2xl font-black text-amber-600">
            {metrics.expiringSoonPermits}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Within 30 Days</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Expired Permits</span>
          <p className="mt-1.5 text-2xl font-black text-red-600">
            {metrics.expiredPermits}
          </p>
          <span className="text-[10px] text-red-600 font-medium">Action Required</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Medical Cleared</span>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {metrics.medicalPassed}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">NTMI Certified</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Trials Passed</span>
          <p className="mt-1.5 text-2xl font-black text-indigo-600">
            {metrics.trialPassed}
          </p>
          <span className="text-[10px] text-indigo-600 font-medium">Licence Ready</span>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Search Student
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Name, admission, permit #..."
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Journey Stage
            </label>
            <select
              value={filters.stage}
              onChange={(e) => setFilter('stage', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="1">1. Registration</option>
              <option value="2">2. NTMI Medical</option>
              <option value="3">3. Learner's Permit</option>
              <option value="4">4. Theory Exam</option>
              <option value="5">5. Practical Lessons</option>
              <option value="6">6. DMT Practical Trial</option>
              <option value="7">7. Licence Issued</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Permit Status
            </label>
            <select
              value={filters.permitStatus}
              onChange={(e) => setFilter('permitStatus', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Permit Statuses</option>
              <option value="valid">Active / Valid</option>
              <option value="expiring_soon">Expiring Soon (≤ 30 days)</option>
              <option value="expired">Expired</option>
              <option value="missing">No Permit Recorded</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              NTMI Medical
            </label>
            <select
              value={filters.medicalStatus}
              onChange={(e) => setFilter('medicalStatus', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Medical Statuses</option>
              <option value="passed">Fitness Cleared</option>
              <option value="appointment_booked">Appointment Booked</option>
              <option value="not_scheduled">Not Scheduled</option>
              <option value="temporary_unfit">Temporary Unfit</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-end border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-xs font-medium text-slate-500">
                Loading learner journeys...
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Current Stage</th>
                  <th className="px-4 py-3">Learner's Permit</th>
                  <th className="px-4 py-3">NTMI Medical</th>
                  <th className="px-4 py-3">Theory Exam</th>
                  <th className="px-4 py-3">Practical Trial</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJourneys.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-400 text-xs"
                    >
                      No student records found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredJourneys.map((j) => {
                    const permitVal = calculatePermitValidity(
                      j.permit?.expiry_date,
                    )
                    const passedTheory = j.theoryExams.find(
                      (e) => e.status === 'passed',
                    )
                    const passedTrial = j.practicalTrials.find(
                      (t) => t.status === 'passed',
                    )

                    return (
                      <tr
                        key={j.student.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">
                            {j.student.full_name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {j.student.admission_number}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
                              Stage {j.overallStage}: {j.stageName}
                            </span>
                            <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${j.percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          {j.permit ? (
                            <div>
                              <p className="font-mono text-xs font-bold text-slate-900">
                                {j.permit.permit_number}
                              </p>
                              <span
                                className={`inline-block mt-0.5 rounded px-1.5 py-0.2 text-[9px] font-semibold border ${permitVal.badgeClass}`}
                              >
                                {permitVal.label}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">
                              Not Issued
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          {j.medical?.status === 'passed' ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                              ✓ Cleared
                            </span>
                          ) : j.medical?.status === 'appointment_booked' ? (
                            <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-800 border border-blue-200">
                              Booked ({j.medical.appointment_date})
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          {passedTheory ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                              ✓ Passed
                            </span>
                          ) : j.theoryExams.length > 0 ? (
                            <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-800 border border-blue-200">
                              Scheduled
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">
                              Not Taken
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          {passedTrial ? (
                            <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-800 border border-indigo-200">
                              🏆 Passed
                            </span>
                          ) : j.practicalTrials.length > 0 ? (
                            <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200">
                              Trial Scheduled
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">
                              In Training
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <Link
                            to={`/students/${j.student.id}/journey`}
                            className="inline-block rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                          >
                            View Journey →
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentJourneyOverviewPage
