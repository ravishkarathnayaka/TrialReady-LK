import React, { useEffect, useState } from 'react'
import type { PaymentMethod, RecordPaymentInput, StudentFinancialLedger } from '../types/financials'
import { formatLKR, generateReceiptNumber } from '../utils/financialUtils'

interface RecordPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  drivingSchoolId: string
  ledger: StudentFinancialLedger | null
  onSavePayment: (input: RecordPaymentInput) => Promise<unknown>
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  drivingSchoolId,
  ledger,
  onSavePayment,
}) => {
  const [amount, setAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [paymentReference, setPaymentReference] = useState('')
  const [receiptNumber, setReceiptNumber] = useState('')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0]
      setPaymentDate(today)
      setReceiptNumber(generateReceiptNumber())
      setPaymentMethod('cash')
      setPaymentReference('')
      setNotes('')
      // Default amount to remaining balance if any, else 10000
      if (ledger && ledger.balance > 0) {
        setAmount(ledger.balance.toString())
      } else {
        setAmount('15000')
      }
      setError(null)
    }
  }, [isOpen, ledger])

  if (!isOpen || !ledger) return null

  const handlePayFullBalance = () => {
    if (ledger.balance > 0) {
      setAmount(ledger.balance.toString())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const amtNum = parseFloat(amount)
    if (isNaN(amtNum) || amtNum <= 0) {
      setError('Please enter a valid payment amount greater than 0.')
      return
    }
    if (!paymentDate) {
      setError('Payment date is required.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSavePayment({
        driving_school_id: drivingSchoolId,
        student_id: ledger.student.id,
        enrolment_id: ledger.enrolment?.id || null,
        receipt_number: receiptNumber.trim() || generateReceiptNumber(),
        payment_date: paymentDate,
        amount: amtNum,
        payment_method: paymentMethod,
        payment_reference: paymentReference.trim() || null,
        notes: notes.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Record Student Payment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {ledger.student.full_name} ({ledger.student.admission_number})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Balance Overview Banner */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Agreed Package Fee:</span>
            <p className="font-bold text-slate-900">
              {formatLKR(ledger.totalFee)}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Total Paid:</span>
            <p className="font-bold text-emerald-700">
              {formatLKR(ledger.totalPaid)}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Remaining Due:</span>
            <p className="font-bold text-amber-900">
              {formatLKR(ledger.balance)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Payment Amount (LKR) <span className="text-red-500">*</span>
              </label>
              {ledger.balance > 0 && (
                <button
                  type="button"
                  onClick={handlePayFullBalance}
                  className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Pay Full Balance ({formatLKR(ledger.balance)})
                </button>
              )}
            </div>
            <input
              type="number"
              min={1}
              step={100}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 15000"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-black text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="cash">💵 Cash</option>
                <option value="bank_transfer">🏦 Bank Transfer</option>
                <option value="card">💳 Card Payment</option>
                <option value="cheque">📄 Cheque</option>
                <option value="online">🌐 Online Transfer</option>
              </select>
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Receipt Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receipt #
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Reference */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ref / Slip # (Optional)
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g. TXN-89412"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Collector Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 1st Instalment at registration"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecordPaymentModal
