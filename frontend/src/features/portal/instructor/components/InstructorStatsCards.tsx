import React from 'react'

interface InstructorStatsCardsProps {
  stats: {
    todayLessonsCount: number
    todayCompletedCount: number
    weeklyHours: number
    assignedStudentsCount: number
    trialReadyCount: number
  }
}

export const InstructorStatsCards: React.FC<InstructorStatsCardsProps> = ({
  stats,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* 1. Today's Lessons */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <span className="text-xs font-semibold text-slate-500">
          Today's Schedule
        </span>
        <p className="mt-1.5 text-2xl font-black text-slate-900">
          {stats.todayLessonsCount}
        </p>
        <p className="text-[11px] text-blue-600 font-bold mt-0.5">
          {stats.todayCompletedCount} Completed
        </p>
      </div>

      {/* 2. Weekly Driving Hours */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <span className="text-xs font-semibold text-slate-500">
          This Week
        </span>
        <p className="mt-1.5 text-2xl font-black text-indigo-600">
          {stats.weeklyHours.toFixed(1)} hrs
        </p>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Practical Driving Logged
        </p>
      </div>

      {/* 3. Assigned Students */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <span className="text-xs font-semibold text-slate-500">
          Assigned Students
        </span>
        <p className="mt-1.5 text-2xl font-black text-slate-900">
          {stats.assignedStudentsCount}
        </p>
        <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
          Active Learners
        </p>
      </div>

      {/* 4. Trial Ready Candidates */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <span className="text-xs font-semibold text-slate-500">
          Trial Ready
        </span>
        <p className="mt-1.5 text-2xl font-black text-emerald-600">
          {stats.trialReadyCount}
        </p>
        <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
          Eligible for DMT Exam
        </p>
      </div>
    </div>
  )
}

export default InstructorStatsCards
