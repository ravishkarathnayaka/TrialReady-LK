import React from 'react'
import type { ReadinessTier } from '../types/readiness'
import { getReadinessTierInfo } from '../utils/readinessEngine'

interface ReadinessScoreGaugeProps {
  score: number
  tier: ReadinessTier
  summary?: string
}

export const ReadinessScoreGauge: React.FC<ReadinessScoreGaugeProps> = ({
  score,
  tier,
  summary,
}) => {
  const tierInfo = getReadinessTierInfo(tier)

  // Circular gauge math (radius 54, circumference 2 * PI * 54 ≈ 339.29)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center">
      {/* Top Header Badge */}
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
        <span>🤖</span> AI Trial Readiness Evaluation
      </span>

      {/* SVG Circular Radial Gauge */}
      <div className="relative mt-4 flex items-center justify-center">
        <svg className="h-40 w-40 -rotate-90 transform" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={tierInfo.color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score & Label */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black tracking-tight text-slate-900">
            {score}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Readiness
          </span>
        </div>
      </div>

      {/* Tier Badge */}
      <div className="mt-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs border ${tierInfo.badgeClass}`}
        >
          {tierInfo.label}
        </span>
      </div>

      {/* Summary */}
      <p className="mt-2 text-xs text-slate-600 max-w-sm">
        {summary || tierInfo.description}
      </p>
    </div>
  )
}

export default ReadinessScoreGauge
