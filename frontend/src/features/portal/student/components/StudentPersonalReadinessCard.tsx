import React from 'react'
import { Link } from 'react-router-dom'
import type { StudentReadinessProfile } from '../../../readiness/types/readiness'
import { getReadinessTierInfo } from '../../../readiness/utils/readinessEngine'

interface StudentPersonalReadinessCardProps {
  readinessProfile: StudentReadinessProfile | null
}

export const StudentPersonalReadinessCard: React.FC<
  StudentPersonalReadinessCardProps
> = ({ readinessProfile }) => {
  if (!readinessProfile) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">AI Trial Readiness</h3>
        <p className="text-xs text-slate-400 mt-2">
          Readiness score will be available after your first practical lesson.
        </p>
      </div>
    )
  }

  const { evaluation } = readinessProfile
  const tierInfo = getReadinessTierInfo(evaluation.readiness_tier)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Personal DMT Trial Readiness
            </h3>
            <p className="text-xs text-slate-500">
              Real-time evaluation based on your practical skills & hours
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs border ${tierInfo.badgeClass}`}
        >
          {tierInfo.label}
        </span>
      </div>

      {/* Score & Progress */}
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3 border border-slate-200 shadow-2xs min-w-[80px]">
          <span className="text-2xl font-black text-slate-900">
            {evaluation.readiness_score}%
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Readiness
          </span>
        </div>

        <div className="flex-1 space-y-1.5">
          <p className="text-xs font-semibold text-slate-800">
            {tierInfo.description}
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
            <span>🚗 {evaluation.practical_hours_completed} Practical Hours</span>
            <span>•</span>
            <span>🎯 {evaluation.skills_mastered_count} / 7 Core Skills Mastered</span>
          </div>
        </div>
      </div>

      {/* Recommendation Quote */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-700">
        <strong className="text-blue-900 block font-semibold mb-0.5">
          Instructor & AI Recommendation:
        </strong>
        {evaluation.recommendation_summary}
      </div>

      {/* Missing Skills Pills */}
      {evaluation.skills_missing.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-700 block">
            Skills to practice in your next session:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {evaluation.skills_missing.map((s) => (
              <span
                key={s}
                className="rounded-lg bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-3 text-right">
        <Link
          to={`/students/${readinessProfile.student.id}/readiness`}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          View Full AI Criteria Breakdown →
        </Link>
      </div>
    </div>
  )
}

export default StudentPersonalReadinessCard
