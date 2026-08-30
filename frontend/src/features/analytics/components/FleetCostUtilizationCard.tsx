import React from 'react'
import type { FleetUtilizationMetric } from '../types/analytics'

interface FleetCostUtilizationCardProps {
  fleet: FleetUtilizationMetric[]
}

export const FleetCostUtilizationCard: React.FC<
  FleetCostUtilizationCardProps
> = ({ fleet }) => {
  const totalFleetHours = fleet.reduce(
    (sum, v) => sum + Number(v.totalHoursDriven || 0),
    0,
  )
  const totalMaintenance = fleet.reduce(
    (sum, v) => sum + Number(v.maintenanceExpenses || 0),
    0,
  )

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Vehicle Fleet Utilization & Operating Expenses
          </h3>
          <p className="text-xs text-slate-500">
            Training hours logged and maintenance expenses per training vehicle
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 border border-blue-200">
            🚗 {totalFleetHours.toFixed(1)} Total Hours Driven
          </span>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
            Rs. {totalMaintenance.toLocaleString('en-LK')} Maintenance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fleet.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-black text-slate-900">
                  {v.registrationNumber}
                </p>
                <p className="text-[11px] text-slate-500">{v.makeModel}</p>
              </div>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                {v.transmissionType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-white p-2 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block">
                  Training Hours
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {v.totalHoursDriven} hrs
                </span>
              </div>

              <div className="rounded-xl bg-white p-2 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block">
                  Sessions
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {v.completedSessionsCount}
                </span>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                <span>Fleet Utilization</span>
                <span>{v.utilizationRate}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${v.utilizationRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FleetCostUtilizationCard
