import React from 'react'
import { DmtTrialAdmissionSlip } from './DmtTrialAdmissionSlip'
import type { TrialAdmissionSlipData } from '../types/logbook'

interface DmtTrialSlipModalProps {
  isOpen: boolean
  onClose: () => void
  data: TrialAdmissionSlipData
}

export const DmtTrialSlipModal: React.FC<DmtTrialSlipModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs print:bg-white print:p-0">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 sm:p-8 print:rounded-none print:shadow-none print:border-none print:p-0 print:max-w-none">
        {/* Action Header (hidden when printing) */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                DMT Practical Trial — Candidate Admission Slip
              </h3>
              <p className="text-[10px] text-slate-500">
                DMT/SL/ADM-PASS • {data.student.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨️</span> Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Document Content */}
        <DmtTrialAdmissionSlip data={data} />
      </div>
    </div>
  )
}

export default DmtTrialSlipModal
