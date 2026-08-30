import React from 'react'
import type { PracticalSessionWithRelations } from '../../../sessions/types/session'

interface StudentUpcomingLessonsProps {
  upcomingSessions: PracticalSessionWithRelations[]
  completedSessionsCount: number
}

export const StudentUpcomingLessons: React.FC<
  StudentUpcomingLessonsProps
> = ({ upcomingSessions, completedSessionsCount }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Upcoming Practical Driving Lessons
          </h3>
          <p className="text-xs text-slate-500">
            Your scheduled on-road training sessions
          </p>
        </div>

        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          {completedSessionsCount} Lessons Completed
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {upcomingSessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No upcoming practical lessons scheduled yet. Contact your driving instructor to schedule your next session!
          </div>
        ) : (
          upcomingSessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center rounded-xl bg-blue-50 px-3 py-2 text-center border border-blue-100 min-w-[70px]">
                  <span className="text-[10px] font-bold uppercase text-blue-600">
                    {s.session_date}
                  </span>
                  <span className="font-mono text-xs font-black text-slate-900 mt-0.5">
                    {s.start_time.slice(0, 5)}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    Practical Driving Session
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instructor: <strong className="text-slate-700">{s.instructor?.full_name || 'Assigned Instructor'}</strong> • Vehicle: <span className="font-mono font-bold text-slate-700">{s.vehicle?.registration_number || 'Training Vehicle'}</span>
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-800">
                Confirmed
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StudentUpcomingLessons
