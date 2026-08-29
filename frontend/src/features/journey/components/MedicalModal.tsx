import React, { useEffect, useState } from 'react'
import type {
  SaveMedicalInput,
  StudentMedicalRecord,
  StudentMedicalStatus,
} from '../types/journey'
import { calculateDefaultPermitExpiry } from '../utils/journeyUtils'

interface MedicalModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  drivingSchoolId: string
  existingMedical: StudentMedicalRecord | null
  onSave: (input: SaveMedicalInput) => Promise<void>
}

const NTMI_BRANCHES = [
  'Werahera (Main Center)',
  'Nugegoda',
  'Gampaha',
  'Kandy',
  'Kurunegala',
  'Galle',
  'Matara',
  'Anuradhapura',
  'Badulla',
  'Ratnapura',
  'Jaffna',
]

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const MedicalModal: React.FC<MedicalModalProps> = ({
  isOpen,
  onClose,
  studentId,
  drivingSchoolId,
  existingMedical,
  onSave,
}) => {
  const [status, setStatus] = useState<StudentMedicalStatus>('not_scheduled')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [certificateNumber, setCertificateNumber] = useState('')
  const [issuedDate, setIssuedDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [ntmiBranch, setNtmiBranch] = useState(NTMI_BRANCHES[0])
  const [bloodGroup, setBloodGroup] = useState('')
  const [restrictions, setRestrictions] = useState('None')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existingMedical) {
      setStatus(existingMedical.status)
      setAppointmentDate(existingMedical.appointment_date || '')
      setCertificateNumber(existingMedical.certificate_number || '')
      setIssuedDate(existingMedical.issued_date || '')
      setExpiryDate(existingMedical.expiry_date || '')
      setNtmiBranch(existingMedical.ntmi_branch || NTMI_BRANCHES[0])
      setBloodGroup(existingMedical.blood_group || '')
      setRestrictions(existingMedical.restrictions || 'None')
      setNotes(existingMedical.notes || '')
    } else {
      const today = new Date().toISOString().split('T')[0]
      setStatus('passed')
      setAppointmentDate('')
      setCertificateNumber('')
      setIssuedDate(today)
      setExpiryDate(calculateDefaultPermitExpiry(today))
      setNtmiBranch(NTMI_BRANCHES[0])
      setBloodGroup('O+')
      setRestrictions('None')
      setNotes('')
    }
    setError(null)
  }, [existingMedical, isOpen])

  if (!isOpen) return null

  const handleIssuedDateChange = (newDate: string) => {
    setIssuedDate(newDate)
    setExpiryDate(calculateDefaultPermitExpiry(newDate))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (status === 'passed' && !certificateNumber.trim()) {
      setError('Certificate number is required for passed medical status.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSave({
        driving_school_id: drivingSchoolId,
        student_id: studentId,
        status,
        appointment_date: appointmentDate || null,
        certificate_number: certificateNumber.trim() || null,
        issued_date: issuedDate || null,
        expiry_date: expiryDate || null,
        ntmi_branch: ntmiBranch,
        blood_group: bloodGroup || null,
        restrictions: restrictions.trim() || 'None',
        notes: notes.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save medical.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              NTMI Medical Fitness Record
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              National Transport Medical Institute certificate tracking
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

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StudentMedicalStatus)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="passed">Passed (Medical Fitness Cleared)</option>
              <option value="appointment_booked">Appointment Booked</option>
              <option value="not_scheduled">Not Scheduled Yet</option>
              <option value="temporary_unfit">Temporary Unfit (Retest)</option>
              <option value="failed">Failed / Medically Unfit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* NTMI Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NTMI Branch
              </label>
              <select
                value={ntmiBranch}
                onChange={(e) => setNtmiBranch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                {NTMI_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="">Select Blood Group...</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {status === 'appointment_booked' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          )}

          {status === 'passed' && (
            <>
              {/* Certificate Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medical Certificate Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  placeholder="e.g. NTMI/2026/8941"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono uppercase text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Issued Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Issued Date
                  </label>
                  <input
                    type="date"
                    value={issuedDate}
                    onChange={(e) => handleIssuedDateChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expiry Date (6 Months)
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Restrictions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical Restrictions / Endorsements
            </label>
            <input
              type="text"
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              placeholder="e.g. Corrective Lenses Required (Glasses/Contacts)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Doctor / Examiner Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional remarks..."
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
              {isSubmitting ? 'Saving...' : 'Save Medical Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MedicalModal
