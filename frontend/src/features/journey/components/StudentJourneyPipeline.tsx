import React from 'react'
import type { JourneyStageInfo } from '../types/journey'

interface StudentJourneyPipelineProps {
  stages: JourneyStageInfo[]
  overallPercentage: number
  currentStageName: string
}

export const StudentJourneyPipeline: React.FC<StudentJourneyPipelineProps> = ({
  stages,
  overallPercentage,
  currentStageName,
}) => {
  const getStageIcon = (key: JourneyStageInfo['key']) => {
    switch (key) {
      case 'registration':
        return '📝'
      case 'medical':
        return '🏥'
      case 'permit':
        return '📄'
      case 'theory':
        return '📖'
      case 'lessons':
        return '🚗'
      case 'trial':
        return '🎯'
      case 'licence':
        return '🏆'
    }
  }

  const getStatusClasses = (status: JourneyStageInfo['status']) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-emerald-600 text-white ring-4 ring-emerald-100',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          line: 'bg-emerald-600',
        }
      case 'in_progress':
        return {
          circle: 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse',
          badge: 'bg-blue-50 text-blue-800 border-blue-200 font-bold',
          line: 'bg-slate-200',
        }
      case 'blocked':
        return {
          circle: 'bg-red-600 text-white ring-4 ring-red-100',
          badge: 'bg-red-50 text-red-800 border-red-200 font-bold',
          line: 'bg-slate-200',
        }
      default:
        return {
          circle: 'bg-slate-200 text-slate-500',
          badge: 'bg-slate-100 text-slate-600 border-slate-200',
          line: 'bg-slate-200',
        }
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      {/* Top Header & Percentage Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              DMT Learner Journey
            </span>
            <h3 className="text-lg font-black text-slate-900">
              {currentStageName}
            </h3>
          </div>
          <span className="text-lg font-black text-blue-600">
            {overallPercentage}% Complete
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${Math.max(5, overallPercentage)}%` }}
          />
        </div>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        {stages.map((stage, idx) => {
          const style = getStatusClasses(stage.status)

          return (
            <div
              key={stage.key}
              className={`relative rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                stage.status === 'in_progress'
                  ? 'border-blue-300 bg-blue-50/30 shadow-xs'
                  : stage.status === 'completed'
                    ? 'border-slate-200 bg-emerald-50/20'
                    : 'border-slate-200 bg-slate-50/50 opacity-80'
              }`}
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${style.circle}`}
                  >
                    {stage.status === 'completed' ? '✓' : idx + 1}
                  </div>
                  <span className="text-base">{getStageIcon(stage.key)}</span>
                </div>

                {/* Title */}
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {stage.title}
                </h4>

                {/* Description */}
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                  {stage.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="mt-3 pt-2 border-t border-slate-200/60">
                <span
                  className={`inline-block w-full text-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${style.badge}`}
                >
                  {stage.badgeText}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StudentJourneyPipeline
