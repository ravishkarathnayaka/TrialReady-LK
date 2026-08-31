import React from 'react'
import { predictTrialOutcome } from '../utils/predictiveModel'

interface AiTrialPredictorCardProps {
  practicalHours: number
  skillsCovered: string[]
  averageRating: number | null
  permitDaysRemaining: number
  hasMedicalCleared: boolean
  hasTheoryPassed: boolean
}

export const AiTrialPredictorCard: React.FC<AiTrialPredictorCardProps> = ({
  practicalHours,
  skillsCovered,
  averageRating,
  permitDaysRemaining,
  hasMedicalCleared,
  hasTheoryPassed,
}) => {
  const prediction = predictTrialOutcome({
    practicalHours,
    skillsCovered,
    averageRating,
    permitDaysRemaining,
    hasMedicalCleared,
    hasTheoryPassed,
  })

  return (
    <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-white via-indigo-50/20 to-blue-50/40 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              AI Trial Outcome Predictor & Risk Forecaster
            </h3>
            <span className="rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 border border-indigo-300">
              Confidence: {prediction.confidenceScore}%
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Predictive machine learning simulation modeled on Sri Lanka DMT trial standards
          </p>
        </div>

        {/* Big Probability Badge */}
        <div className="text-right">
          <div className="inline-flex flex-col items-end">
            <span className="text-3xl font-black text-indigo-700 tracking-tight">
              {prediction.passProbability}%
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              1st Attempt Pass Probability
            </span>
          </div>
        </div>
      </div>

      {/* Probability Gauge Bar */}
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              prediction.passProbability >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                : prediction.passProbability >= 60
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                : 'bg-gradient-to-r from-amber-500 to-red-500'
            }`}
            style={{ width: `${prediction.passProbability}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>⚠️ High Risk (&lt;50%)</span>
          <span>⚡ Moderate (60-79%)</span>
          <span>🏆 High Probability (80%+)</span>
        </div>
      </div>

      {/* AI Key Insight */}
      <div className="rounded-2xl bg-indigo-950 text-white p-4 shadow-sm space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
          <span>🧠</span> AI Behavioral Insight & Readiness Roadmap
        </div>
        <p className="text-xs text-indigo-100 leading-relaxed">{prediction.keyInsight}</p>
      </div>

      {/* Maneuver Risk Breakdown Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Maneuver-by-Maneuver Failure Risk Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction.maneuverRisks.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{m.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                    m.riskLevel === 'low'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : m.riskLevel === 'moderate'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                  }`}
                >
                  {m.riskPercentage}% Risk
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    m.riskLevel === 'low'
                      ? 'bg-emerald-500'
                      : m.riskLevel === 'moderate'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${m.riskPercentage}%` }}
                />
              </div>

              <p className="text-[10px] text-slate-500 leading-tight">
                💡 <span className="font-semibold text-slate-600">Advice:</span> {m.mitigationAdvice}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Optimal Date Window & Recommendations Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
        <div className="rounded-2xl bg-white border border-slate-200 p-3 flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <span className="text-[10px] font-bold text-slate-500 block uppercase">
              Optimal DMT Trial Window
            </span>
            <span className="text-xs font-black text-slate-900">
              {prediction.optimalTrialDateStart} — {prediction.optimalTrialDateEnd}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-3 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <span className="text-[10px] font-bold text-slate-500 block uppercase">
              Recommended Mock Sessions
            </span>
            <span className="text-xs font-black text-indigo-700">
              {prediction.recommendedMockSessionsCount} Focused Mock Test Session(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiTrialPredictorCard
