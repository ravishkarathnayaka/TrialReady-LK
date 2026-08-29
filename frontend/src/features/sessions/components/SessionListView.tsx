import React from 'react'
import type { SessionFilters } from '../hooks/usePracticalSessions'
import type {
  PracticalSessionWithRelations,
  SessionBranchSummary,
  SessionCategorySummary,
  SessionInstructorSummary,
} from '../types/session'
import {
  formatSessionDuration,
  formatTime12Hour,
} from '../utils/sessionValidation'

interface SessionListViewProps {
  sessions: PracticalSessionWithRelations[]
  branches: SessionBranchSummary[]
  instructors: SessionInstructorSummary[]
  categories: SessionCategorySummary[]
  filters: SessionFilters
  onFilterChange: <K extends keyof SessionFilters>(
    key: K,
    value: SessionFilters[K],
  ) => void
  onResetFilters: () => void
  onSelectSession: (session: PracticalSessionWithRelations) => void
  onOpenAttendance: (session: PracticalSessionWithRelations) => void
  onCancelSession: (session: PracticalSessionWithRelations) => void
  onDeleteSession: (sessionId: string) => void
}

export const SessionListView: React.FC<SessionListViewProps> = ({
  sessions,
  branches,
  instructors,
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectSession,
  onOpenAttendance,
  onCancelSession,
  onDeleteSession,
}) => {
  const getStatusBadge = (status: string, attendance: string) => {
    if (status === 'cancelled') {
      return (
        <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
          Cancelled
        </span>
      )
    }
    if (status === 'completed' || attendance === 'present') {
      return (
        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
          ✓ Completed
        </span>
      )
    }
    if (attendance === 'absent' || status === 'no_show') {
      return (
        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
          No Show
        </span>
      )
    }
    return (
      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
        Scheduled
      </span>
    )
  }

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status !== 'all' ||
    filters.branchId !== 'all' ||
    filters.instructorId !== 'all' ||
    filters.categoryId !== 'all' ||
    Boolean(filters.date)

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Student, Instructor, Vehicle..."
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onFilterChange('date', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Branch
            </label>
            <select
              value={filters.branchId}
              onChange={(e) => onFilterChange('branchId', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Instructor
            </label>
            <select
              value={filters.instructorId}
              onChange={(e) => onFilterChange('instructorId', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Instructors</option>
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Licence Category */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Category
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) => onFilterChange('categoryId', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
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

      {/* Sessions Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Instructor</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No practical lessons found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                sessions.map((sess) => (
                  <tr
                    key={sess.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-bold text-slate-900">
                        {sess.session_date}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatTime12Hour(sess.start_time)} –{' '}
                        {formatTime12Hour(sess.end_time)} (
                        {formatSessionDuration(
                          sess.start_time,
                          sess.end_time,
                        )}
                        )
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">
                        {sess.student?.full_name ?? '—'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {sess.student?.admission_number}
                      </p>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                        {sess.licence_category?.code}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">
                        {sess.instructor?.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {sess.instructor?.phone}
                      </p>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {sess.vehicle ? (
                        <div>
                          <p className="font-semibold text-slate-900">
                            {sess.vehicle.registration_number}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {sess.vehicle.make} {sess.vehicle.model}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-slate-700">{sess.branch?.name}</span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(sess.status, sess.attendance_status)}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {sess.status === 'scheduled' && (
                          <button
                            type="button"
                            onClick={() => onOpenAttendance(sess)}
                            className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                          >
                            Mark
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectSession(sess)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Edit
                        </button>

                        {sess.status === 'scheduled' && (
                          <button
                            type="button"
                            onClick={() => onCancelSession(sess)}
                            className="rounded-lg border border-red-200 bg-red-50/50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        {sess.status === 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => onDeleteSession(sess.id)}
                            className="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SessionListView
