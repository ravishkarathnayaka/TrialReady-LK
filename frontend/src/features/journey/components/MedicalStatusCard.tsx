import React, { useState } from 'react'
import type { SaveMedicalInput, StudentMedicalRecord } from '../types/journey'
import { calculatePermitValidity } from '../utils/journeyUtils'
import MedicalModal from './MedicalModal'

interface MedicalStatusCardProps {
  studentId: string
  drivingSchoolId: string
  medical: StudentMedicalRecord | null
  onSaveMedical: (input: SaveMedicalInput) => Promise<void>
}

export const MedicalStatusCard: React.FC<MedicalStatusCardProps> = ({
  studentId,
  drivingSchoolId,
  medical,
  onSaveMedical,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusBadge = () => {
    if (!medical || medical.status === 'not_scheduled') {
      return (
        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          Not Scheduled
        </span>
      )
    }
    if (medical.status === 'passed') {
      const validity = calculatePermitValidity(medical.expiry_date)
      if (validity.state === 'expired') {
        return (
          <span className="rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">
            Medical Expired
          </span>
        )
      }
      return (
        <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
          ✓ Fitness Cleared
        </span>
      )
    }
    if (medical.status === 'appointment_booked') {
      return (
        <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
          Booked: {medical.appointment_date}
        </span>
      )
    }
    return (
      <span className="rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">
        Unfit / Retest Required
      </span>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl border border-emerald-100">
            🏥
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              NTMI Medical Fitness
            </h3>
            <p className="text-xs text-slate-500">
              National Transport Medical Institute
            </p>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      {/* Details or Empty */}
      {medical && medical.status !== 'not_scheduled' ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">NTMI Center</span>
              <p className="mt-0.5 font-bold text-slate-800">
                {medical.ntmi_branch || 'Werahera'}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Blood Group</span>
              <p className="mt-0.5 font-bold text-slate-900">
                {medical.blood_group || '—'}
              </p>
            </div>

            {medical.status === 'passed' && (
              <>
                <div>
                  <span className="text-slate-400 font-medium">Certificate #</span>
                  <p className="mt-0.5 font-bold font-mono text-slate-900">
                    {medical.certificate_number || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Valid Until</span>
                  <p className="mt-0.5 font-semibold text-slate-800">
                    {medical.expiry_date || '—'}
                  </p>
                </div>
              </>
            )}

            <div>
              <span className="text-slate-400 font-medium">Restrictions</span>
              <p className="mt-0.5 font-semibold text-slate-800">
                {medical.restrictions || 'None'}
              </p>
            </div>

            {medical.appointment_date && (
              <div>
                <span className="text-slate-400 font-medium">Appointment</span>
                <p className="mt-0.5 font-semibold text-slate-800">
                  {medical.appointment_date}
                </p>
              </div>
            )}
          </div>

          {medical.notes && (
            <div className="border-t border-slate-200/60 pt-2 text-xs">
              <span className="text-slate-400 font-medium">Notes:</span>{' '}
              <span className="text-slate-700">{medical.notes}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 space-y-2">
          <p>No medical examination recorded yet.</p>
          <p className="text-[11px] text-slate-400">
            Book appointment at NTMI (Werahera, Nugegoda, Kandy, etc.) to clear student medical.
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
          {medical ? 'Update Medical Record' : '+ Record NTMI Medical'}
        </button>
      </div>

      <MedicalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentId={studentId}
        drivingSchoolId={drivingSchoolId}
        existingMedical={medical}
        onSave={onSaveMedical}
      />
    </div>
  )
}

export default MedicalStatusCard
