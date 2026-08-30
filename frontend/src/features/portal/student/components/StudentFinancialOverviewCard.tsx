import React from 'react'
import { Link } from 'react-router-dom'
import type { StudentFinancialLedger } from '../../../financials/types/financials'
import { formatLKR, getPaymentStatus } from '../../../financials/utils/financialUtils'

interface StudentFinancialOverviewCardProps {
  ledger: StudentFinancialLedger | null
}

export const StudentFinancialOverviewCard: React.FC<
  StudentFinancialOverviewCardProps
> = ({ ledger }) => {
  if (!ledger) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">Course Fee & Payments</h3>
        <p className="text-xs text-slate-400 mt-2">No payment records found.</p>
      </div>
    )
  }

  const statusInfo = getPaymentStatus(ledger.totalFee, ledger.totalPaid)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Course Fee & Payment Balance
          </h3>
          <p className="text-xs text-slate-500">
            {ledger.enrolment?.package.name || 'Standard Driving Training Course'}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] border ${statusInfo.badgeClass}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-slate-50 p-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">
            Total Fee
          </span>
          <p className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
            {formatLKR(ledger.totalFee)}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3">
          <span className="text-[10px] font-semibold text-emerald-600 uppercase">
            Paid
          </span>
          <p className="font-black text-emerald-700 text-xs sm:text-sm mt-0.5">
            {formatLKR(ledger.totalPaid)}
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 p-3">
          <span className="text-[10px] font-semibold text-amber-800 uppercase">
            Due Balance
          </span>
          <p className="font-black text-amber-900 text-xs sm:text-sm mt-0.5">
            {formatLKR(ledger.balance)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span>Fee Settlement Progress</span>
          <span>{ledger.percentagePaid}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${ledger.percentagePaid}%` }}
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 text-right">
        <Link
          to={`/students/${ledger.student.id}/payments`}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          View Payment Receipts & History →
        </Link>
      </div>
    </div>
  )
}

export default StudentFinancialOverviewCard
