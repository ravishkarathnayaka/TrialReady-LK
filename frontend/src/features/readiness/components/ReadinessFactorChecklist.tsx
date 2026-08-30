import React from 'react'
import type { ReadinessFactor } from '../types/readiness'

interface ReadinessFactorChecklistProps {
  factors: ReadinessFactor[]
}

export const ReadinessFactorChecklist: React.FC<
  ReadinessFactorChecklistProps
> = ({ factors }) => {
  const getStatusIcon = (status: ReadinessFactor['status']) => {
    switch (status) {
      case 'passed':
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
            ✓
          </span>
        )
      case 'warning':
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
            !
          </span>
        )
      case 'failed':
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
            ✕
          </span>
        )
      case 'pending':
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
            ○
          </span>
        )
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            DMT Trial Prerequisites & Skills Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-factor evaluation based on Sri Lanka driving examination standards
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          Max: 100 Pts
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {factors.map((f) => (
          <div key={f.key} className="flex items-start gap-3 py-3">
            <div className="mt-0.5">{getStatusIcon(f.status)}</div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {f.title}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {f.score} / {f.maxScore} pts
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{f.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReadinessFactorChecklist
