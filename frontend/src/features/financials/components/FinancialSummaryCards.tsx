import React from 'react'
import { formatLKR } from '../utils/financialUtils'

interface FinancialSummaryCardsProps {
  metrics: {
    totalStudents: number
    totalBilled: number
    totalCollected: number
    totalOutstanding: number
    collectionRate: number
    fullyPaidCount: number
    partialCount: number
    unpaidCount: number
  }
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  metrics,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Billed */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Total Revenue Billed
          </span>
          <span className="rounded-lg bg-blue-50 p-1.5 text-base">📊</span>
        </div>
        <p className="mt-2 text-2xl font-black text-slate-900">
          {formatLKR(metrics.totalBilled)}
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Across {metrics.totalStudents} enrolled students
        </p>
      </div>

      {/* 2. Total Collected */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Total Collected Revenue
          </span>
          <span className="rounded-lg bg-emerald-50 p-1.5 text-base">💰</span>
        </div>
        <p className="mt-2 text-2xl font-black text-emerald-700">
          {formatLKR(metrics.totalCollected)}
        </p>
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-bold">
            {metrics.collectionRate}% Collection Rate
          </span>
          <span className="text-slate-400">
            {metrics.fullyPaidCount} fully paid
          </span>
        </div>
      </div>

      {/* 3. Outstanding Balances */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Outstanding Balances
          </span>
          <span className="rounded-lg bg-amber-50 p-1.5 text-base">⏳</span>
        </div>
        <p className="mt-2 text-2xl font-black text-amber-900">
          {formatLKR(metrics.totalOutstanding)}
        </p>
        <p className="mt-1 text-[11px] text-amber-800 font-medium">
          {metrics.partialCount} partial • {metrics.unpaidCount} unpaid
        </p>
      </div>

      {/* 4. Student Settlement Rate */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Settlement Rate
            </span>
            <span className="rounded-lg bg-indigo-50 p-1.5 text-base">📈</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-700">
              {metrics.collectionRate}%
            </span>
            <span className="text-xs text-slate-500">of total fees settled</span>
          </div>
        </div>

        <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${metrics.collectionRate}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default FinancialSummaryCards
