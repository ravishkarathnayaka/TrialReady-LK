import React, { useEffect, useState } from 'react'
import type { SavePermitInput, StudentPermit } from '../types/journey'
import { calculateDefaultPermitExpiry } from '../utils/journeyUtils'

interface PermitModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  drivingSchoolId: string
  existingPermit: StudentPermit | null
  onSave: (input: SavePermitInput) => Promise<void>
}

export const PermitModal: React.FC<PermitModalProps> = ({
  isOpen,
  onClose,
  studentId,
  drivingSchoolId,
  existingPermit,
  onSave,
}) => {
  const [permitNumber, setPermitNumber] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [dmtReference, setDmtReference] = useState('')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existingPermit) {
      setPermitNumber(existingPermit.permit_number)
      setIssueDate(existingPermit.issue_date)
      setExpiryDate(existingPermit.expiry_date)
      setDmtReference(existingPermit.dmt_reference || '')
      setNotes(existingPermit.notes || '')
    } else {
      const today = new Date().toISOString().split('T')[0]
      setPermitNumber('')
      setIssueDate(today)
      setExpiryDate(calculateDefaultPermitExpiry(today))
      setDmtReference('')
      setNotes('')
    }
    setError(null)
  }, [existingPermit, isOpen])

  if (!isOpen) return null

  const handleIssueDateChange = (newIssueDate: string) => {
    setIssueDate(newIssueDate)
    setExpiryDate(calculateDefaultPermitExpiry(newIssueDate))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!permitNumber.trim()) {
      setError('Permit number is required.')
      return
    }
    if (!issueDate) {
      setError('Issue date is required.')
      return
    }
    if (!expiryDate) {
      setError('Expiry date is required.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSave({
        driving_school_id: drivingSchoolId,
        student_id: studentId,
        permit_number: permitNumber.trim().toUpperCase(),
        issue_date: issueDate,
        expiry_date: expiryDate,
        dmt_reference: dmtReference.trim() || null,
        notes: notes.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save permit.')
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
              {existingPermit ? "Renew / Update Learner's Permit" : "Record Learner's Permit"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Department of Motor Traffic (DMT) 6-month Learner's Permit
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Permit Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Permit Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={permitNumber}
              onChange={(e) => setPermitNumber(e.target.value)}
              placeholder="e.g. WP/LP/2026/0491"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono uppercase text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Issue Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => handleIssueDateChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Date (6 Months) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* DMT Barcode Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              DMT Reference / Barcode (Optional)
            </label>
            <input
              type="text"
              value={dmtReference}
              onChange={(e) => setDmtReference(e.target.value)}
              placeholder="e.g. DMT-REF-90214"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Endorsed for Light Vehicle Class B1 & B"
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
              {isSubmitting ? 'Saving...' : 'Save Permit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PermitModal
