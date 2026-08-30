import React from 'react'
import { Link } from 'react-router-dom'
import type { StudentReadinessProfile } from '../../../readiness/types/readiness'
import { getReadinessTierInfo } from '../../../readiness/utils/readinessEngine'

interface InstructorStudentsRosterProps {
  students: StudentReadinessProfile[]
}

export const InstructorStudentsRoster: React.FC<
  InstructorStudentsRosterProps
> = ({ students }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            My Assigned Students
          </h3>
          <p className="text-xs text-slate-500">
            Active learners currently in training
          </p>
        </div>

        <span className="text-xs font-bold text-slate-600">
          {students.length} Learners Enrolled
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Practical Sessions</th>
              <th className="px-4 py-3">Core Skills</th>
              <th className="px-4 py-3">Trial Readiness</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No students currently assigned.
                </td>
              </tr>
            ) : (
              students.map((s) => {
                const tierInfo = getReadinessTierInfo(
                  s.evaluation.readiness_tier,
                )

                return (
                  <tr
                    key={s.student.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">
                        {s.student.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {s.student.admission_number}
                        {s.student.phone ? ` • ${s.student.phone}` : ''}
                      </p>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                      {s.totalSessionsCount} sessions ({s.evaluation.practical_hours_completed} hrs)
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                        {s.evaluation.skills_mastered_count} / 7 Mastered
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] border ${tierInfo.badgeClass}`}
                      >
                        {tierInfo.label} ({s.evaluation.readiness_score}%)
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/students/${s.student.id}/journey`}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Journey
                        </Link>

                        <Link
                          to={`/students/${s.student.id}/readiness`}
                          className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                        >
                          AI Readiness →
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InstructorStudentsRoster
