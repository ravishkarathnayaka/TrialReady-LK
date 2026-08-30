import React from 'react'
import type { StudentFinancialLedger, StudentPayment } from '../types/financials'
import { formatLKR, formatPaymentMethod } from '../utils/financialUtils'

interface PaymentReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  payment: StudentPayment | null
  ledger?: StudentFinancialLedger | null
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  ledger,
}) => {
  if (!isOpen || !payment) return null

  const handlePrint = () => {
    window.print()
  }

  const studentName =
    payment.student?.full_name || ledger?.student.full_name || 'Student'
  const admissionNumber =
    payment.student?.admission_number ||
    ledger?.student.admission_number ||
    '—'
  const packageName = ledger?.enrolment?.package.name || 'Driving Course Training'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden print:m-0 print:w-full print:max-w-none print:border-none print:shadow-none">
        {/* Modal Top Bar (hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-3 print:hidden">
          <span className="text-xs font-bold text-slate-700">
            Payment Receipt Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              🖨️ Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 space-y-6 bg-white text-slate-900" id="printable-receipt">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs">
                  TR
                </div>
                <h2 className="text-lg font-black tracking-tight text-slate-900">
                  TrialReady Driving Academy
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Department of Motor Traffic (DMT) Registered Driving School
              </p>
              <p className="text-[10px] text-slate-400">
                Official Payment Acknowledgement Receipt
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-black text-slate-900 border border-slate-300">
                {payment.receipt_number}
              </span>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">
                Date: {payment.payment_date}
              </p>
            </div>
          </div>

          {/* Student & Course Info Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs border border-slate-100">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Student Name
              </span>
              <p className="font-bold text-slate-900 text-sm">{studentName}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Admission: {admissionNumber}
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Course Package
              </span>
              <p className="font-bold text-slate-900">{packageName}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Payment Method: {formatPaymentMethod(payment.payment_method)}
              </p>
            </div>
          </div>

          {/* Payment Amount Box */}
          <div className="rounded-xl border-2 border-emerald-600 bg-emerald-50/50 p-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Amount Received
            </span>
            <p className="text-3xl font-black text-emerald-700 mt-0.5">
              {formatLKR(payment.amount)}
            </p>
            {payment.payment_reference && (
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Ref / Slip: {payment.payment_reference}
              </p>
            )}
          </div>

          {/* Ledger Summary (if provided) */}
          {ledger && ledger.totalFee > 0 && (
            <div className="border-t border-b border-slate-200 py-3 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Total Course Fee:</span>
                <span className="font-semibold">{formatLKR(ledger.totalFee)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Total Paid To Date:</span>
                <span>{formatLKR(ledger.totalPaid)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-100 pt-1.5">
                <span>Remaining Balance Due:</span>
                <span className={ledger.balance > 0 ? 'text-amber-900 font-black' : 'text-emerald-700'}>
                  {formatLKR(ledger.balance)}
                </span>
              </div>
            </div>
          )}

          {payment.notes && (
            <div className="text-[11px] text-slate-500 italic">
              Note: {payment.notes}
            </div>
          )}

          {/* Footer Signature */}
          <div className="pt-8 flex items-end justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">TrialReady LK Platform</p>
              <p className="text-[10px] text-slate-400">
                Computer-generated receipt. Valid without signature.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <p className="text-[10px] font-semibold text-slate-600">
                Authorized Officer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentReceiptModal
