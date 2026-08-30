import React from 'react'
import { Link } from 'react-router-dom'
import type { FinancialFilters } from '../hooks/useFinancialOverview'
import type { StudentFinancialLedger } from '../types/financials'
import { formatLKR, getPaymentStatus } from '../utils/financialUtils'

interface PaymentLedgerTableProps {
  ledgers: StudentFinancialLedger[]
  filters: FinancialFilters
  onFilterChange: <K extends keyof FinancialFilters>(
    key: K,
    value: FinancialFilters[K],
  ) => void
  onResetFilters: () => void
  onOpenRecordPayment: (ledger: StudentFinancialLedger) => void
}

export const PaymentLedgerTable: React.FC<PaymentLedgerTableProps> = ({
  ledgers,
  filters,
  onFilterChange,
  onResetFilters,
  onOpenRecordPayment,
}) => {
  const hasActiveFilters =
    Boolean(filters.search) || filters.paymentStatus !== 'all'

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Search Student / Admission # / Package
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search by student name, admission number, or package..."
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Payment Status
            </label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="all">All Payment Statuses</option>
              <option value="fully_paid">✓ Fully Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-end border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Ledgers Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course Package</th>
                <th className="px-4 py-3">Agreed Fee</th>
                <th className="px-4 py-3">Total Paid</th>
                <th className="px-4 py-3">Balance Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No student payment records found matching your filters.
                  </td>
                </tr>
              ) : (
                ledgers.map((l) => {
                  const statusBadge = getPaymentStatus(l.totalFee, l.totalPaid)

                  return (
                    <tr
                      key={l.student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">
                          {l.student.full_name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {l.student.admission_number}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        {l.enrolment ? (
                          <div>
                            <p className="font-semibold text-slate-900">
                              {l.enrolment.package.name}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">
                              {l.enrolment.package.code}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            No Package Enrolled
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                        {formatLKR(l.totalFee)}
                      </td>

                      <td className="px-4 py-3 font-bold text-emerald-700 whitespace-nowrap">
                        {formatLKR(l.totalPaid)}
                      </td>

                      <td className="px-4 py-3 font-bold text-amber-900 whitespace-nowrap">
                        {formatLKR(l.balance)}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] border ${statusBadge.badgeClass}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {l.balance > 0 && (
                            <button
                              type="button"
                              onClick={() => onOpenRecordPayment(l)}
                              className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer"
                            >
                              + Pay
                            </button>
                          )}

                          <Link
                            to={`/students/${l.student.id}/payments`}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            Ledger →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PaymentLedgerTable
