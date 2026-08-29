import React, { useState } from 'react'
import type { SavePermitInput, StudentPermit } from '../types/journey'
import { calculatePermitValidity } from '../utils/journeyUtils'
import PermitModal from './PermitModal'

interface PermitTrackerCardProps {
  studentId: string
  drivingSchoolId: string
  permit: StudentPermit | null
  onSavePermit: (input: SavePermitInput) => Promise<void>
}

export const PermitTrackerCard: React.FC<PermitTrackerCardProps> = ({
  studentId,
  drivingSchoolId,
  permit,
  onSavePermit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const validity = calculatePermitValidity(permit?.expiry_date)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl border border-blue-100">
            📄
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              DMT Learner's Permit
            </h3>
            <p className="text-xs text-slate-500">
              6-Month Driving Training Permit
            </p>
          </div>
        </div>

        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${validity.badgeClass}`}
        >
          {validity.label}
        </span>
      </div>

      {/* Permit Details or Empty State */}
      {permit ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Permit Number</span>
              <p className="mt-0.5 font-bold font-mono text-slate-900 text-sm">
                {permit.permit_number}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">DMT Reference</span>
              <p className="mt-0.5 font-medium text-slate-700">
                {permit.dmt_reference || '—'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Issue Date</span>
              <p className="mt-0.5 font-semibold text-slate-800">
                {permit.issue_date}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Expiry Date</span>
              <p className="mt-0.5 font-semibold text-slate-800">
                {permit.expiry_date}
              </p>
            </div>
          </div>

          {permit.notes && (
            <div className="border-t border-slate-200/60 pt-2 text-xs">
              <span className="text-slate-400 font-medium">Notes:</span>{' '}
              <span className="text-slate-700">{permit.notes}</span>
            </div>
          )}

          {validity.state === 'expiring_soon' && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900 flex items-center gap-2">
              <span>⚠️</span>
              <span>
                Permit expires in {validity.daysLeft} days. Advise student to
                renew or complete trial before expiry!
              </span>
            </div>
          )}

          {validity.state === 'expired' && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-900 flex items-center gap-2">
              <span>🚨</span>
              <span>
                Permit has expired! Practical training and trial exams are
                blocked until renewed.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 space-y-2">
          <p>No learner's permit recorded yet.</p>
          <p className="text-[11px] text-slate-400">
            Student must complete NTMI Medical clearance before obtaining DMT permit.
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          {permit ? "Renew / Update Permit" : "+ Record Learner's Permit"}
        </button>
      </div>

      <PermitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentId={studentId}
        drivingSchoolId={drivingSchoolId}
        existingPermit={permit}
        onSave={onSavePermit}
      />
    </div>
  )
}

export default PermitTrackerCard
