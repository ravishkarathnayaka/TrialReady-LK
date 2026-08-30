import React from 'react'
import type { InstructorPerformanceMetric } from '../types/analytics'

interface InstructorPerformanceTableProps {
  instructors: InstructorPerformanceMetric[]
}

export const InstructorPerformanceTable: React.FC<
  InstructorPerformanceTableProps
> = ({ instructors }) => {
  // Sort by pass rate descending
  const sorted = [...instructors].sort((a, b) => b.trialPassRate - a.trialPassRate)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Instructor Effectiveness & Benchmark Rankings
          </h3>
          <p className="text-xs text-slate-500">
            Performance comparison based on trial pass rate & practical lessons conducted
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {instructors.length} Certified Instructors
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Assigned Students</th>
              <th className="px-4 py-3">Lessons Conducted</th>
              <th className="px-4 py-3">Training Hours</th>
              <th className="px-4 py-3">Trial Pass Rate</th>
              <th className="px-4 py-3 text-right">Student Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((inst, i) => (
              <tr key={inst.id || i} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{inst.name}</div>
                  <div className="font-mono text-[10px] text-slate-400">
                    {inst.staffNumber}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-700">
                  {inst.assignedStudentsCount} Students
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {inst.completedSessionsCount} Sessions
                </td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">
                  {inst.totalHoursConducted} hrs
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-black border ${
                      inst.trialPassRate >= 85
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : inst.trialPassRate >= 70
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {inst.trialPassRate}% Pass ({inst.trialsPassed}/{inst.trialsPresented})
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-black text-amber-600">
                  {inst.averageStudentRating} ★
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InstructorPerformanceTable
