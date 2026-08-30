import React from 'react'
import { Link } from 'react-router-dom'
import type { ReadinessFilters } from '../hooks/useSchoolReadinessOverview'
import type { StudentReadinessProfile } from '../types/readiness'
import { getReadinessTierInfo } from '../utils/readinessEngine'

interface ReadinessOverviewTableProps {
  profiles: StudentReadinessProfile[]
  filters: ReadinessFilters
  onFilterChange: <K extends keyof ReadinessFilters>(
    key: K,
    value: ReadinessFilters[K],
  ) => void
  onResetFilters: () => void
}

export const ReadinessOverviewTable: React.FC<ReadinessOverviewTableProps> = ({
  profiles,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const hasActiveFilters = Boolean(filters.search) || filters.tier !== 'all'

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Search Student / Admission #
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search candidate by name or admission number..."
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Trial Readiness Tier
            </label>
            <select
              value={filters.tier}
              onChange={(e) => onFilterChange('tier', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Candidates</option>
              <option value="trial_ready">🏆 Trial Ready (≥ 85%)</option>
              <option value="nearly_ready">⚡ Nearly Ready (70–84%)</option>
              <option value="needs_practice">🚗 Needs Practice (50–69%)</option>
              <option value="not_ready">⚠️ Not Ready (&lt; 50%)</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-end border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Candidates Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Readiness Score</th>
                <th className="px-4 py-3">Readiness Tier</th>
                <th className="px-4 py-3">Practical Sessions</th>
                <th className="px-4 py-3">DMT Skills Covered</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No candidate records found matching your filters.
                  </td>
                </tr>
              ) : (
                profiles.map((p) => {
                  const tierInfo = getReadinessTierInfo(
                    p.evaluation.readiness_tier,
                  )

                  return (
                    <tr
                      key={p.student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">
                          {p.student.full_name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {p.student.admission_number}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <span className="font-black text-slate-900">
                            {p.evaluation.readiness_score}%
                          </span>
                          <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${p.evaluation.readiness_score}%`,
                                backgroundColor: tierInfo.color,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] border ${tierInfo.badgeClass}`}
                        >
                          {tierInfo.label}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                        {p.totalSessionsCount} sessions ({p.evaluation.practical_hours_completed} hrs)
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                          {p.evaluation.skills_mastered_count} / 7 Core Skills
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link
                          to={`/students/${p.student.id}/readiness`}
                          className="inline-block rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                        >
                          AI Evaluation →
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReadinessOverviewTable
