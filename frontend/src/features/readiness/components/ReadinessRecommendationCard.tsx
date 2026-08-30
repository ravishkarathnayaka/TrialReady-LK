import React from 'react'
import type { ReadinessEvaluation } from '../types/readiness'
import { getReadinessTierInfo } from '../utils/readinessEngine'

interface ReadinessRecommendationCardProps {
  evaluation: ReadinessEvaluation
  onSave?: () => Promise<void>
  isSaving?: boolean
}

export const ReadinessRecommendationCard: React.FC<
  ReadinessRecommendationCardProps
> = ({ evaluation, onSave, isSaving }) => {
  const tierInfo = getReadinessTierInfo(evaluation.readiness_tier)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                AI Actionable Guidance & Roadmap
              </h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] border ${tierInfo.badgeClass}`}>
                {tierInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized instructions for candidate and driving instructors
            </p>
          </div>
        </div>

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Saving...' : '💾 Save Snapshot'}
          </button>
        )}
      </div>

      {/* Structured Recommendation Quote Box */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
          Recommendation Summary
        </span>
        <p className="mt-1 text-xs font-medium text-slate-800 leading-relaxed">
          {evaluation.recommendation_summary}
        </p>
      </div>

      {/* Risk Warnings (if any) */}
      {evaluation.risk_warnings.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <span>⚠️</span> Critical Risk Flags & Pre-conditions
          </span>
          <div className="space-y-1.5">
            {evaluation.risk_warnings.map((risk, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-2.5 text-xs text-amber-900"
              >
                <span className="text-amber-600 font-bold">•</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items Roadmap */}
      {evaluation.action_items.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span>📋</span> Recommended Next Action Steps
          </span>
          <div className="space-y-1.5">
            {evaluation.action_items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills Tags (if any) */}
      {evaluation.skills_missing.length > 0 && (
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-1.5">
            🎯 Specific Maneuvers to Practice:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {evaluation.skills_missing.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-purple-200 bg-purple-50 px-2 py-1 text-[11px] font-semibold text-purple-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReadinessRecommendationCard
