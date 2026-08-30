import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import PaymentReceiptModal from '../components/PaymentReceiptModal'
import RecordPaymentModal from '../components/RecordPaymentModal'
import { useStudentLedger } from '../hooks/useStudentLedger'
import type { StudentPayment } from '../types/financials'
import {
  formatLKR,
  formatPaymentMethod,
  getPaymentStatus,
} from '../utils/financialUtils'

export const StudentPaymentDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const { drivingSchoolId } = useAuth()
  const {
    ledger,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    handleRecordPayment,
    handleDeletePayment,
  } = useStudentLedger(studentId || '')

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] =
    useState<StudentPayment | null>(null)

  const handleOpenReceipt = (payment: StudentPayment) => {
    setSelectedPaymentForReceipt(payment)
    setIsReceiptModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Loading student payment ledger...
          </p>
        </div>
      </div>
    )
  }

  if (!ledger) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">Student not found</p>
        <Link
          to="/financials"
          className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          ← Back to Financials
        </Link>
      </div>
    )
  }

  const statusInfo = getPaymentStatus(ledger.totalFee, ledger.totalPaid)

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          to="/financials"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mb-2 cursor-pointer"
        >
          ← Back to Financials & Payments
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {ledger.student.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Admission: <strong className="font-mono text-slate-700">{ledger.student.admission_number}</strong> • {ledger.student.branch_name}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(true)}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span> Record Instalment
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="font-bold text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="font-bold text-emerald-500 hover:text-emerald-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Financial Status Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Agreed Course Fee</span>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {formatLKR(ledger.totalFee)}
          </p>
          <span className="text-[11px] text-slate-400">
            {ledger.enrolment ? ledger.enrolment.package.name : 'Standard Course'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Paid</span>
          <p className="mt-1.5 text-2xl font-black text-emerald-700">
            {formatLKR(ledger.totalPaid)}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">
            {ledger.percentagePaid}% settled
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Outstanding Balance</span>
          <p className="mt-1.5 text-2xl font-black text-amber-900">
            {formatLKR(ledger.balance)}
          </p>
          <span className="text-[11px] text-amber-800 font-medium">
            {ledger.balance === 0 ? 'No balance due' : 'Pending payment'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Payment Status</span>
            <div className="mt-2">
              <span className={`inline-block rounded-full px-3 py-1 text-xs border ${statusInfo.badgeClass}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${ledger.percentagePaid}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Payment Transaction History */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Payment Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Complete history of fee instalment payments & receipts
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRecordModalOpen(true)}
            className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            + New Payment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Receipt #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Reference / Slip</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                ledger.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-slate-900">
                      {p.receipt_number}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                      {p.payment_date}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-black text-emerald-700">
                      {formatLKR(p.amount)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {formatPaymentMethod(p.payment_method)}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-500">
                      {p.payment_reference || '—'}
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {p.notes || '—'}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenReceipt(p)}
                          className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                        >
                          🖨️ Receipt
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePayment(p.id)}
                          className="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        drivingSchoolId={drivingSchoolId}
        ledger={ledger}
        onSavePayment={handleRecordPayment}
      />

      <PaymentReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={selectedPaymentForReceipt}
        ledger={ledger}
      />
    </div>
  )
}

export default StudentPaymentDetailPage
