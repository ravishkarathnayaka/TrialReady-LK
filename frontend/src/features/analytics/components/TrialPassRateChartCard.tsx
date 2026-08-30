import React from 'react'
import type { DmtTrialAnalytics } from '../types/analytics'

interface TrialPassRateChartCardProps {
  analytics: DmtTrialAnalytics
}

export const TrialPassRateChartCard: React.FC<TrialPassRateChartCardProps> = ({
  analytics,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            DMT Practical Driving Trial Analytics
          </h3>
          <p className="text-xs text-slate-500">
            Official government examination pass rate benchmarks & failure causes
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-200">
          🏆 {analytics.overallPassRate}% Success Rate
        </span>
      </div>

      {/* 3 Metric Summary Blocks */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100 space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-emerald-600">
            Overall Pass Rate
          </span>
          <p className="text-2xl font-black text-emerald-800">
            {analytics.overallPassRate}%
          </p>
          <span className="text-[11px] text-emerald-700">
            {analytics.passedTrials} passed of {analytics.totalTrials} trials
          </span>
        </div>

        <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100 space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-blue-600">
            1st Attempt Pass Rate
          </span>
          <p className="text-2xl font-black text-blue-900">
            {analytics.firstAttemptPassRate}%
          </p>
          <span className="text-[11px] text-blue-700">
            First-time trial candidates
          </span>
        </div>

        <div className="rounded-2xl bg-purple-50/60 p-4 border border-purple-100 space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-purple-600">
            Re-test Pass Rate
          </span>
          <p className="text-2xl font-black text-purple-900">
            {analytics.repeatAttemptPassRate}%
          </p>
          <span className="text-[11px] text-purple-700">
            Remedial trial attempts
          </span>
        </div>
      </div>

      {/* Root-Cause Failure Analysis */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          ⚠️ Common DMT Trial Failure Points & Maneuvers
        </h4>

        <div className="space-y-2.5">
          {analytics.commonFailurePoints.map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>{item.reason}</span>
                <span className="font-mono font-bold text-slate-900">
                  {item.percentage}% ({item.count} occurrences)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrialPassRateChartCard
